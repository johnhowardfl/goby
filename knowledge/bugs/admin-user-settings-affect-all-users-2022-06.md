**Status:** Identified 2022-06-23 as the root cause of recurring "Default Responders" complaints. Behavior pattern; verify whether it has been fixed in V3 before assuming it's gone.

## Symptom

In LeadSpeed v2, when Christy Howard set up the **Default Responders** screen, the values kept reverting to "DO Test Users" every few days. Christy reported having fixed the screen at least 5 times in two weeks. Other Hydro-Dyne users were not seeing their notifications correctly.

## Root cause (Varun, 2022-06-23)

> *"When the User with admin access changes the user settings for his profile, it gets updated to all the other Users using the application. This is the [bug]."*

In V2, an admin editing **their own profile's user settings** unintentionally **propagated those settings to every other user** in the application. So when a DreamOrbit admin (using a "DO Test User" identity) updated their own settings, the Hydro-Dyne users' settings (including responder configuration) got overwritten with the DO Test User values.

## What this means going forward

- This is **specifically a V2 behavior**. Whether V3 inherited the same admin-settings cross-user propagation has NOT been confirmed in the email record visible to me. **Verify in V3 before assuming the bug is gone.**
- If a Hydro-Dyne user reports that "my responder settings keep changing back" or "my notification settings reverted," investigate whether a Saksoft team member (or any admin) recently edited their own profile settings — that may be the trigger.
- The recommended workflow per Varun (2022-05-30): for notification issues, the **admin user** should configure responders on the receiving user's profile, then have that user verify, before assuming the issue is on Saksoft's side.

## Source thread

Subject: "Default Responders in Leadspeed" — 2022-06-22 to 2022-06-23, Christy Howard → John Howard → Varun Dabir.
