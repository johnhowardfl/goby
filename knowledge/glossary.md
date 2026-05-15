Naming and term reference for the LeadSpeed ecosystem. Use this when a user mentions an unfamiliar name or when two names refer to the same thing. Update as new terms surface.

## FMS = V3's FlightOps

**FMS** is what V3 calls the application that V2 called **FlightOps**. They're the same product, evolved across versions. (Confirmed by John 2023-08-07 in a billing-clarification email to Christy Howard: *"FMS (it's what we call v3's version of FlightOps)"*.)

When a Hydro-Dyne user mentions FlightOps, they likely mean FMS. When a Saksoft email mentions FMS, they're referring to the production application at `fms.v3aviation.aero` and `bearair.me`.

## bearair.me

The customer-facing FMS production domain (also referenced as `*.bearair.me` for SSL purposes). Tied to V3 Aviation / Bear Air — a separate Hydro-Dyne customer.

## V3 Aviation / Bear Air

Customer entity that uses FMS. Their Director of Finance & Administration is Jennifer Jolivet (`jjolivet@v3aviation.aero`). She often flags SSL renewal warnings to John.

## Phoenix

Earlier-era LeadSpeed application stack (`phoenix.leadspeed.me`). Effectively the V2 frontend. If you see "Phoenix" in a config or URL, it's the V2 app.

## M1

Legacy Hydro-Dyne system that LeadSpeed migrated data from. **M1 user** = a Hydro-Dyne employee in the M1 system; in V3 they became regular LeadSpeed users (no separate "M1 user" type). M1 calls = service requests originally created in M1 before LeadSpeed existed; for Performance Metrics purposes those have **Bobby Kuppel** as the default responder (since the original responder field is blank — see [bugs/performance-metrics-blank-responders](bugs/performance-metrics-blank-responders.md)).

## LDS-NNNN

Jira ticket prefix for the LeadSpeed project. Tickets are tracked at `https://softwerks.atlassian.net/browse/LDS-NNNN`. When Saksoft references LDS-4679 etc. in a release-notes email, you can pull the ticket details from Jira.

## RSM

Regional Sales Manager. Hydro-Dyne sales role; RSMs use LeadSpeed to enter Lead and Leadline details. Rick Hsu is one example RSM.

## SE

Sales Engineer. Use LeadSpeed alongside RSMs. Names that have appeared in incident reports: Srage, Leandro, John (the user, not John Howard), Rick.

## SR

Service Request — a record in LeadSpeed for service work on a piece of equipment. Has a workflow: created → technician assigned → completed in PWA → "Under Review" → closed/reopened by Service Manager. See [validation-rules/service-request-rules](validation-rules/service-request-rules.md) and [validation-rules/warranty-claim-workflow](validation-rules/warranty-claim-workflow.md).

## SM

Service Manager. Reviews completed Service Requests in the LeadSpeed grid; decides whether to close or reopen.

## PWA

Progressive Web App. The technician-facing mobile/field application separate from the main LeadSpeed v3 web app. Production: `https://app-leadspeed-v3-pwa-prod.azurewebsites.net/`. Stage: `app-leadspeed-v3-pwa-stage.azurewebsites.net`. Standing infra was provisioned 2026-02 (Stage) and 2026-03-30 (Prod).

## LL

Leadline. Equipment-level entry under a Lead. The standard sales-bidding workflow involves **copying** an LL and renaming it with "BID" or "FIRM" appended (see [bugs/leadline-copy-form-2026-05](bugs/leadline-copy-form-2026-05.md) for a known bug in this area).

## Deal Stage / `milestone_id`

A custom HubSpot field used to mirror the LeadSpeed legacy Deal Stage values. Created 2023-09-27 as part of the Reports Module / HubSpot migration so that legacy stage values could be carried forward into the new HubSpot-driven model.

## Hubspot Deal ID

When LeadSpeed shows a Deal Amount, that value comes from HubSpot — LeadSpeed is a passthrough. See [integrations/hubspot-deal-amount](integrations/hubspot-deal-amount.md).

## FlightOps.me

The pre-bearair.me domain for the FMS/FlightOps application. Renewed via Sectigo as of 2023-07-06. Effectively FlightOps' own dedicated domain in the V2/V3-transition era. Has been replaced/superseded by `bearair.me` for current customer-facing use. If a user references FlightOps.me, they're talking about the FMS product, just under its older domain.

## HDEENG01 / `novasocthreatdetectionservice.exe`

Hydro-Dyne's M1 server (inside the HDE network) that LeadSpeed used to sync to during the M1 era. Generated New Relic monitoring alerts (specifically the "I/O Read Bytes Per Second > 1.0E7" alert from `novasocthreatdetectionservice.exe`) — those alerts hit `noreply@leadspeed.me` and were forwarded to Saksoft. With M1 decommissioning, those alerts should have stopped firing. If they recur, it implies there's still active sync happening to M1 that probably shouldn't be.

## LDS-4320 era

Earliest visible LDS-NNNN Jira ticket numbering in the email record is around LDS-4320 (May 2023, V3 sprint 2 release). The LeadSpeed Jira project numbering does not start at 1 — it picked up from a higher base, likely inherited from a predecessor project tracker.

## Phoenix vs. leadspeed.me

The current production domain is `leadspeed.me` (since ~2023-04-10). The earlier `phoenix.leadspeed.me` URL referenced in older emails was the V2 frontend. After V3 launch, V2/Phoenix was decommissioned (May 2023).

## FMS tenants — V3aviation, Beardefence, Logr

The FMS application is **multi-tenant**. Different customers operate under different tenant brands:

- **V3aviation** — flagship FMS tenant, served at `fms.v3aviation.aero`. Customer: V3 Aviation (Jennifer Jolivet at `jjolivet@v3aviation.aero`). Their public-facing wildcard cert lives at `*.bearair.me`.
- **Beardefence** — separate FMS tenant. Mentioned in the 2023-04-12 FMS release as a deployment target alongside V3aviation.
- **Logr** — third FMS tenant. Per Varun 2023-04-12: *"We weren't able to test this feature on Logr application"* — implying it's a known but separate-test-environment tenant.

If a customer mentions any of these names, they're talking about an FMS instance.

## Jira workflow — Stage → Release Candidate → Production

The LeadSpeed Jira board has a status flow that includes a **Release Candidate** column (added 2023-04-27). The standard ticket lifecycle:

1. Dev complete → tested in **QA**
2. Pushed to **Stage** for John's review
3. After John verifies, ticket moves to **Release Candidate** column
4. Tickets in Release Candidate are batched into the next Production deploy
5. After deploy, status moves to **Done**

This means John reviews things twice: when they hit Stage, and again as Release Candidates before they go to Prod.

## ls-prod-svr VM

The Production application VM for LeadSpeed v2 (since superseded). Originally **Standard DS2 v2** (2 vCPU, 7 GB RAM, ~$106.58/mo). Sized up in February 2023 due to high CPU/memory utilization — see [bugs/leadspeed-v2-high-cpu-2023-02](bugs/leadspeed-v2-high-cpu-2023-02.md). Later subjected to IP migration in September 2025 (see [infra/azure-public-ip-upgrades](infra/azure-public-ip-upgrades.md)).

## Azure DevOps (vs. GitHub)

LeadSpeed's source repositories and CI/CD pipelines migrated from the Softwerks GitHub organization to **Azure DevOps** in September 2022. Approved by John 2022-09-26. Anyone looking for the LeadSpeed source code in GitHub will not find it under Softwerks; it lives in Azure DevOps now.

## Revamp

DreamOrbit's internal codename for the V3 build effort, used in 2022 weekly status reports (e.g., *"Performing regression testing on stage is On hold until Revamp is completed"*). If you see "Revamp" in older emails, it means V3 development. See [architecture/m1-decommissioning-and-revamp](architecture/m1-decommissioning-and-revamp.md).

## "entered by" vs "lead owner"

V2/M1 had an "entered by" field showing the M1 user who originally created the lead. V3 **removed "entered by"** and replaced it with **"lead owner"** sourced from the HubSpot deal owner. If a user asks "who entered this lead?" — the V3 answer is the HubSpot deal owner. Decided 2022-12-30.

## hydrodyne.screenconnect.com

The web entry point for accessing the legacy M1 application's Windows machine. Credentials `softwerks@hydro-dyne.com` were used by Saksoft for V2→V3 migration work. With M1 decommissioned, this access path should no longer be needed for normal operations — only for historical data archaeology.

## SendGrid

The email-sending service used by LeadSpeed (and previously FlightOps) for notifications. Has its own subscription credentials. In June 2022 the FlightOps SendGrid was being refreshed with new credentials. If LeadSpeed notifications stop sending (not the same as "responders configured wrong" — actual delivery failure), check SendGrid status / credentials first.

## Telerik Kendo UI license

LeadSpeed v3's frontend uses **Kendo UI** (Telerik). The license is annual; John holds the subscription and shares the license key with Saksoft for QA/Stage/Prod environments. Subscription product: *"Kendo UI + ASP.NET (MVC & Core), PHP, JSP - Priority Support"*. Originally renewed 2023-02-07. License expired in 2025-05 (see "Angular Kendo UI License" thread, 2025-05-15).
