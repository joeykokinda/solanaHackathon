use anchor_lang::prelude::*;

declare_id!("AG9Yrum19hgf3fyxGYddgppYyNnmLr1YvhEfkEV7EeUs");

#[program]
pub mod creator_vest {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
