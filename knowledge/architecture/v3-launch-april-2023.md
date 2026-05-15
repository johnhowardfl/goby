**LeadSpeed v3 launched into production on 18 April 2023.** This file is the canonical reference for the V3 production launch — useful when anyone asks "when did V3 go live?" or needs to anchor any other event in the V3 timeline.

## Go-live date

**18 April 2023** — confirmed by Varun Dabir 2023-04-05: *"As Discussed, our go Live date would be 18th of April."*

## Production deployment timeline

The deployment was executed over a multi-day window with two data migrations to capture the most recent activity:

| Date | Event |
|---|---|
| 2023-04-05 | Go-live date locked at 2023-04-18 |
| 2023-04-08 | Production data migrated through April 8 (MySQL + SQL latest data). CI/CD setup in progress (Raveendra). |
| 2023-04-09 | Production data migration through April 8 confirmed complete with HubSpot data. QA and Stage domains pointed to new sub-domains. Stage data + HubSpot connectivity verified. Application up and running. **Pending at this point:** v2 ↔ v3 domain switching, frontend deployments for Stage/QA backend API change. |
| ~2023-04-10 | Domain switched: V3 application pointed to `leadspeed.me` (Varun: *"Please point leadspeed V3 application to leadspeed.me at the earliest."*) |
| 2023-04-11 | First **General User Guide for Leadspeed.me** distributed to John |
| 2023-04-18 | **Go-live.** Second data migration ran for the April 1–18 window to bring V3 fully current with V2's last days. |

## What got migrated

- **MySQL + SQL data** through April 8, 2023 (first pass)
- **HubSpot data** synced into the new V3 model
- **V1–V18 April delta** (second migration on go-live day)

## Domain transition

- Pre-V3: LeadSpeed lived under various domains (Phoenix, FlightOps for the FMS branch). See [glossary](../glossary.md) for the older naming.
- **From V3 onward:** the customer-facing application is at `leadspeed.me`. QA/Stage live at `qa.leadspeed.me` / `stage.leadspeed.me` style sub-domains.

## Why this matters today

- Anything tagged "Legacy" in the codebase or conversation refers to the pre-2023-04-18 V2 era.
- Any data attribution question that hits a wall at "we don't have responder/owner/etc. for this record" — likely a V2-migrated record. The V2 → V3 migration left several attribution fields blank that have been backfilled with default values (e.g., M1 calls default to Bobby Kuppel as responder — see [bugs/performance-metrics-blank-responders](../bugs/performance-metrics-blank-responders.md)).

## Source threads

- "Leadspeed V2 to V3 Data Migration Timelines" — 2023-04-05
- "Softwerks: Leadspeed V3 Production Deployment Update 08/04/2023" — 2023-04-08
- "Softwerks: Leadspeed V3 Production Deployment Update 09/04/2023" — 2023-04-09
- "Domain change for leadspeed V3 to leadspeed.me" — 2023-04-10
- "User Guide for Leadspeed.me" — 2023-04-11
