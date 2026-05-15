Reference for the M1 decommissioning and the V2 → V3 "Revamp" project that ran October 2022 through April 2023, ending with V3 going live on 2023-04-18 (see [v3-launch-april-2023](./v3-launch-april-2023.md)). Useful for any question that touches "where did this data come from?" or "why did we change X behavior in V3?"

## What "Revamp" means

Internally, the V3 build effort was referred to as **"Revamp"** in DreamOrbit's weekly status reports throughout late 2022. *"Performing regression testing on stage is On hold until Revamp is completed"* — recurring line in 2022 Saksoft weekly updates. Revamp = V3 development.

## M1 — the system being replaced

**M1** was the legacy Hydro-Dyne system (running on a Windows machine accessed via `https://hydrodyne.screenconnect.com/`) that was the original system-of-record for Leads, Lead Lines, and Companies before LeadSpeed v2 began capturing them in parallel. As of late 2022:

- All Leads & Lead Line Information **lived in the M1 database** (per Varun's M1 Impact analysis 2022-11-08).
- Creation of new data in M1 was scheduled to **stop completely** once M1 was disconnected.
- LeadSpeed v2 had been a layer on top of M1 — many fields were synced from M1, not authoritative in LeadSpeed itself.

The M1 server was `HDEENG01` (see [glossary](../glossary.md)). For Aniket and Leela to do the V2 → V3 migration, they needed M1 access via screenconnect (the `softwerks@hydro-dyne.com` credential was used).

## Key data model changes from M1 / V2 to V3

### "entered by" → "lead owner"

- **V2/M1:** Each lead had an "entered by" field — the M1 user who originally created the lead record.
- **V3:** "entered by" was removed. Replaced by "lead owner" which is sourced from the **HubSpot deal owner**. Confirmed by John 2022-12-30: *"the lead owner from v2 is the same as the hubspot deal owner in v3 and on the leads details page, we can replace 'entered by' with 'lead owner'."*
- Practical impact: anyone asking "who entered this lead?" should be redirected to "who's the deal owner in HubSpot?" — that's now the canonical answer.

### HubSpot becomes the system of record for Deals

- Pre-V3: M1 + LeadSpeed v2 held lead/deal data, with HubSpot as a separate marketing/sales tool.
- V3 onward: HubSpot is authoritative for Deals; LeadSpeed mirrors and references it. The Aug 2023 mass migration (5,339 deals — see [integrations/hubspot-deal-mapping](../integrations/hubspot-deal-mapping.md)) cemented this.

### Deal Stage / `milestone_id`

A custom HubSpot field `milestone_id` was created to mirror legacy LeadSpeed Deal Stage values, so the Reports module could continue to function with familiar stage values. Decided 2023-09-27.

### Required HubSpot fields

Per Varun 2023-01-06 (V3 release prep): Hydro-Dyne was asked to make **First Name, Last Name, Company, and Email Address mandatory** when creating a Deal in HubSpot. This ensures every Deal has the minimum data LeadSpeed v3 needs.

## Migration process (high level)

0pre. **Mar 28, 2022** — DreamOrbit (Pawan Yadav) shares **initial ballpark estimates** for "Leadspeed_UX/UI_Revamp" — earliest recorded Revamp project artifact.
0pre2. **May 2022** — **CICD project initiated** in parallel: separate Azure VM (`cicdadmin` user) provisioned, blob storage account `v3aviationfsmstage` created for FMS V3aviation/BearDefence tenants. Approved by John 2022-05-10.
0. **Jul 21, 2022** — **Revamp project officially kicked off.** John approved DreamOrbit's "Leadspeed Revamp UX/UI estimation" on 2022-07-28: *"This is an approval to proceed with the UX/UI project for Leadspeed with a budget based on the hours included in this estimate."*
0a. **Jul–Aug 2022** — UX work, regression testing on V2, "Leadspeed 2.0 SoW" finalized
0b. **Sep 2022** — Azure DevOps migration: LeadSpeed repos and CI/CD pipelines moved from the Softwerks GitHub organization to **Azure DevOps**. Approved by John 2022-09-26.
0c. **Sep 2022** — Cost analysis of LeadSpeed Azure subscription completed; initial cleanup of unused resources
0d. **Sep 2022** — Azure AD security defaults / **MFA enabled** on the Softwerks tenant (2022-10-13/14, Bony Augustine)
1. **Oct 2022** — V3 backend development of Sizing, Pricing, Drawing modules begins; weekly Saksoft status updates reference "Revamp" hold on regression
2. **Nov 2022** — Data migration estimates approved (2022-11-23). HubSpot Lead ID details requested for de-duplication.
3. **Dec 2022** — DreamOrbit team accesses M1 via screenconnect for migration scripting. "Entered by" → "lead owner" decision finalized.
4. **Jan 2023** — V3 demo to John (2023-01-05). Release plan distributed (2023-01-06). HubSpot mandatory fields asked of Hydro-Dyne. Production setup begins.
5. **Feb 2023** — Telerik Kendo UI license renewed (2023-02-07). V2 production VM sized up due to load (high CPU/memory bug).
6. **Mar 2023** — V2 SSL hot fix; V3 performance and security checklist iteration.
7. **Apr 2023** — Two-phase data migration (data through Apr 8, then Apr 1–18 catchup). Domain pointed to `leadspeed.me` (Apr 10). User Guide (Apr 11). **Go-live Apr 18.**
8. **May 2023** — V2 decommissioning approved; legacy app sunset.

## Why a user should care about this history

If a user asks "why does my lead have weird/missing data from before April 2023?" — that's the M1 / V2 era. Use the rules above:
- Old SRs default to Leadline 1
- Old responder-blank records default to Bobby Kuppel
- Old "entered by" data is now displayed as "lead owner" sourced from HubSpot deal owner
- Some V2 fields didn't carry over at all (e.g., the Questions module wasn't migrated by decision)

## Source threads

- "M1 Impact on Leadspeed V2 analysis" — 2022-11-08
- "Request for the Lead ID Details for all the Deals from Hubspot" — 2022-11-20
- "Data migration estimates" — 2022-11-23
- "unable to access M1 application" — 2022-12-01 (screenconnect access pattern)
- "request for confirmation if we can ignore 'entered by' field as we no more use M1" — 2022-12-28 (lead owner decision)
- "MOM of Leadspeed Demo discussion with John on 05/01/2023" — 2023-01-05
- "Leadspeed V3 application release plan" — 2023-01-06
- "HubSpot mandatory field setting requirement" — 2023-01-06
- Various "Softwerks Projects Weekly Update" — Oct/Nov 2022
