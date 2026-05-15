**Status:** Resolved 2024-10-11 by provisioning a separate MySQL DB server for QA. Pattern worth knowing if Stage suddenly starts crashing again after future infra consolidation.

## Symptom

LeadSpeed v3 **QA and Stage environments crashed frequently** in October 2024. Root cause: both environments shared a single MySQL database server, and combined load was exceeding the box's capacity.

## Root cause

QA and Stage shared one DB server. Concurrent test runs in QA and pre-prod validation in Stage produced more load than the single instance could sustain — leading to outages that affected both environments simultaneously.

## Resolution timeline

| Date (UTC) | Who | Event |
|---|---|---|
| 2024-10-09 07:18 | Varun Dabir → John | Approval needed for **additional Database server for QA**. Load analysis attached. |
| 2024-10-09 10:57 | John Howard | Approved: *"Yes. Approved!"* |
| 2024-10-11 09:05 | Rudresh M | Created new QA DB: **`mysql-leadspeed-qa-002`**. Credentials shared separately. |
| 2024-10-11 12:38 | Leela Kumar C | Moved the QA database to the new server and pointed QA app at it. Said the team would monitor performance over the following week. |

## What this means for current state

QA now runs against `mysql-leadspeed-qa-002` (separate from Stage's DB). If anyone proposes consolidating QA and Stage onto a shared DB again "to save cost," **flag this incident** — that's why they were split in the first place.

Production has its own separate DB; this incident only involved QA + Stage.

## How to triage if it recurs

1. Check whether QA and Stage are pointed at the same MySQL instance (config / connection strings).
2. Check current load on the shared instance vs. its provisioned tier.
3. If they've been re-merged, consider re-splitting; if they're still separate, look for a different cause (specific query, schema bloat, connection leak).

## Source thread

Subject: "Leadspeed v3 - QA and Stage server getting down frequently." — 2024-10-09 to 2024-10-11.
