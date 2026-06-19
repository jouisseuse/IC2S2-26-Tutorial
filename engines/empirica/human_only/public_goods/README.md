# Public Goods

This folder is reserved for the human-only Empirica public goods example.

The example should import payoff and transition logic from
`shared/game_logic/public_goods/`, then use Empirica only for participant
assignment, rounds, stages, display, and data export.

Expected first implementation:

- Configurable `group_size`, `num_rounds`, `endowment`, and `multiplier`.
- A contribution decision page.
- Group feedback after each round.
- Export rows compatible with `shared/schemas/action.schema.json`.
