# Deploying Goby on Pluto (goby.softwerks.pro)

This is the v1 deployment recipe. Target environment: AlmaLinux 9 + Webmin/Virtualmin + Apache, with Node 22 already installed.

## 1. Create the virtual server

In Virtualmin: **Create Virtual Server**, domain `goby.softwerks.pro`. Enable Apache + Let's Encrypt SSL. (Or run `virtualmin create-domain` from the CLI.)

DNS: point an A record for `goby.softwerks.pro` at `51.81.67.95` before requesting the cert.

## 2. Drop in the app

```bash
ssh pluto
mkdir -p ~/apps && cd ~/apps
# rsync from your dev machine, or git clone:
# rsync -avz --exclude node_modules --exclude data --exclude .env F:/apps/goby/ pluto:~/apps/goby/
cd goby
npm install --omit=dev
npm run build
cp .env.example .env
# edit .env — set ANTHROPIC_API_KEY, VOYAGE_API_KEY, SESSION_SECRET (random hex),
# COOKIE_SECURE=true, PUBLIC_URL=https://goby.softwerks.pro
```

Bootstrap the first admin:

```bash
npm run init-admin
```

Drop knowledge docs into `knowledge/` and run `npm run ingest`.

## 3. systemd unit

Copy `deploy/goby.service` to `/etc/systemd/system/goby.service` (edit User= and WorkingDirectory= for your install location), then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now goby
sudo systemctl status goby
journalctl -u goby -f   # watch logs
```

## 4. Apache reverse proxy

In Virtualmin → Services → Configure SSL Website → Edit Directives, add inside the `<VirtualHost>` for goby.softwerks.pro:443:

```apache
ProxyPreserveHost On
ProxyPass / http://127.0.0.1:3001/ retry=0 timeout=120
ProxyPassReverse / http://127.0.0.1:3001/

# SSE streaming — disable buffering on the chat endpoint
<Location /api/chat/conversations>
  SetEnv proxy-sendchunked 1
  SetEnv no-gzip 1
</Location>
```

Make sure `mod_proxy` and `mod_proxy_http` are enabled. Reload Apache.

The non-SSL VirtualHost (port 80) should already redirect to HTTPS by default in Virtualmin.

## 5. Verify

- `https://goby.softwerks.pro/health` returns `{ ok: true, model: ... }`
- `/login.html` loads
- Sign in as the admin you bootstrapped, then `/admin.html` shows the upload UI

## Updating

```bash
ssh pluto
cd ~/apps/goby
git pull   # or rsync from dev
npm install --omit=dev
npm run build
sudo systemctl restart goby
```

## Backups

The whole app is in `~/apps/goby`. The state is in `data/goby.db` — back that up with the rest of your Webmin scheduled backups, or:

```bash
sqlite3 ~/apps/goby/data/goby.db ".backup '/backups/goby-$(date +%F).db'"
```

## DDoS / abuse mitigation

Defense is layered; the app handles only the innermost layer:

1. **OVH edge** — volumetric (L3/L4) scrubbing is automatic for the `51.81.67.95`
   IP and managed from the OVH manager (Network Security Dashboard). Nothing to
   deploy here. Note: OVH only emails about this; they never ask you to click
   through to "enable" protection, so treat any such message as suspect.
2. **Apache reverse proxy** — for L7 floods you can add `mod_reqtimeout` and
   `mod_evasive`, or rate-limit per-IP with `mod_qos`, in the VirtualHost.
3. **Application (built in)** — `express-rate-limit` caps abuse that reaches
   Node, keyed to what each route actually costs:
   - global per-IP ceiling on every request (volumetric backstop),
   - tight per-IP limit on `/api/auth/login` + `/signup` (brute-force / bcrypt
     CPU amplification),
   - per-**user** limit on the chat endpoint, which spends money on Anthropic +
     Voyage for every call.

   Limits are tunable via `RATE_LIMIT_*` env vars (see `.env.example`); set
   `RATE_LIMIT_DISABLED=true` to turn the layer off for load testing. Because
   the app sits behind Apache, `trust proxy` is enabled so limits key off the
   real client IP from `X-Forwarded-For`, not the loopback address.

## Migrating to Azure (later)

When ready:

1. Replace `better-sqlite3` with a Postgres or Azure SQL driver. The schema in `src/db.ts` ports cleanly.
2. Move secrets to Azure Key Vault; use `@azure/identity` to read them.
3. Deploy as App Service or container. The express server is provider-agnostic.
4. Add the Microsoft Bot Framework adapter (`botbuilder` + `botbuilder-azure`) as a thin wrapper over `streamReply`. Register an Azure Bot, generate the Teams app manifest.
