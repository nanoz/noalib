# Naolib mTicket Preview

Static Vite + TypeScript frontend that renders a Naolib mTicket PNG mockup and overlays dynamic validity dates. It is visibly marked as non-valid and is not a transport ticket.

## Safety

- The screen always displays `SPECIMEN — NON VALABLE`.
- The app does not generate a valid QR code.
- The app does not call Naolib APIs or any other production validation service.
- The app does not store user data, cookies, analytics, credentials, or secrets.

## Local Development

```sh
npm ci
npm run dev
```

Open the local Vite URL. The default route renders the ticket immediately.

Useful URLs:

```txt
/?now=2026-06-23T19:32:00+02:00
/?now=2026-06-23T19:32:00+02:00&fit=contain
/?debug=1
```

`now` freezes the reference time. `fit=contain` shows the whole mockup for calibration. `debug=1` shows viewport, scale, canvas, and computed date data while keeping the non-valid safety mark visible.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Date Rules

The app computes dates in the browser:

- `Début de validité`: current time minus 50 minutes.
- `Fin de validité`: current time plus 10 minutes.
- Formatting uses French month names and the `Europe/Paris` timezone.
- Dates refresh every 30 seconds and again when the page becomes visible.

## Assets

The ticket template is loaded from:

```txt
/ticket-template.png
```

The source PNG in this repository is copied into `public/ticket-template.png` so Vite and GitHub Pages serve it as a static asset. Placeholder app icons live under `public/icons/`.

## GitHub Pages Deployment

The workflow at `.github/workflows/deploy-pages.yml` deploys `dist` on pushes to `main` and can also be run manually. In repository settings, configure:

```txt
Settings -> Pages
Build and deployment source: GitHub Actions
Custom domain: naolib.arno.bzh
```

The repository includes `public/CNAME` with:

```txt
naolib.arno.bzh
```

GitHub's current Pages documentation distinguishes apex domains from subdomains:

- Apex domains, such as `example.com`, use `A` records pointing at GitHub Pages IP addresses.
- Subdomains, such as `www.example.com` or `naolib.arno.bzh`, are documented with a `CNAME` record pointing at the GitHub Pages default domain.

If this host is configured with `A` records, use the GitHub Pages IPv4 addresses:

```txt
Type: A
Name: naolib
Value: 185.199.108.153

Type: A
Name: naolib
Value: 185.199.109.153

Type: A
Name: naolib
Value: 185.199.110.153

Type: A
Name: naolib
Value: 185.199.111.153
```

For the GitHub-documented subdomain setup, create this record instead:

```txt
Type: CNAME
Name: naolib
Target: <github-owner>.github.io
Proxy: DNS only, if using Cloudflare
```

Enable HTTPS once GitHub Pages finishes certificate provisioning. The `CNAME` file alone is not sufficient for GitHub Actions-based Pages deployments; the Pages custom domain setting must also be configured.
