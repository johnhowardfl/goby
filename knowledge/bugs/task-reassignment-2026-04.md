**Status:** Reported 2026-04-13. Saksoft confirmed the behavior; design change pending. **Not yet fixed.** This is a long-standing behavior, present since LeadSpeed V2 — not a regression.

## Symptom

When a user reassigns a task to another user, the task **continues to appear in both users' task grids** instead of moving to the new assignee only.

Reporter: Cullen (recorded a video showing the behavior). Witnessed example: Cullen reassigned a task to Bobby — task showed up in both Cullen's and Bobby's task grids.

## Scope

The behavior is consistent across **Sizing, Pricing, and Drawing** modules (confirmed by Varun Dabir on 2026-04-13). It has been this way since the V2 application — not a recent regression introduced by V3.

## John's design direction

> "If we reassign a task, we should assume it is no longer the responsibility of the user who reassigned it and should not appear on their task list."

So the desired behavior is: **after reassignment, the task disappears from the original user's grid and appears only in the new assignee's grid.**

## Why no fix yet

Saksoft asked for explicit confirmation before changing the behavior, because:
1. It touches three modules (Sizing, Pricing, Drawing).
2. It changes long-standing behavior dating back to V2 — anyone relying on the old behavior would be affected.

As of the last email (2026-04-13), the conversation was open: "let's talk about how we make this adjustment to the flow." No follow-up email confirming a change was found.

## How to talk to users

- Confirm: yes, this is known behavior, not a new bug.
- Explain: the original assigner sees the task in their grid as a side effect of the V2 architecture. We are evaluating a flow change.
- Workaround: the assignee (Bobby in the example) is the canonical owner — work should proceed from their grid. The original assigner can ignore the entry.

## Source thread

Subject: "Issue Reassignment Problem" — 2026-04-13, John Howard ↔ Varun Dabir, cc Leela Kumar C. Cullen's screen recording attached: `Screen Recording 2026-04-09 095537.mp4`.
