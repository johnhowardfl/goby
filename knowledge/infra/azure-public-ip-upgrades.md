Reference for Azure Public IP migrations done in September 2025, driven by Microsoft's retirement of Basic SKU Public IPs. Important for anyone investigating connection or firewall-rule history that might still reference the old IP addresses.

## Why this happened

Microsoft announced retirement of **Basic SKU Public IP addresses** in Azure (notification flagged by Teja Jangam to John and Varun on 2025-08-08). Action required before the deadline: migrate Basic SKU Public IPs to the **Standard SKU**.

## VMs affected

| VM | Old IP | New IP | Date completed |
|---|---|---|---|
| `ls-stage-app-svr` | `52.168.23.171` | `4.157.141.41` | 2025-09-05 |
| `ls-prod-svr` | (not stated in thread) | (not stated in thread) | 2025-09-15 |

## Activity per VM

The standard sequence (per Teja's planning emails):

1. Power off the VM.
2. Replace the existing Public IP with a new Standard SKU IP.
3. Power on the VM.
4. Verify the application is reachable.
5. (Originally combined with disk migration unmanaged → managed; later separated for the Stage VM, see [azure-managed-disks-migration](./azure-managed-disks-migration.md))

## Why this matters going forward

- Any firewall allow-list, integration config, or DNS record that references the **old IP `52.168.23.171`** for Stage is stale and should be updated to `4.157.141.41`.
- Any documentation referencing the pre-September-2025 Prod IP is also stale — confirm current Prod IP with Teja before relying on it.
- Microsoft is unlikely to reverse the SKU retirement, so the migration is permanent.

## Source threads

- "upcoming retirement of Basic SKU Public IP addresses in LeadSpeed" — 2025-08-08 (heads-up from Teja)
- "IP Upgrade for VM ls-stage-app-svr" — 2025-09-04 to 2025-09-05
- "IP Upgrade for VM ls-prod-svr" — 2025-09-11 to 2025-09-15
