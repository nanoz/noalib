# Preview

Static Vite + TypeScript frontend that renders a PNG mockup and overlays dynamic validity dates. It is visibly marked as non-valid and is not a transport ticket.

## Safety

- The screen always displays `SPECIMEN — NON VALABLE`.
- The app does not generate a valid QR code.
- The app does not call Nxxlib APIs or any other production validation service.
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

`now` freezes the reference time. `fit=contain` shows the whole mockup for calibration. `debug=1` shows viewport, screen, scale, canvas, and computed date data while keeping the non-valid safety mark visible.

## Home Screen Display

For the least browser chrome on iPhone, open the site from the iOS Home Screen. The app is configured with:

- `apple-mobile-web-app-capable=yes`
- `apple-mobile-web-app-status-bar-style=black-translucent`
- `viewport-fit=cover`
- manifest `display=fullscreen` with `standalone` fallback

The iPhone 16 Pro layout target is `402 x 874` CSS pixels, matching Apple's `1206 x 2622` native display resolution at 3x. The layout keeps phone-shaped cover renders full-screen and top-aligned even when iOS reports a slightly shorter visual viewport, using the device screen height when the screen width matches the app width. The real iOS status bar remains visible over the green header. Only the duplicate status-bar artwork baked into the PNG is masked, so the real iOS time, signal, and battery do not appear twice.

iOS controls the time, signal, and battery status area. If the installed Home Screen app still shows those system indicators, there is no reliable web-only switch to force-hide them across iOS versions.

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
Custom domain: nxxlib.arno.bzh
```

The repository includes `public/CNAME` with:

```txt
nxxlib.arno.bzh
```

GitHub's current Pages documentation distinguishes apex domains from subdomains:

- Apex domains, such as `example.com`, use `A` records pointing at GitHub Pages IP addresses.
- Subdomains, such as `www.example.com` or `nxxlib.arno.bzh`, are documented with a `CNAME` record pointing at the GitHub Pages default domain.

If this host is configured with `A` records, use the GitHub Pages IPv4 addresses:

```txt
Type: A
Name: nxxlib
Value: 185.199.108.153

Type: A
Name: nxxlib
Value: 185.199.109.153

Type: A
Name: nxxlib
Value: 185.199.110.153

Type: A
Name: nxxlib
Value: 185.199.111.153
```

For the GitHub-documented subdomain setup, create this record instead:

```txt
Type: CNAME
Name: nxxlib
Target: <github-owner>.github.io
Proxy: DNS only, if using Cloudflare
```

Enable HTTPS once GitHub Pages finishes certificate provisioning. The `CNAME` file alone is not sufficient for GitHub Actions-based Pages deployments; the Pages custom domain setting must also be configured.
