Reference for how LeadSpeed Leads and Deals map to HubSpot, and the Aug 2023 migration that established the current mapping. This is the integration architecture that underlies the Reports module and Deal Dashboard.

## High-level model

- LeadSpeed **Leads** are mirrored as HubSpot **Deals**.
- HubSpot **Companies** are the master record for company entities; LeadSpeed pulls from HubSpot for company-related fields (e.g., the Rep Company dropdown — see [validation-rules/rep-company-field](../validation-rules/rep-company-field.md)).
- Deal Amount on the LeadSpeed Deal Dashboard is a passthrough from HubSpot — LeadSpeed does NOT calculate or override it (see [integrations/hubspot-deal-amount](./hubspot-deal-amount.md)).

## Tables / dependencies

A spreadsheet titled **"Leadspeed V3 tables dependency with HubSpot"** was sent by Leela Kumar C on 2023-10-19 (and an updated version same day). This is the source of truth for which LeadSpeed v3 database tables depend on HubSpot data flow. To answer "what fields sync from HubSpot?" or "which tables are populated from HubSpot calls?" — open that attachment.

## The Aug 2023 migration

A major one-time migration was executed in August 2023 to establish HubSpot as the system-of-record for Deals:

| Date (UTC) | Event |
|---|---|
| 2023-08-01 | John kicked off "sales pipeline" discussion — "I have always thought that hubspot should be tracking sales..." |
| 2023-08-03 | Saksoft sent attached file of legacy leads without Deals in HubSpot |
| 2023-08-07 | Sheet of Legacy Leads as Hubspot Deals shared |
| 2023-08-14 | Plan to do one-to-one mapping of legacy leads with new deals and companies (with full DB backup before touching anything) |
| 2023-08-17 | **Activity paused** because Saksoft noticed the naming convention for legacy leads on HubSpot Production had been changed |
| 2023-08-18 | Status: **5,339 Deals created**, every Deal associated with a Lead ID (legacy or new) |
| 2023-08-21 | **3,434 Deals missing HubSpot Companies** — needed company assignment by either Saksoft or Hydro-Dyne |
| 2023-08-30 | Sheet sent to John for him to populate Company Owner column for each Organization UID — collaborative cleanup |

## Deal Stage / `milestone_id` custom field

To preserve the legacy Deal Stage values when migrating to HubSpot, Saksoft created a custom HubSpot field **`milestone_id`** with a dropdown matching the legacy LeadSpeed application's Deal Stage options. Decided 2023-09-27 in response to the **Reports Module Deal Stage Impact Analysis** blocker.

## Why this matters today

- Any Deal-related query in LeadSpeed depends on HubSpot. If HubSpot is down or sync is broken, Deal data goes stale.
- The HubSpot dependencies sheet from 2023-10-19 lists the surface area — anything you change in LeadSpeed that touches Deals/Companies/Leads should be cross-checked against that doc.
- The Aug 2023 migration scale (5,339 deals) sets the baseline. Audit reports on legacy data attribution should reference this period.

## Source threads

- "sales pipeline" — 2023-08-01
- "Plan to do one-to-one mapping of legacy leads with new deals and companies" — 2023-08-14
- "Deal creation on Hubspot status" — 2023-08-18 to 2023-08-21
- "Re : Leadspeed V3 tables dependency with HubSpot(Updated)" — 2023-10-19
- "Reports Module Deal Stage Impact Analysis" — 2023-09-27 (`milestone_id` decision)
