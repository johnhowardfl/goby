Reference for how **Lead/Deal Amount** flows from HubSpot into LeadSpeed and what calculations the LeadSpeed app does (or does not) perform on it. Open question as of 2024-04-22; verify current state before answering definitively.

## Current behavior (as of 2024-04-22)

- **Deal Amount on the Deal Dashboard** is sourced from **HubSpot**.
- LeadSpeed does NOT calculate Deal Amount itself — it's a passthrough from HubSpot.
- This means changes to Deal Amount must happen **in HubSpot**, not in LeadSpeed; LeadSpeed reflects what HubSpot has.

## Open question

The 2024-04-22 thread asked for confirmation on the current logic and how it should behave going forward. The full follow-up response from John isn't visible in the email record — confirm current behavior with Varun or Leela before telling a user the rules definitively.

## How to talk to users

- If a user asks "why is the Deal Amount different in LeadSpeed vs. what I expected?" — first check HubSpot. The discrepancy is most likely a HubSpot data issue, not a LeadSpeed display bug.
- If a user wants to **edit** the Deal Amount in LeadSpeed and can't, that's expected — they should edit in HubSpot.

## Source thread

Subject: "Need Confirmation on Lead/ Deal Amount and Leadspeed Activity" — 2024-04-22, Varun Dabir → John Howard.
