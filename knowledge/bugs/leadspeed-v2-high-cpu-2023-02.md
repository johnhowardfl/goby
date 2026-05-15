**Status:** Resolved 2023-02-07 by sizing up the `ls-prod-svr` Azure VM. Historical context only — V2 has since been decommissioned.

## Symptom

LeadSpeed v2's Production server (`ls-prod-svr` Azure VM) showed **high memory and CPU utilization** in early February 2023.

## Root cause

Per Leela's analysis 2023-02-06:
1. The application was simultaneously connected to **both SQL and MySQL** servers for data.
2. **CRON jobs ran every 5 minutes** to sync data — significant background load.

The combined load exceeded the original VM size's headroom.

## Resolution

| Date (UTC) | Event |
|---|---|
| 2023-02-06 17:23 | John approved adding more space for LeadSpeed in Azure |
| 2023-02-07 06:24 | Rudresh sized the VM up. Original: **Standard DS2 v2** (2 vCPU, 7 GB RAM, $106.58/mo). |
| 2023-02-07 08:53 | Varun confirmed John's approval and asked Rudresh to proceed with the sizing during planned downtime |

Specific upgraded SKU not stated in the email — confirm in Azure if needed.

## Why it doesn't matter today

V2 was decommissioned in May 2023 (see [architecture/v2-decommissioning](../architecture/v2-decommissioning.md)). The `ls-prod-svr` VM that this incident pertained to no longer hosts V2.

Note: a different VM with the same name role pattern (`ls-prod-svr`) was later involved in the Sept 2025 Public IP migration (see [infra/azure-public-ip-upgrades](../infra/azure-public-ip-upgrades.md)) — that's the V3 production VM, distinct from this 2023 V2 incident, but shares the naming convention.

## Source thread

Subject: "Re : Leadspeed v2 : High memory and CPU utilisation on ls-prod-svr" — 2023-02-06 to 2023-02-07.
