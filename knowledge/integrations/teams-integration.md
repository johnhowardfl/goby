Reference for the LeadSpeed ↔ Microsoft Teams integration with the Hydro-Dyne tenant. POC accomplished December 2024; the integration depends on the `leadspeed@hydro-dyne.com` Microsoft Graph API service account.

## Origin

- **2024-12-03** — Varun Dabir to John: *"We have successfully accomplished the POC."* Asked John to create Jira tickets (or share specific scope) for the production integration scope.
- This is the Teams integration that the Microsoft Graph API account `leadspeed@hydro-dyne.com` exists to serve. See [infra/leadspeed-graph-api-account](../infra/leadspeed-graph-api-account.md) and [bugs/graph-api-password-expiry-2026-03](../bugs/graph-api-password-expiry-2026-03.md).

## What it enables

The integration uses Microsoft Graph API to interact with the Hydro-Dyne Microsoft 365 tenant — exact production scope was scoped via Jira tickets created after the 2024-12-03 POC handoff. The recurring failure mode (account password expiry every 60–90 days) suggests the integration calls happen frequently enough that expiry causes user-visible disruption.

## Recurring class of incident

This integration is the source of the **recurring `AADSTS50055` password-expired** failures:
- 2025-08-14 — earlier Graph API failure surfaced through John for Hydro-Dyne IT (Thriveon Support `#993466`)
- 2026-03-23 — same failure recurred; password rotated, no policy fix yet

Long-term fix is to switch from user-account password auth to an Entra ID app registration with client-secret or certificate auth. Not yet done as of last visibility.

## Saksoft team

- **Aniket Khadye** (`aniket.k@saksoft.com`) — primary contact for Graph API issues
- **Leela Kumar C** — secondary, app-side troubleshooting
- **Varun Dabir** — product context

## Source threads

- "Expectation requirement from Teams Integration with Leadspeed" — 2024-12-03 (POC handoff)
- "Re: We are getting below error from Microsoft Graph API." — 2025-08-14 (first visible failure)
- "Re: Microsoft Graph API error - 2026-03-23 14:31:11" — 2026-03-23 (most recent failure)
