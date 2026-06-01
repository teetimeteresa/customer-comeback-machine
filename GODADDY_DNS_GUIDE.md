# GoDaddy DNS Setup Guide — Customer Comeback Machine
## Complete DNS Configuration for customercomebackmachine.com

---

## Part 1: Web App DNS Records (Pointing to Your Server)

**⚠️ IMPORTANT: Where is the app hosted?**
Before adding web DNS records, you need to know your server's public IP or hosting platform:

### If hosted on Vercel:
Add a **CNAME** record:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 1 hour
```

### If hosted on Railway/Render/Fly.io:
Add an **A record** pointing to your server's public IP:
```
Type: A
Name: @
Value: [YOUR_SERVER_PUBLIC_IP]
TTL: 1 hour
```

### If using a tunnel/proxy (e.g., for development):
```
Type: A
Name: @
Value: [TUNNEL_PUBLIC_IP]
TTL: 1 hour
```

### Subdomain (www) — For all platforms:
```
Type: CNAME
Name: www
Value: @
TTL: 1 hour
```

---

## Part 2: Resend Email Verification DNS Records

**Status as of last check:** `not_started` — DNS records need to be added at GoDaddy

Add these 3 DNS records in your GoDaddy DNS management panel:

### Record 1 — DKIM (TXT record for email authentication)
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUB7kWWTCzKfD8RRLcJSt3y4gGeABpfvKPBbsfa8DVnXQRHOdeovjwhT6IzynSzv558xcONkUjfoQn1eVKataJjp1zLwQV3AQkK7WdU9EpMvhsheFjLj8UUIwTCymV8X0M8xA9mr3TXp9wDd1vJ0LiwC0/g2gMq4K7WALmQwpR1QIDAQAB
TTL: Auto (or 1 hour)
```

### Record 2 — SPF (MX record for email delivery)
```
Type: MX
Name: send
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: Auto (or 1 hour)
```

### Record 3 — SPF (TXT record for sender policy)
```
Type: TXT
Name: send
Value: v=spf1 include:amazonses.com ~all
TTL: Auto (or 1 hour)
```

---

## How to Add DNS Records in GoDaddy

1. Log into **GoDaddy** → **My Products**
2. Find **customercomebackmachine.com** → Click **DNS**
3. Click **Add** → Choose record type → Fill in values → Save
4. Wait **5–30 minutes** for DNS propagation
5. Check Resend dashboard or re-run the check script to confirm verification

---

## How to Check Resend Verification Status

Run this command on the server:
```bash
cd /home/team/shared && node -e "
const https = require('https');
const RESEND_API_KEY = 'process.env.RESEND_API_KEY';
function fetch(url, opts = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = { hostname: urlObj.hostname, port: 443, path: urlObj.pathname + urlObj.search, method: opts.method || 'GET', headers: opts.headers || {} };
        const req = https.request(options, res => { let body = ''; res.on('data', chunk => body += chunk); res.on('end', () => { try { resolve({ ok: res.statusCode >= 200, status: res.statusCode, json: () => JSON.parse(body) }); } catch (e) { resolve({ ok: false, status: res.statusCode, text: () => body }); } }); });
        req.on('error', reject);
        if (opts.body) req.write(opts.body);
        req.end();
    });
}
async function main() {
    const r = await fetch('https://api.resend.com/domains', { headers: { Authorization: 'Bearer ' + RESEND_API_KEY } });
    const data = await r.json();
    console.log(JSON.stringify(data, null, 2));
}
main().catch(console.error);
"
```

**Status `verified`** = Email sending is live!
**Status `not_started`** = DNS records not yet added or not yet propagated.

---

## Summary: All DNS Records to Add at GoDaddy

| # | Type | Name | Value | Purpose |
|---|------|------|-------|---------|
| 1 | TXT | resend._domainkey | [DKIM key above] | Email authentication (DKIM) |
| 2 | MX | send | feedback-smtp.us-east-1.amazonses.com | Email delivery (SPF) |
| 3 | TXT | send | v=spf1 include:amazonses.com ~all | Sender policy (SPF) |
| 4 | A/CNAME | @ | [YOUR_HOSTING_IP/CNAME] | Web app |
| 5 | CNAME | www | @ | WWW redirect |
