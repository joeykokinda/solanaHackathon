use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

declare_id!("7yNsJvKUNgxdAHgCRY2SWb7GqsaL5HxTgSfpraHQCYdh");

#[program]
pub mod token_factory {
    use super::*;

    pub fn initialize_creator_token(
        ctx: Context<InitializeCreatorToken>,
        youtube_channel_id: String,
        initial_subscribers: u32,
        initial_avg_views: u32,
    ) -> Result<()> {
        let creator_token = &mut ctx.accounts.creator_token;
        creator_token.creator = ctx.accounts.creator.key();
        creator_token.mint = ctx.accounts.mint.key();
        creator_token.youtube_channel_id = youtube_channel_id;
        creator_token.initial_subscribers = initial_subscribers;
        creator_token.initial_avg_views = initial_avg_views;
        creator_token.current_subscribers = initial_subscribers;
        creator_token.current_avg_views = initial_avg_views;
        creator_token.launch_timestamp = Clock::get()?.unix_timestamp;
        creator_token.total_supply = 100_000_000_000_000;
        creator_token.bump = ctx.bumps.creator_token;

        let creator_key = ctx.accounts.creator.key();
        let bump = ctx.bumps.creator_token;
        let signer_seeds: &[&[&[u8]]] = &[&[
            b"creator_token",
            creator_key.as_ref(),
            &[bump],
        ]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.creator_token_account.to_account_info(),
                authority: creator_token.to_account_info(),
            },
            signer_seeds,
        );

        mint_to(cpi_ctx, creator_token.total_supply)?;

        Ok(())
    }

    pub fn update_metrics(
        ctx: Context<UpdateMetrics>,
        new_subscribers: u32,
        new_avg_views: u32,
    ) -> Result<()> {
        let creator_token = &mut ctx.accounts.creator_token;
        creator_token.current_subscribers = new_subscribers;
        creator_token.current_avg_views = new_avg_views;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCreatorToken<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + CreatorToken::INIT_SPACE,
        seeds = [b"creator_token", creator.key().as_ref()],
        bump
    )]
    pub creator_token: Account<'info, CreatorToken>,

    #[account(
        init,
        payer = creator,
        mint::decimals = 9,
        mint::authority = creator_token,
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = creator,
        associated_token::mint = mint,
        associated_token::authority = creator,
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateMetrics<'info> {
    #[account(mut)]
    pub creator_token: Account<'info, CreatorToken>,

    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct CreatorToken {
    pub creator: Pubkey,
    pub mint: Pubkey,
    #[max_len(50)]
    pub youtube_channel_id: String,
    pub initial_subscribers: u32,
    pub initial_avg_views: u32,
    pub current_subscribers: u32,
    pub current_avg_views: u32,
    pub launch_timestamp: i64,
    pub total_supply: u64,
    pub bump: u8,
}
