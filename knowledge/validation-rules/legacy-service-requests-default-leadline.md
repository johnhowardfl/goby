Authoritative rule for how **Service Requests created in Legacy V2** are displayed in V3. Confirmed by Varun Dabir 2023-07-24, awaiting John's approval at the time but the design was implemented.

## The rule

V2 created service requests against the **Lead ID** (one level up). V3 changed the model: service requests are now tied to the **Leadline ID** (one level down — Leadlines are the equipment children of Leads).

For records that pre-date this change, V3 needs to assign each legacy SR to a specific Leadline. The rule:

- **Legacy Leads (pre-V3 era):** All calls / service requests show **under Leadline 1** of the legacy lead, by default.
- **New Deals (post-V3):** Service requests are categorized under the **specific Leadline** referenced when the SR was created.

## Why this matters

- If a user looks at a legacy lead and notices that **all** historical service requests appear under Leadline 1, even though the work might have actually involved different equipment — that's the default backfill. It does NOT mean Leadline 1 was actually the equipment serviced; the original V2 records simply didn't capture Leadline-level attribution.
- For accurate historical equipment-by-equipment service history on legacy leads, the V2-era records can't be trusted to be granular. The data extraction pattern (e.g., the Scott Griffith extract from April 2026) is the way to retrieve the original V2 attribution if it exists in the source data.
- For V3-era leads (post-2023-04-18), service requests properly distribute across Leadlines based on what the user selected at SR creation time.

## How to talk to users

- "Why are all the old service requests on this lead showing under Leadline 1?" → That's the legacy-record default. Pre-V3, SRs weren't tied to specific Leadlines, so all legacy SRs default to the first Leadline. New (post-V3) service requests are tied to the specific Leadline.

## Source thread

Subject: "Legacy Service request will be viewed in 1st Leadline as Default" — 2023-07-24, Varun Dabir → John Howard.
