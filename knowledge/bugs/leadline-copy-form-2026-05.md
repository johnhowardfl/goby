**Status:** Reported 2026-05-06, acknowledged by Saksoft 2026-05-07. Resolution status not yet explicitly confirmed in email — likely included in the post-Chatbot-API-release regression fixes (see "Context" below). Verify before telling a user it's resolved.

## Symptom

After copying a Leadline (LL), the user cannot edit **Part ID** or **Leadline Description** fields on the new copy.

Path: `Leadspeed → Leadline Form → Part Info tab`

## Why this matters (workflow context)

For projects that need **Bidding** or **FIRM pricing**, the standard sales workflow is:

1. Find a previously sized and designed Leadline.
2. Copy that Leadline.
3. Rename the copy by appending **"BID"** or **"FIRM"** to the Part ID and the Description.

When the fields are not editable, sales cannot create distinct BID/FIRM versions and the workflow is blocked.

## Reporter

Rick Hsu, working with the RSMs (Regional Sales Managers) entering lead and leadline details.

## Investigation chain

| Date (UTC) | Who | What |
|---|---|---|
| 2026-05-06 | John Howard → Varun Dabir (cc Leela) | Reported with screenshots |
| 2026-05-07 | Varun Dabir | Acknowledged, "We will review and get this resolved at the earliest" |
| 2026-05-07 | Varun Dabir | Sent broader explanation about Chatbot API release issues (see Context) |

## Context — tied to Chatbot API release regression

Varun explained on 2026-05-07 that the Chatbot API was an **ad-hoc, off-sprint** request that bypassed the usual bi-weekly regression cycle:

- Chatbot APIs deployed to Stage on a Wednesday.
- Production release proceeded after John's verbal confirmation on Thursday-evening call.
- No regression was run before Prod deploy.
- Several issues surfaced post-release; Saksoft ran a focused regression on affected areas, found and fixed **5 additional issues**, and deployed all fixes to Prod.
- Going forward, even ad-hoc releases will get a regression check before Prod deployment.

It is plausible the Leadline Copy bug was one of the 5 additional issues fixed during that regression pass — Varun did not explicitly tie it back. **Confirm with Varun or check the next release notes before telling a user it's resolved.**

## Source thread

Subject: "Leadline Copy & Form Issue" — 2026-05-06 onward, John Howard ↔ Varun Dabir, cc Leela Kumar C.
