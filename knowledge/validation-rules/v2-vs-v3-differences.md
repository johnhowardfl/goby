Running list of confirmed differences between **LeadSpeed V2** and **LeadSpeed V3**. Useful when a user is comparing the two, complaining V3 doesn't behave like V2, or asking "what changed?" Update this file as more V2/V3 differences surface.

## Equipment types per Proposal

- **V2:** Maximum **2 equipment types** per proposal.
- **V3:** Maximum **5 equipment types** per proposal.

Source: Varun Dabir, 2024-08-22 ("Project proposal queries"). Confirmed direction was to align V2's proposal format with V3's broader equipment-type capacity.

## Task reassignment behavior

- **V2:** When a task is reassigned, it appears in **both** the original assigner's and the new assignee's task grids. (See: [task reassignment bug](../bugs/task-reassignment-2026-04.md))
- **V3:** Same behavior carried over from V2 — it's a long-standing pattern, not a regression.
- **Future intent (per John, 2026-04-13):** Change so reassigned tasks disappear from the original assigner's grid and only appear in the new assignee's. Pending design discussion.

Affected modules: Sizing, Pricing, Drawing.

## Application platform

- **V2:** Older application stack (Phoenix-era frontend at `phoenix.leadspeed.me`, also referenced as `v2.leadspeed.me`).
- **V3:** Modern Angular frontend with Kendo UI, Azure-hosted, with a separate **PWA (Technician)** application for field/mobile use. Production PWA at `https://app-leadspeed-v3-pwa-prod.azurewebsites.net/` (stood up 2026-03-30).

## Data migration policy

When implementing a new V3 module that has a V2 predecessor, the default decision tree (based on the Questions module precedent, 2025-12-16):
- If the V2 feature **was actively used** → migrate the data.
- If the V2 feature **was not actively used** → do NOT migrate; users will recreate templates / records in V3.

The Questions module specifically was decided as no-migration (recreate post-launch).

## Employee ID → User ID consolidation

- **V2 / pre-V3 era:** Hydro-Dyne employees had distinct **M1 Employee IDs** that were separate from LeadSpeed user accounts. When an M1 user gained LeadSpeed access, they had two identities: their M1 Employee ID and their LeadSpeed v2 user.
- **V3:** Consolidated. There's a single **User ID**, period. New M1 users now get a LeadSpeed user, full stop — no separate Employee ID concept.

Confirmed by John Howard 2024-02-14 in response to Varun's clarification: *"I expected this would need to be the evolution of the users. Transitioning all types of users/employees from whatever platform to be just a user of leadspeed. No need to house multiple [user types]."*

If a user references "their Employee ID" expecting it to behave separately from their LeadSpeed user, explain that V3 unified them — there's one identity now.

## Unknown / untracked differences

The full V2 → V3 design diff isn't centrally documented in email — it's spread across release notes, Jira tickets, and oral history. If a user asks "did V3 change behavior X?" and it isn't covered above, check the release timeline and ask Varun or Leela.
