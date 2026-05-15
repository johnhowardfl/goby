**The single most important context document for understanding why LeadSpeed exists and what its long-term strategic role is.** Captured from John Howard's "LeadSpeed Evolution" email to Neeraj Kumar (DreamOrbit) on 2022-01-15 — the moment Hydro-Dyne committed to the V3 vision after "many months of contemplation."

## Why LeadSpeed exists

Hydro-Dyne uses **Genius** as its ERP system. Genius is the right fit for Hydro-Dyne's **production** needs — it out-features the older **M1** system there. **However:**

- Genius does **NOT** include a native CRM.
- Genius's CRM is offered as a **bolt-on module** that is:
  - **expensive per seat**, and
  - would take a long time to build out what LeadSpeed already does
- Genius's CRM **doesn't fit Hydro-Dyne's unique approval and notification processes**.

So LeadSpeed exists to be the CRM layer that Genius lacks.

## The strategic plan (set Jan 2022)

> "Unhook LeadSpeed from M1 completely and retire the sync process. Users will still follow the same process as before by entering Lead Form details and moving through the drawing, pricing approvals, etc. Once a Lead reaches maturity it will become a 'job' and we will add a feature to export the Lead details in a meaningful way where they will be utilized to create the job in the Genius ERP."

Translated to architecture decisions:

1. **Decouple from M1** — eliminate the M1 sync dependency that V2 carried. M1 retires.
2. **Keep the LeadSpeed CRM workflow** — Lead → drawing → pricing → approvals → maturity. This is the Hydro-Dyne unique-process moat.
3. **Add a "job export" boundary** — when a Lead matures, LeadSpeed exports the relevant data to Genius so Genius can create the production Job record. LeadSpeed stops at the boundary; Genius takes over for production.
4. **Enrich the CRM features** — V3 is a chance to add what V2 lacked on the CRM side.

## How Lead → Genius integration is intended to work

Per Neeraj's reply 2022-01-17, the data export to Genius can take any form Genius supports:
- **CSV** export
- **XML over FTP**
- **REST API calls**

The choice depends on what Genius accepts. As of last visibility in email, the integration shape was not yet finalized — it's a downstream decision driven by Genius's capabilities.

## What this means for support questions

- **"Why doesn't Hydro-Dyne just use Genius for everything?"** Because Genius's CRM is expensive per seat, slow to build out, and doesn't fit their unique approval/notification needs. LeadSpeed is the cost-effective custom CRM that handles the pre-job lifecycle.
- **"Why is LeadSpeed a separate system from the production data?"** By design. LeadSpeed handles the CRM/sales/pre-job lifecycle; Genius handles production. The two are joined at the boundary where a Lead becomes a Job.
- **"Will my Lead automatically become a Genius Job?"** Eventually yes, via export — but the specific mechanism (CSV, XML, REST) and automation level depends on the Genius integration that gets built out. Verify current state before promising real-time sync.

## People mentioned in the inception thread

- **John Howard** (Softwerks) — strategic decision maker
- **Neeraj Kumar** (DreamOrbit) — engineering lead at the vendor; received and ran with the vision
- **Pawan Yadav** (DreamOrbit) — took on user-story definition with John
- **Rijesh PV** (DreamOrbit) — original V2 lead; was being reassigned at this point. John specifically asked for him back.
- **Mital Mayur** (DreamOrbit) — senior PHP developer who picked up the LeadSpeed code base after Rijesh's reassignment. Critical historical role for V3 architecture.

## Source thread

Subject: "LeadSpeed Evolution" — 2022-01-15 to 2022-01-17, John Howard ↔ Neeraj Kumar.

This is the canonical statement of the LeadSpeed product vision and should be referenced first when explaining "what is LeadSpeed for?" or "why doesn't LeadSpeed just X?"
