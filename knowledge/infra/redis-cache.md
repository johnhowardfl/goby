Reference for the Azure Managed Redis instance backing LeadSpeed Production caching. Provisioned 2025-11-20 after Production freeze incidents tied to unmanaged cache failures (see [bugs/redis-cache-production-freeze-2025-11](../bugs/redis-cache-production-freeze-2025-11.md)).

## Instance

- **Name:** `eus-lds-mg-redis-prod-01`
- **Location:** Azure East US (`eus-`)
- **Resource group:** Prod RG (LeadSpeed v3 Production)
- **Created by:** Rudresh M (Saksoft)
- **Purpose:** API response caching for the LeadSpeed Production application. Without this, cache failures freeze the Prod app.

## Connection variables expected by the app

The LeadSpeed application expects these env vars / config keys to talk to Redis:

- `REDIS_HOST`
- `REDIS_PASSWORD`
- `REDIS_PORT`

If the app is failing to connect, check that these match what's in Azure Portal for the Redis instance. Credentials may be rotated by Azure or by the team — re-pull from the portal.

## Owners

- **Provisioning / Azure-side ops:** Rudresh M (`rudresh.m@saksoft.com`), Teja Jangam (`teja.j@saksoft.com`)
- **App-side wiring:** Leela Kumar C (`leelakumar.c@saksoft.com`)

## Open question

Whether a similar Managed Redis instance exists for **Stage** is not stated in the email record. If a Stage cache issue is reported, confirm with Rudresh whether Stage has its own Redis or shares with another env.
