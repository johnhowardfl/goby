Reference for the **Lead Date** field on the Create Lead form. Confirmed by Saksoft team 2024-01-19 in response to a "Lead Date Issue" investigation.

## How the field works

- **Field:** Lead Date on the Create Lead form
- **Type:** Date picker
- **Mandatory:** Yes (RSM cannot create a lead without selecting a date)
- **Convention:** RSM should select the **current date** when creating a lead
- **Effective behavior:** functions as a "Lead Created At" timestamp

## Why mandatory & why current date

Treating Lead Date as the lead's effective creation date keeps reporting and chronological queries consistent. If RSMs were free to leave it blank or backdate routinely, downstream metrics (sales pipeline, lead aging) would be unreliable.

## How to talk to users

- If a user asks "why do I have to fill in Lead Date when I create a lead?" — explain it's the lead's effective creation timestamp and is required for reporting consistency.
- If they ask "can I backdate the Lead Date?" — technically yes (the picker accepts past dates), but the **convention is to use today's date.** Backdating should only be done with a clear business reason.

## Source thread

Subject: "Re: Lead Date Issue - Root Cause." — 2024-01-19, Leela Kumar C → John Howard.
