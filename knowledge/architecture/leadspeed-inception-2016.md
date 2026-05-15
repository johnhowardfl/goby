**LeadSpeed was conceived and named in September 2016.** Active development with DreamOrbit started October 2016. Production launched October 2017. This file is the canonical timeline for the LeadSpeed v1 era — the foundation everything else sits on top of.

## Inception (September 2016)

The earliest LeadSpeed-named artifacts in email:

- **2016-09-02** — John shares a Google Sheet **"softwerks cost hde leadspeed"** with Christy Howard at Hydro-Dyne. **This is the earliest visible LeadSpeed artifact.** Likely a cost projection / budget for the project.
- **2016-09-06** — John shares a Google Slides deck **"LeadSpeed UI Sketchbook"** with `xxryloxx@gmail.com` (Rylan — an early developer working with John).
- **2016-09-09** — M1 Technology Call scheduled with Aditya Nalla, Neeraj Kumar, and Venkatesh "Venky" N at DreamOrbit. The discussion that initiated the DreamOrbit relationship.
- **2016-09-26** — John ends the relationship with Rylan: *"I need to go in another direction with my LeadSpeed project."* DreamOrbit takes over.
- **2016-09-27** — John sends "Leadspeed Logic Diagram" to Aditya and Neeraj at DreamOrbit.

By the end of September 2016, the project had:
- A name (LeadSpeed)
- A budget plan
- A UI Sketchbook
- A logic diagram
- A signed-up vendor (DreamOrbit) replacing the prior solo developer

## v1 development (Oct 2016 – early 2017)

- **2016-10-05** — DreamOrbit + ECI Solutions (M1 vendor; **Jason Pegel** = `jpegel@ecisolutions.com`) collaborate on the M1 ↔ Azure SQL sync architecture. **Decision:** use M1's `UniqueID` field (a GUID per record, available in all tables) for sync identity, **not Primary Keys** — Jason warned that adding PKs to M1 tables would break M1.
- **2016-10-26** — Leadline form UI fields mapped to M1 database fields (sheet shared between Neeraj and Jason).
- **2016-11-17** — Christy notes that LeadSpeed work qualifies for R&D tax credits (HDE will benefit from this annually).
- **2016-11-27** — John shares the LeadSpeed color palette for Bandaru (UI work).
- **2016-12-05** — Connection of LeadSpeed to M1 in a new test server ("New M1 Test server lite") working — soft test before production wiring.
- **2016-12-12** — Active iteration on Leads/Leadline UI design with Shrey Razdan.
- **2016-12-22** — First Azure billing statement for **"LeadSpeed Resources (Pay-As-You-Go)"** Azure subscription (`2d08f581-9860-4004-a7ba-cbd6d2e9bc1d`).

## Phase 2 (March 2017)

- **2017-03-22** — **LeadSpeed Phase 2 SOW signed.** Neeraj announced a new dedicated developer joining 27th March to work with Anurag.
- LeadSpeed v1 had multiple internal release tags by this point (1.01, 1.02, 1.03, 1.03.01 — the latter visible 2017-05-11).

## v1 launch (October 2017)

- **2017-09-22** — Production build for **line spacing for proposal template** and **project profile data import** ready.
- **2017-09-26** — Production deployment completed and tested. John: *"I'll be submitting this now to HDE so they can finally put some users in there."*
- **2017-10-12** — John in launch week to Hydro-Dyne: *"This week I have been launching LeadSpeed to Hydro-Dyne."* Frustrations with email notification links and login problems being worked through.

## Foundational technical decisions made in 2016

1. **M1 sync uses `UniqueID`, not Primary Keys.** Jason Pegel at ECI was firm — adding PKs to M1 tables would break M1 itself. The performance hit of GUID-based sync was accepted as the cost of doing business.
2. **Azure was the deployment target.** "LeadSpeed Resources (Pay-As-You-Go)" Azure subscription was active by late 2016 (Subscription ID `2d08f581-9860-4004-a7ba-cbd6d2e9bc1d`).
3. **AWS was the test/stage environment.** Used for M1 staging tests through 2017; sunset in late August 2017 once everything moved into Azure.
4. **The relationship structure:** John (Softwerks) is the prime; DreamOrbit (later Saksoft) is the vendor; Hydro-Dyne is the customer. This three-party structure has been consistent since inception.

## ECI Solutions (the M1 vendor)

ECI Solutions is the company that makes M1. **Jason Pegel** (`jpegel@ecisolutions.com`) was the technical contact. ECI's involvement in LeadSpeed was advisory — confirming what Saksoft/DreamOrbit could safely do to/with M1's database. Critical for any future question about what's safe to touch in M1.

## Original LeadSpeed concept

The concept was always: a CRM-like layer to sit alongside Hydro-Dyne's M1 system, capturing the sales/lead/proposal lifecycle in a way M1 couldn't on its own. The 2022 Genius migration shifted the underlying ERP from M1 to Genius, but the **LeadSpeed concept** — a custom CRM sitting alongside the production ERP — has been constant since 2016. See [leadspeed-vision-and-genius-integration](./leadspeed-vision-and-genius-integration.md) for the 2022 strategic refresh.

## Why this matters today

Everything in LeadSpeed has its origin in this 2016 era. The naming, the M1 sync architecture (since retired), the Azure infrastructure, the proposal generator, the project profile concept — all set in motion in the last four months of 2016. Understanding the inception is what makes "why was X done that way?" answerable nine years later.

## Source threads

- "softwerks cost hde leadspeed - Invitation to edit" — 2016-09-02
- "LeadSpeed UI Sketchbook - Invitation to edit" — 2016-09-06
- "Hey Man" — 2016-09-26 (Rylan transition)
- "Leadspeed Logic Diagram" — 2016-09-27
- "M1 Database and Primary Keys" — 2016-10-05 (UniqueID decision)
- "DreamOrbit Invoice" — 2016-10-05 (first LeadSpeed invoice)
- "Leadline form UI fields mapping with M1 database" — 2016-10-26
- "FW: New IRS rules: R&D tax credits for software development" — 2016-11-17
- "LeadSpeed Color Pallete" — 2016-11-27
- "Statement of work - LeadSpeed Phase 2" — 2017-03-22
- Production launch updates — Sept-Oct 2017
