**Status:** Read-only APIs available since early March 2026. Write APIs enabled in Stage on 2026-04-30. Production write enablement pending external verification by Pinecrest AI.

## The integration

LeadSpeed exposes a set of REST APIs to allow an external AI chatbot (built by **Pinecrest AI**, contact: David Reo, `david@pinecrestai.com`) to read and write LeadSpeed data — Leads, Leadlines, Companies, Contacts.

## Timeline

| Date | Milestone |
|---|---|
| 2026-02-19 | New `leadspeed.ai@admin.com` user created on LeadSpeed Production by Aniket Khadye for chatbot access |
| 2026-02-26 | Varun Dabir proposed two read-only API approaches: (1) share existing GET APIs (faster), (2) build dedicated read-only role |
| 2026-03-05 | Saksoft created a dedicated **read-only role** and separated GET APIs for the chatbot (Stage). Postman collection sent. |
| 2026-03-09 | Same read-only role and GET APIs prepared for Production; Postman collection sent |
| 2026-04-30 | **Write access** enabled in Stage for Lead, Leadline, and Company creation via Chatbot APIs |
| 2026-05-02 | David Reo confirmed Stage write APIs work |
| 2026-05-02 | David flagged his stage AND prod UI accounts are deactivated; asked for new credentials |
| 2026-05-04 | John asked David to clarify which account (LeadSpeed UI vs. Postman) — thread open as of last fetch |

## Production write enablement

As of last visibility (mid-May 2026), Saksoft's stated process is:
1. David tests write APIs in Stage (confirmed working 2026-05-02).
2. Once verified, write access gets enabled in Production.

**Not yet confirmed enabled in Production.** Verify before telling anyone the chatbot can create records in prod.

## Known issues from the rollout

The May 2026 Chatbot API release was **ad-hoc, outside sprint scope**, and bypassed the standard regression cycle. Several bugs surfaced in production after deployment:

- See [Leadline Copy & Form Issue](../bugs/leadline-copy-form-2026-05.md) (Rick Hsu / RSMs)
- See [Create Company outage](../bugs/create-company-outage-2026-05.md) (4+ Sales Engineers)
- "5 additional issues" identified by Saksoft during a focused regression and patched in a hotfix

Process change committed by Varun on 2026-05-07: even ad-hoc releases will get regression coverage before Prod deployment going forward.

## Pinecrest accounts

David Reo's accounts in LeadSpeed UI got deactivated at some point. If he asks for credentials, route via Saksoft (Aniket Khadye created `leadspeed.ai@admin.com` originally — he can reactivate or reissue). Distinguish between UI accounts and Postman API accounts; David asked about both.

## Source threads

- "User Details – Leadspeed Production Access" — 2026-02-19
- "Proposed Approaches for Read-Only API Access in Production" — 2026-02-26
- "Re: Leadspeed GET API's collection." — 2026-03-05 to 2026-03-09
- "Lead, Leadline & Company Creation via Chatbot APIs" — 2026-04-30 to 2026-05-04
