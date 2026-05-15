**Status:** Resolved 2024-02-19 by setting **Bobby Kuppel** as the default responder for legacy M1-era requests with blank responder fields.

## Symptom

The Performance Metrics report (and the My Tasks Grid on the Homepage) was broken for service requests that had been migrated from LeadSpeed v2 — those records had **empty responder fields**, so Performance Metrics couldn't compute responder stats and the My Tasks grid couldn't display them properly.

## Root cause

The V2 → V3 migration left the responder field blank on records that originated in **M1** (the legacy Hydro-Dyne system that pre-dated LeadSpeed). Those records had no responder concept in M1, so there was nothing to populate during migration.

## Resolution

John's instruction to Saksoft 2024-02-19: *"Make this the default responder for those m1 calls that were not created in leadspeed: Bobby Kuppel `bobby.kuppel@hydro-dyne.com`."*

Saksoft implemented Bobby as the default responder for any legacy M1 record with a blank responder. This unblocked Performance Metrics and the My Tasks Grid.

## Why Bobby?

Not explicitly stated in the email. Bobby Kuppel is a Hydro-Dyne user who was an appropriate proxy for the M1 era — likely either the primary M1 operator or someone willing to be the catch-all attribution. If a future user asks "why is Bobby attributed to all these old service requests?" — this is the answer: it's a backfill default for M1-origin records, not actual historical work attribution.

## How this might come up again

If a future migration brings in records with blank attribution fields, the same pattern (assign a sensible default user) is the playbook. Discuss with John before picking the default.

## Source thread

Subject: "Re : Performance Metrics Responders blank for Old Requests." — 2024-02-16 to 2024-02-19.
