**Status:** Resolved 2024-03-08 by upgrading the FMS Azure VM to **128 GB**.

## Symptom

The FMS application (`fms.v3aviation.aero` / `bearair.me`) went down due to **out-of-disk-space** on its Azure VM. John reported it 2024-03-06: *"It's been a while since we've had a FMS issue!"* — implying this is a known but infrequent class of incident.

## Resolution

Saksoft / DreamOrbit team upgraded the FMS Azure VM disk to **128 GB**. Application brought back up 2024-03-08.

Varun's confirmation: *"FMS application is Up now. We have upgraded it to 128GB."*

## How to triage if it recurs

1. Check the FMS Azure VM disk usage in Azure Portal.
2. If approaching capacity again (especially if logs / database have grown), bump the disk size.
3. Long-term: investigate what's growing. Is it logs, attachments, database? Logs should rotate (see "API log table cleanup" — one-month rotation was set in October 2023).
4. Escalate to Rudresh M / Teja Jangam for the Azure-side action.

## Related

- The original Jira ticket was tracked at `https://softwerks.atlassian.net/browse/...` (specific LDS-NNNN not visible in this thread; check the FMS issue history).
- FMS = V3's version of FlightOps — see [glossary](../glossary.md).

## Source thread

Subject: "FMS V3 Azure out of disk space" / "FMS application is UP" — 2024-03-06 to 2024-03-08, John Howard ↔ Varun Dabir.
