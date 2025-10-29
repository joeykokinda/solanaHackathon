use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

declare_id!("ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi");

const BASE_PRICE: u64 = 1_000;
const SCALE_FACTOR: u64 = 1_000_000_000;
const CURVE_FACTOR: u64 = 100_000_000_000_000;

#[program]
pub mod bonding_curve {
    use super::*;

    pub fn initialize_curve(ctx: Context<InitializeCurve>) -> Result<()> {
        let curve = &mut ctx.accounts.bonding_curve;
        curve.token_mint = ctx.accounts.token_mint.key();
        curve.sol_vault = ctx.accounts.sol_vault.key();
        curve.token_vault = ctx.accounts.token_vault.key();
        curve.tokens_bought = 0;
        curve.base_price = BASE_PRICE;
        curve.engagement_multiplier = SCALE_FACTOR;
        curve.bump = ctx.bumps.bonding_curve;
        curve.sol_vault_bump = ctx.bumps.sol_vault;

        let rent = Rent::get()?;
        let rent_lamports = rent.minimum_balance(0);
        
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.authority.to_account_info(),
                    to: ctx.accounts.sol_vault.to_account_info(),
                },
            ),
            rent_lamports,
        )?;

        Ok(())
    }

    pub fn buy_tokens(ctx: Context<BuyTokens>, token_amount: u64, max_sol: u64) -> Result<()> {
        let token_mint_key = ctx.accounts.bonding_curve.token_mint;
        let bump = ctx.accounts.bonding_curve.bump;
        let tokens_bought = ctx.accounts.bonding_curve.tokens_bought;
        let base_price = ctx.accounts.bonding_curve.base_price;
        let engagement_multiplier = ctx.accounts.bonding_curve.engagement_multiplier;

        let cost = calculate_buy_cost(
            tokens_bought,
            token_amount,
            base_price,
            engagement_multiplier,
        )?;

        require!(cost <= max_sol, ErrorCode::SlippageExceeded);

        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.sol_vault.to_account_info(),
                },
            ),
            cost,
        )?;

        let seeds = &[
            b"bonding_curve",
            token_mint_key.as_ref(),
            &[bump],
        ];
        let signer_seeds = &[&seeds[..]];

        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.token_vault.to_account_info(),
                    to: ctx.accounts.buyer_token_account.to_account_info(),
                    authority: ctx.accounts.bonding_curve.to_account_info(),
                },
                signer_seeds,
            ),
            token_amount,
        )?;

        ctx.accounts.bonding_curve.tokens_bought = tokens_bought.checked_add(token_amount).unwrap();

        Ok(())
    }

    pub fn sell_tokens(ctx: Context<SellTokens>, token_amount: u64, min_sol: u64) -> Result<()> {
        let curve = &mut ctx.accounts.bonding_curve;
        let token_mint_key = curve.token_mint;
        let bump = curve.bump;
        let sol_vault_bump = curve.sol_vault_bump;

        require!(
            token_amount <= curve.tokens_bought,
            ErrorCode::InsufficientLiquidity
        );

        let return_amount = calculate_sell_return(
            curve.tokens_bought,
            token_amount,
            curve.base_price,
            curve.engagement_multiplier,
        )?;

        require!(return_amount >= min_sol, ErrorCode::SlippageExceeded);

        let rent = Rent::get()?;
        let rent_minimum = rent.minimum_balance(0);
        let sol_vault_balance = ctx.accounts.sol_vault.lamports();
        
        require!(
            sol_vault_balance >= return_amount + rent_minimum,
            ErrorCode::InsufficientLiquidity
        );

        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.seller_token_account.to_account_info(),
                    to: ctx.accounts.token_vault.to_account_info(),
                    authority: ctx.accounts.seller.to_account_info(),
                },
            ),
            token_amount,
        )?;

        let bonding_curve_key = curve.key();
        let sol_vault_seeds = &[
            b"sol_vault",
            bonding_curve_key.as_ref(),
            &[sol_vault_bump],
        ];
        let sol_vault_signer_seeds = &[&sol_vault_seeds[..]];

        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.sol_vault.to_account_info(),
                    to: ctx.accounts.seller.to_account_info(),
                },
                sol_vault_signer_seeds,
            ),
            return_amount,
        )?;

        curve.tokens_bought = curve.tokens_bought.checked_sub(token_amount).unwrap();

        Ok(())
    }

    pub fn update_engagement_multiplier(
        ctx: Context<UpdateEngagementMultiplier>,
        new_multiplier: u64,
    ) -> Result<()> {
        let curve = &mut ctx.accounts.bonding_curve;
        curve.engagement_multiplier = new_multiplier;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCurve<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + BondingCurve::INIT_SPACE,
        seeds = [b"bonding_curve", token_mint.key().as_ref()],
        bump
    )]
    pub bonding_curve: Account<'info, BondingCurve>,

    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [b"sol_vault", bonding_curve.key().as_ref()],
        bump
    )]
    pub sol_vault: SystemAccount<'info>,

    #[account(
        associated_token::mint = token_mint,
        associated_token::authority = bonding_curve,
    )]
    pub token_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyTokens<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"bonding_curve", bonding_curve.token_mint.as_ref()],
        bump = bonding_curve.bump
    )]
    pub bonding_curve: Account<'info, BondingCurve>,

    #[account(
        mut,
        seeds = [b"sol_vault", bonding_curve.key().as_ref()],
        bump = bonding_curve.sol_vault_bump
    )]
    pub sol_vault: SystemAccount<'info>,

    #[account(
        mut,
        associated_token::mint = bonding_curve.token_mint,
        associated_token::authority = bonding_curve,
    )]
    pub token_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = bonding_curve.token_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SellTokens<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(
        mut,
        seeds = [b"bonding_curve", bonding_curve.token_mint.as_ref()],
        bump = bonding_curve.bump
    )]
    pub bonding_curve: Account<'info, BondingCurve>,

    #[account(
        mut,
        seeds = [b"sol_vault", bonding_curve.key().as_ref()],
        bump = bonding_curve.sol_vault_bump
    )]
    pub sol_vault: SystemAccount<'info>,

    #[account(
        mut,
        associated_token::mint = bonding_curve.token_mint,
        associated_token::authority = bonding_curve,
    )]
    pub token_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = bonding_curve.token_mint,
        associated_token::authority = seller,
    )]
    pub seller_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateEngagementMultiplier<'info> {
    #[account(mut)]
    pub bonding_curve: Account<'info, BondingCurve>,

    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct BondingCurve {
    pub token_mint: Pubkey,
    pub sol_vault: Pubkey,
    pub token_vault: Pubkey,
    pub tokens_bought: u64,
    pub base_price: u64,
    pub engagement_multiplier: u64,
    pub bump: u8,
    pub sol_vault_bump: u8,
}

fn calculate_buy_cost(
    current_supply: u64,
    amount: u64,
    base_price: u64,
    engagement_multiplier: u64,
) -> Result<u64> {
    let supply_before_tokens = current_supply.checked_div(SCALE_FACTOR).unwrap_or(0);
    let amount_tokens = amount.checked_div(SCALE_FACTOR).unwrap_or(1);
    let supply_after_tokens = supply_before_tokens.checked_add(amount_tokens).unwrap();
    
    let curve_before = supply_before_tokens
        .checked_mul(supply_before_tokens)
        .unwrap_or(0)
        .checked_div(10_000)
        .unwrap_or(0);
    
    let curve_after = supply_after_tokens
        .checked_mul(supply_after_tokens)
        .unwrap_or(0)
        .checked_div(10_000)
        .unwrap_or(0);
    
    let price_before = base_price.checked_add(curve_before).unwrap();
    let price_after = base_price.checked_add(curve_after).unwrap();
    let avg_price = price_before.checked_add(price_after).unwrap().checked_div(2).unwrap();
    
    let total_cost = avg_price
        .checked_mul(amount)
        .unwrap()
        .checked_div(SCALE_FACTOR)
        .unwrap()
        .checked_mul(engagement_multiplier)
        .unwrap()
        .checked_div(SCALE_FACTOR)
        .unwrap();

    Ok(total_cost)
}

fn calculate_sell_return(
    current_supply: u64,
    amount: u64,
    base_price: u64,
    engagement_multiplier: u64,
) -> Result<u64> {
    let supply_before_tokens = current_supply.checked_div(SCALE_FACTOR).unwrap_or(0);
    let amount_tokens = amount.checked_div(SCALE_FACTOR).unwrap_or(1);
    let supply_after_tokens = supply_before_tokens.checked_sub(amount_tokens).unwrap_or(0);
    
    let curve_before = supply_before_tokens
        .checked_mul(supply_before_tokens)
        .unwrap_or(0)
        .checked_div(10_000)
        .unwrap_or(0);
    
    let curve_after = supply_after_tokens
        .checked_mul(supply_after_tokens)
        .unwrap_or(0)
        .checked_div(10_000)
        .unwrap_or(0);
    
    let price_before = base_price.checked_add(curve_before).unwrap();
    let price_after = base_price.checked_add(curve_after).unwrap();
    let avg_price = price_before.checked_add(price_after).unwrap().checked_div(2).unwrap();
    
    let total_return = avg_price
        .checked_mul(amount)
        .unwrap()
        .checked_div(SCALE_FACTOR)
        .unwrap()
        .checked_mul(engagement_multiplier)
        .unwrap()
        .checked_div(SCALE_FACTOR)
        .unwrap();

    Ok(total_return)
}

#[error_code]
pub enum ErrorCode {
    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,
    #[msg("Insufficient liquidity in curve")]
    InsufficientLiquidity,
}
