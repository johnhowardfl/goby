Reference for what routine monitoring/reporting Saksoft provides on LeadSpeed infrastructure, so anyone wondering "where is the daily report?" or "when do we hear about issues?" knows the cadence.

## Daily Infra Monitor Report

- **Sender:** Teja Jangam (`teja.j@saksoft.com`)
- **Recipients:** John Howard (To); Rudresh M, Leela Kumar C, Varun Dabir, Mukesh Verma K (Cc)
- **Cadence:** every weekday, typically arriving between 12:00 and 14:00 UTC (approximately morning India time, before US Eastern starts)
- **Subject:** "Daily Infra Monitor report of LeadSpeed"
- **Filter label:** John has these auto-labeled (Gmail label ID `Label_12`)

## Weekly Infra Monitor Report

- Same sender and recipients
- **Cadence:** Friday afternoons (UTC)
- **Subject:** "Weekly & Daily Infra Monitor report of LeadSpeed"
- This message bundles the day's daily plus the week's roll-up

## What's in the reports

Attachment-based — the email body is consistently *"Hi All, Please find the attached Daily monitoring report of LeadSpeed. Regards, Teja"* with no inline detail. The PDF/DOCX attachment contains the actual metrics. Open the attachment for specifics.

## How to use this

- If a report doesn't arrive by 15:00 UTC on a weekday, the monitoring pipeline may be down — ping Teja.
- If you need historical health metrics, the reports are the source — search Gmail for `from:teja.j@saksoft.com subject:monitor` and pull the right day's attachment.
- The reports are routine; there's no need to read every one. They become important when investigating an incident retroactively.

## Notification of failures

Application-level errors (e.g., the Microsoft Graph API password-expiry failures) come from `noreply@leadspeed.me` and go to Aniket Khadye and Leela Kumar C, not the Daily Monitor Report. So an unhealthy integration may not show in the daily report — different signal path.
