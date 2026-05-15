**Status:** Resolved 2025-11-20 by introducing Azure Managed Redis. See [infra/redis-cache](../infra/redis-cache.md) for ongoing operational reference.

## Symptom

Production environment **froze** when the LeadSpeed APIs attempted to fetch from cache and the cache call failed. The team described this as: *"APIs are looking for cache, and when it fails there is an error, and production environment freezes."*

Without a managed cache layer, the application had no resilient cache fallback — a cache miss or transient cache error escalated to a full Prod stall.

## Root cause

LeadSpeed Production was running without a properly provisioned managed cache. The Saksoft team determined that Azure Managed Redis was needed to provide a stable, production-grade cache layer.

## Resolution timeline

| Date (UTC) | Who | Event |
|---|---|---|
| 2025-11-19 08:04 | Varun Dabir → John | Forwarded Azure Managed Redis monthly cost estimate; explained the Prod-freeze rationale |
| 2025-11-19 20:40 | John Howard | Approved: *"Go ahead and proceed please."* |
| 2025-11-20 11:40 | Rudresh M | Created the Redis instance: **`eus-lds-mg-redis-prod-01`** in the Prod resource group |
| 2025-11-20 12:31 | Leela Kumar C → Rudresh | Requested `REDIS_HOST`, `REDIS_PASSWORD`, `REDIS_PORT` to test the handshake from the LeadSpeed app |

## How to triage if Production freezes again

1. Check whether `eus-lds-mg-redis-prod-01` is healthy in Azure Portal.
2. Check LeadSpeed application logs for cache-related errors.
3. Confirm the app's Redis connection settings (`REDIS_HOST`, `REDIS_PASSWORD`, `REDIS_PORT`) match the current Redis instance config — credentials may have rotated.
4. Escalate to Rudresh M or Leela Kumar C.

## Source thread

Subject: "Fw: Azure Managed Redis Monthly Cost Estimate" — 2025-11-19 to 2025-11-20.
