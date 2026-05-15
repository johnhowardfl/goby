When a user reports they "can't select a 2026 date for Failure Date" or that "no future dates show in the Failure Date picker," this is **not a bug** — it is intended validation. Confirmed by Leela Kumar C (Saksoft Module Lead) on 2026-05-08 in response to John Howard.

## The rule

For Service Requests of type **Warranty**:

- **Claim Date** is automatically set to the current date when the SR is created.
- **Failure Date** must be **on or before the Claim Date**.
- The Failure Date picker therefore disables any date after today.

Validation expression: `Failure Date <= Claim Date`

## Example

- Claim Date: 08-May-2026
- Allowed Failure Date: 08-May-2026 or any earlier date
- Not allowed: any date after 08-May-2026

## Rationale

The failure of a piece of equipment cannot have occurred in the future. The validation prevents nonsensical warranty claims. This was an intentional design decision.

## How to talk to users

- Confirm they are on a **Warranty**-type SR (the rule may not apply to other SR types).
- Explain the rule plainly: failure dates can't be in the future.
- If they are trying to update an **existing** open SR and the date picker won't show 2026 dates, the same rule still applies — Failure Date is bounded by Claim Date, which is fixed at SR creation.

## Open option

Leela offered: *"If we do not require any condition, then we can remove and allow all the date from failure date picker."* John accepted the explanation as-is on 2026-05-08, so **no change was made**. If a future request comes to relax this, the change is feasible — flag to Leela / Saksoft team.

## Source thread

Subject: "Issue With Failure Date in SR" — 2026-05-08, John Howard ↔ Leela Kumar C, cc Varun Dabir.
