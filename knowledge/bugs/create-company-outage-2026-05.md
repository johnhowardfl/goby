**Status:** Resolved 2026-05-06. Total downtime ~15 hours from report to fix.

## Symptom

Sales users could not create new Companies, blocking new Lead creation. "Sales dead in the water." Confirmed affecting at least 4 Sales Engineers (Srage, Leandro, John, Rick).

In Stage environment, John was able to repro: Company creation **failed**, but Lead creation still **worked**.

## Timeline

| Date / time (UTC) | Who | Event |
|---|---|---|
| 2026-05-05 20:13 | John Howard → Varun Dabir | Reported as URGENT, sales blocked |
| 2026-05-05 20:45 | John Howard → Varun (cc Leela) | Repro confirmed in Stage; video attachment `ls-creatre-error.mp4` |
| 2026-05-06 05:23 | Varun Dabir | "Team is on it, will update at the earliest" |
| 2026-05-06 06:22 | Varun Dabir | "The team has identified the issue, it will be fixed in the next couple of hours" |
| 2026-05-06 11:02 | Varun Dabir | "We have resolved the issue and deployed the Logo for PWA as well" |

## Root cause

**Not stated** in the email thread. Saksoft team identified and fixed without sharing the underlying cause externally. If a similar outage recurs, ask Varun or Leela to dig into the post-mortem before assuming it's the same root cause.

## Bundled fix

Same hotfix that resolved the create issue also deployed the **PWA logo** that John had been owing the team — both shipped together on 2026-05-06 11:02 UTC.

## Related context

This outage occurred during the same window as the Chatbot API release regression issues (see [Leadline Copy bug](../bugs/leadline-copy-form-2026-05.md) and the broader 2026-05-07 process explanation from Varun). The "5 additional regression-fix issues" Varun mentioned likely include this one.

## How to triage if it recurs

1. Confirm scope: Stage only, Prod only, or both?
2. Confirm whether Lead creation also fails or only Company creation (May 2026 case: only Company failed).
3. Get repro from at least one user (video preferred).
4. Escalate to Varun Dabir with explicit "URGENT" — past response time was ~9 hours overnight (India is ~9.5h ahead of US Eastern).

## Source threads

- "URGENT Leadspeed Create Problems" — 2026-05-05/06
- "URGENT: Leadspeed Create Issue" — 2026-05-05/06 (companion thread, Stage repro)
