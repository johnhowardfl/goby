Open questions and confirmed rules for behavior of the **Leadline form** in LeadSpeed v3, particularly around editing, duplicate equipment, and serial-number generation. Original question from Varun Dabir 2025-06-13; some sub-points are still **open as of last visibility** in email.

## Duplicate equipment entries

**Observation (Varun, 2025-06-13):** Within the Leadline form, users can add multiple leadlines that contain duplicate equipment entries — different equipment items sharing the same name.

**Open question:** How should the system differentiate between them when generating serial numbers?

**Status:** John's reply confirming the differentiation approach is **not visible in the email record**. Confirm the rule with Varun or by inspecting the current code/serial-number generation logic before answering a user definitively.

If a user reports "duplicate-named equipment is producing colliding serials" or "serials look wrong on duplicates," this is the open question's territory.

## Editing the Leadline form after proposal generation

**Open proposal (Varun, 2025-06-13):** Restrict users from editing the Leadline form **once the proposal document has been generated**. Rationale: serial numbers are typically generated at the proposal stage; editing the leadline after that point would invalidate the serials and the proposal artifacts.

**Status:** John's confirmation is not in the email record. Treat as a pending design decision until verified.

If a user complains they "can edit a leadline after the proposal is already out the door," that may either be (a) a valid bug report worth raising, or (b) the unrestricted state because no decision was made yet. Check with Varun or the current code.

## Related: Leadline Copy & Form bug (Part ID / Description not editable after copy)

A separate, **confirmed** bug exists: after copying a Leadline (the standard BID/FIRM workflow), Part ID and Leadline Description are not editable on the new copy. See [bugs/leadline-copy-form-2026-05](../bugs/leadline-copy-form-2026-05.md) for that incident — it is distinct from the edit-after-proposal restriction discussed above.

## Source thread

Subject: "Clarification Needed: Duplicate Equipment Handling and Leadline Edit Restrictions" — 2025-06-13, Varun Dabir → John Howard (cc Leela Kumar C).
