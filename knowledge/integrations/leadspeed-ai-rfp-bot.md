**Status:** Discovery / planning phase as of March 2026. Saksoft CoE engaged. Distinct from the Pinecrest AI chatbot integration (see [chatbot-api-write-access](./chatbot-api-write-access.md)).

## What it is

A planned LeadSpeed AI capability for **RFP (Request for Proposal) ingestion** and **bot-driven lead creation** — extracting structured lead/leadline data from RFP documents and creating records in LeadSpeed automatically.

## Origin

Kicked off 2026-03-16 when John reached out to Ashith Raj at Saksoft about LeadSpeed write-API access for AI integration. That conversation expanded into a broader RFP ingestion scope.

Meeting held 2026-03-18 (MoM in thread "LeadSpeed AI Integration – RFP Ingestion & Bot-driven Lead Creation"). Attendees: John Howard, Varun Dabir, Ranjit (Saksoft), Ashith Raj, others.

## Saksoft CoE involvement

Priyaranjan ("PR") at Saksoft requested all related correspondence be cc'd to **`CoE@saksoft.com`** so a CoE team member can track the engagement. Honor this on future emails about the RFP bot effort.

Saksoft team on this:
- **Ranjit F** (`ranjit.f@saksoft.com`) — initial point at Saksoft
- **Ashith Raj** (`ashith.raj@saksoft.com`) — also engaged
- **Priyaranjan P** (`priyaranjan.p@saksoft.com`) — CoE oversight
- **Varun Dabir** (`varun.dabir@saksoft.com`) — LeadSpeed product lead, looped in
- **Joseph Regis**, **Amit Verma** — added to a follow-up thread on 2026-04-08

## Status as of last visibility

- 2026-04-07: John asked to meet with the Pinecrest AI integrator (David Reo, "David Neo" in his typo) to discuss API write requirements.
- 2026-04-08: Varun proposed a meeting at 11:30 AM ET to discuss chatbot scope and scalability requirements.
- Beyond that, the RFP-specific scope details aren't visible in the email archive yet — conversations may have moved to calls or other channels.

## Open question — overlap with Pinecrest

Two AI integration tracks exist in parallel:
1. **Pinecrest AI chatbot** (David Reo) — uses LeadSpeed read+write APIs for general chatbot UX.
2. **LeadSpeed AI RFP ingestion** (Saksoft CoE) — RFP-specific document → lead creation.

Whether these converge or stay separate is not clearly stated in the email record. If a question arises about "which AI does what," confirm with John before answering.

## Existing project proposal module dependency

In a 2026-02-19 email, Varun noted that the **Project Proposal module** backend workflow needs to be addressed and stabilized **before** AI-driven proposal generation can be enabled. Treat this as a prerequisite for any RFP-bot generative work.

## Source threads

- "Leadspeed AI Integration" — 2026-03-16
- "LeadSpeed AI Integration – RFP Ingestion & Bot-driven Lead Creation" — 2026-03-18 to 2026-04-08
- "Create Project proposal for User" — 2026-02-19 (prerequisite work)
