Reference info on the Microsoft Graph API integration that LeadSpeed uses to interact with the Hydro-Dyne Microsoft 365 tenant.

## The account

- **UPN:** `leadspeed@hydro-dyne.com`
- **Tenant:** Hydro-Dyne Engineering Microsoft 365 / Entra ID
- **Auth flow (current):** user-account password (ROPC or similar) — fragile, see "Known issue" below
- **What it's used for:** Microsoft Graph API calls — exact set of capabilities not enumerated in email; treat as "anything LeadSpeed needs from Hydro-Dyne's M365 tenant" until clarified

## Known issue: password expires every 60–90 days

The Hydro-Dyne tenant policy expires the password on this service account every 60–90 days. Each expiration breaks the integration. See the dedicated bug page: [graph-api-password-expiry-2026-03](../bugs/graph-api-password-expiry-2026-03.md).

This is **recurring**, not a one-time event:
- **2025-08-14** — Earlier Microsoft Graph API failure on the Hydro-Dyne Teams integration. Leela tested from a browser and got a popup error; she escalated through John for the Hydro-Dyne Teams account manager. Resolution path was via Hydro-Dyne IT (Thriveon Support, ticket `#993466`).
- **2026-03-23** — The expiry pattern recurred (full detail in the [graph-api-password-expiry-2026-03 bug page](../bugs/graph-api-password-expiry-2026-03.md)).

So when this fails, treat it as a known recurring class of incident — start with "is the password expired again?" rather than "is something new broken?"

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
