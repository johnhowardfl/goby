**Status:** Recurring incident class. Workaround applied (password rotation). Root policy issue **unresolved as of last email** (2026-03-23). Expect this to recur every 60–90 days until the underlying password-expiration policy is changed.

## Symptom

Microsoft Graph API integration fails with:

```
AADSTS50055: The password is expired.
```

LeadSpeed sends an automated error notification from `noreply@leadspeed.me` to the Saksoft engineering team (Aniket Khadye, Leela Kumar C).

Sample error metadata from the 2026-03-23 incident:
- Trace ID: `ad001f1c-985b-4d58-9b34-f794fe5c0200`
- Correlation ID: `4b13bb79-55c6-440e-b4cf-f03eef0fa479`
- Timestamp: `2026-03-23 14:31:11Z`

## Affected account

`leadspeed@hydro-dyne.com` — the service account used for Microsoft Graph API integration with the Hydro-Dyne Microsoft 365 tenant.

## Root cause

The Hydro-Dyne tenant policy expires the password on this account every **60–90 days**. Each expiration breaks the Graph API integration until someone rotates the password.

This is not a LeadSpeed bug — it is an Azure AD / Entra ID password policy on the Hydro-Dyne tenant.

## Short-term workaround

Rotate the password on the account, update the credential in LeadSpeed config, redeploy / restart whatever holds the connection.

In the 2026-03-23 incident, Leela rotated the password and shared the new one **in the email body** (plaintext) — flag this as a process issue and rotate again outside email next time. Service-account credentials should not be transmitted in cleartext email.

## Long-term fix (not yet done)

Either:
1. **Tenant policy change** — extend or remove password expiration on the `leadspeed@hydro-dyne.com` account specifically. Requires Hydro-Dyne IT cooperation. **John was asked to pursue this.**
2. **App registration with client secret or certificate auth** — replace the user-account password flow with a proper Entra ID app registration using OAuth client credentials. More work but eliminates the recurrence permanently.

Option 2 is the right long-term answer. Option 1 is a faster but fragile mitigation.

## How to triage if it recurs

1. Look for the `AADSTS50055` error string in LeadSpeed logs or in `noreply@leadspeed.me` notifications.
2. Confirm with Saksoft (Aniket or Leela) before rotating, in case the policy was already addressed.
3. After rotation, verify the integration works by triggering a Graph API call (e.g., a calendar or mail operation through LeadSpeed).
4. Open a ticket to revive the long-term fix conversation if it's been ignored.

## Source thread

Subject: "Re: Microsoft Graph API error - 2026-03-23 14:31:11" — 2026-03-23, Leela Kumar C → John Howard, cc Aniket Khadye, Varun Dabir.
