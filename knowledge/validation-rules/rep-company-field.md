Reference for how the **Rep Company** field behaves in LeadSpeed v3. Confirmed by John Howard 2024-09-23 in response to Varun Dabir's clarification questions.

## How the field works

- **Type:** Dropdown (NOT free text).
- **Source of values:** Companies pulled from the **CRM** (Hydro-Dyne's CRM, not a separate LeadSpeed table).
- **Mandatory:** (Not explicitly answered in the email visible — confirm before telling a user.)
- **Reports module inclusion:** (Question asked by Varun, answer not visible in thread — confirm.)
- **Separate database table:** (Question asked by Varun, answer not visible in thread — likely no separate table because values come from CRM, but confirm.)

## How to talk to users

If a user asks why they can't type a custom Rep Company name into the field — **that's by design.** Rep Company values must come from the CRM. To add a new Rep Company, it has to be added to the CRM first.

If a Rep Company they expect to see is missing from the dropdown, the issue is upstream in the CRM — it isn't a LeadSpeed bug.

## Source thread

Subject: "Rep Company Field data Confirmation" — 2024-09-23, Varun Dabir → John Howard (cc Leela Kumar C, Aniket Khadye). John's clear answer: *"It'll need to be a dropdown with our companies from the crm."*
