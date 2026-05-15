Reference info on the Microsoft Graph API integration that LeadSpeed uses to interact with the Hydro-Dyne Microsoft 365 tenant.

## The account

- **UPN:** `leadspeed@hydro-dyne.com`
- **Tenant:** Hydro-Dyne Engineering Microsoft 365 / Entra ID
- **Auth flow (current):** user-account password (ROPC or similar) — fragile, see "Known issue" below
- **What it's used for:** Microsoft Graph API calls — exact set of capabilities not enumerated in email; treat as "anything LeadSpeed needs from Hydro-Dyne's M365 tenant" until clarified

## Known issue: password expires every 60–90 days

The Hydro-Dyne tenant policy expires the password on this service account every 60–90 days. Each expiration breaks the integration. See the dedicated bug page: [graph-api-password-expiry-2026-03](../bugs/graph-api-password-expiry-2026-03.md).

## Error signature

When this fails, you'll see this in logs / `noreply@leadspeed.me` notifications:

```
AADSTS50055: The password is expired.
Trace ID: <guid>
Correlation ID: <guid>
Timestamp: <iso>
```

## Long-term fix (open)

Replace the user-account password flow with an Entra ID **app registration** using OAuth client credentials (client secret or certificate). Eliminates the recurring expiration. This was suggested but not yet executed.

## Who to contact

- Saksoft side: **Aniket Khadye** (primary), **Leela Kumar C**
- Hydro-Dyne side: tenant admin (route via John Howard)
