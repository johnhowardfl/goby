**Status:** Completed March 2026. Documented here so anyone investigating Stage VM history understands the disk type changed and why.

## Background

Saksoft (Teja Jangam) flagged on 2026-03-02 that the **Stage Virtual Machine** under the LeadSpeed environment was using **Azure unmanaged disks**.

Microsoft announced retirement of unmanaged disks effective **31 March 2026**.

## What was done

- Teja requested approval 2026-03-02; followed up 2026-03-04 and 2026-03-11 when no response.
- Leela Kumar C re-pinged John for approval on 2026-03-13.
- John approved same day: *"Go ahead and get us migrated Teja!"*
- Migration completed before the 31 March deadline.

## Why this matters going forward

- The Stage VM now runs on **managed disks** — backup/snapshot/lifecycle behavior may differ from any pre-migration documentation.
- If a future investigation references the old unmanaged-disk path or any related pre-March 2026 Azure storage account, treat it as outdated.
- The Production environment's disk type is **not stated** in this thread — confirm with Teja before assuming it was also migrated.

## Source thread

Subject: "Migrate your data to Azure managed disks by 31 March 2026" — 2026-03-02 to 2026-03-13.
