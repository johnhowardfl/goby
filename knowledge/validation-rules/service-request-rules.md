Authoritative reference for Service Request (SR) business rules and status transitions in LeadSpeed v3. Confirmed by Varun Dabir / Leela Kumar C (Saksoft) and decided by John Howard.

## Creation prerequisite — Leads must have Lead Lines

**Rule:** A user **cannot create a Service Request** for a Lead (open or closed) that has **zero Lead Lines** linked to it.

**Rationale:** A Service Request is fundamentally about equipment. If the Lead has no Lead Lines, there is no equipment associated with the Lead, so an SR cannot be created.

Decided 2025-12-18 by John in response to Varun's clarification request. Saksoft was instructed to enforce this as a hard restriction in the SR create flow.

If a user complains they "can't create an SR for this lead," check whether the Lead has any Lead Lines first.

## Failure Date validation (Warranty SRs)

For SRs of type **Warranty**, see the dedicated [service-request-failure-date](./service-request-failure-date.md) page. Summary: `Failure Date <= Claim Date`, where Claim Date is set to today at SR creation. Failure Date cannot be in the future.

## Equipment field — "Not Available" option

A user can request that an SR not be tied to a specific piece of equipment by selecting **"Not Available"** in the Equipment dropdown — this is a feature that was requested 2026-04-18, confirmed feasible, and bundled into the Saksoft sprint. **Verify it has shipped before telling a user it's available** — see [features/service-request-not-available-equipment](../features/service-request-not-available-equipment.md).

## Status flow — completion and review

When a technician completes a Service Request in the **PWA application**:

1. SR status updates to **"Under Review"** in the Service Request grid.
2. The **Service Manager (SM)** then reviews the completed work.
3. SM decides to **close** or **reopen** the SR.

### If SM closes the SR

- Status in LeadSpeed updates to **closed** (UI and backend).
- No further action expected; SR is done.

### If SM reopens the SR

- SR is **reassigned** to another technician or engineer.
- LeadSpeed UI updates the **status** to reflect the reopen.
- LeadSpeed UI shows the **new assignment** (the new technician).

Decided 2025-12-18 by John in response to Varun's clarification request. *"If closed by SM, it should just show as closed in LeadSpeed. If reopened and reassigned, it should update the status accordingly and show the new assignment in LeadSpeed."*

## Known related bug — task reassignment visibility

Separately from SR-specific reassignment, the general **task reassignment** behavior across Sizing, Pricing, Drawing modules causes tasks to appear in **both** the original assigner's and the new assignee's grids. This is long-standing V2-era behavior and is pending a design change (as of 2026-04-13). See [bugs/task-reassignment-2026-04](../bugs/task-reassignment-2026-04.md). The SR reassignment flow above is a related but distinct decision — confirm whether it shares the same code path before assuming changing one fixes the other.

## Source threads

- "Clarification Required on Service Request Scenarios – UI & Backend Design" — 2025-12-18
- "Issue With Failure Date in SR" — 2026-05-08 (failure date rule)
- "Service Request Creation" — 2026-04-18 ("Not Available" equipment option)
