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
