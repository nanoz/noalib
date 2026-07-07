# PRD — Naolib mTicket Dynamic Validity Preview

## 1. Product summary

Build a small static frontend application that displays a Naolib mTicket mockup full-screen on an iPhone 16-sized mobile viewport and dynamically overlays the two ticket validity date/time values.

The app must compute the dates client-side from the current time:

- `Début de validité` = current time minus 50 minutes
- `Fin de validité` = current time plus 10 minutes

The app is intended for a short Naolib stakeholder preview. It must be deployable from GitHub Pages under the custom domain:

```txt
naolib.arno.bzh
```

The implementation should be minimal, static, deterministic, and easy to inspect.

## 2. Context

The user has a PNG mockup of the Naolib mobile ticket screen. The current PNG already contains hardcoded date/time values. The goal is not to rebuild the full Naolib application, but to use this PNG as a visual background and overlay only the dynamic date/time values in the exact positions of the original text.

The preview must work on mobile Chrome on iPhone. The ideal display mode is a Home Screen / standalone web app view to reduce browser chrome and approximate a native app-like full-screen display.

## 3. Safety constraints

This app must be clearly marked as non-valid and must not be usable as a production-looking transport ticket.

Mandatory constraints:

1. Add a visible non-removable watermark or badge, for example:
   - `SPECIMEN — NON VALABLE`
   - `NON VALABLE COMME TITRE DE TRANSPORT`
2. The watermark must remain visible on the rendered screen.
3. Do not generate a valid QR code.
4. Do not call any Naolib production validation API.
5. Do not claim that the rendered screen is a valid ticket.
6. Do not include authentication tokens, API keys, private URLs, or production secrets.
7. Do not attempt to bypass transport validation systems.

## 4. Goals

### G1 — Dynamic ticket dates

Render the start and end validity dates dynamically based on the current time.

### G2 — Pixel-aligned visual overlay

Overlay the dynamic dates on top of the PNG mockup so they visually replace the existing hardcoded dates.

### G3 — Mobile-first full-screen preview

Render correctly on an iPhone 16 portrait viewport and allow the app to be launched in a near full-screen / standalone mobile web mode.

### G4 — Static deployment

The app must be deployable as static assets through GitHub Pages using GitHub Actions.

### G5 — Deterministic presentation/testing mode

Support a query parameter that freezes the current time for deterministic presentations and tests.

## 5. Non-goals

The app must not:

1. Rebuild Naolib’s real ticketing system.
2. Authenticate a real user.
3. Validate or purchase tickets.
4. Generate real tickets.
5. Generate, modify, or validate real QR codes.
6. Connect to Naolib APIs.
7. Store user data.
8. Require a backend.
9. Require a database.
10. Depend on external CDNs at runtime.

## 6. Target users

### Primary user

A presentation operator showing a static frontend proof of concept to Naolib stakeholders on an iPhone 16.

### Secondary users

Developers reviewing or modifying the prototype.

## 7. Assumptions

1. The provided PNG mockup is available in the repository as:

   ```txt
   public/ticket-template.png
   ```

2. The mockup dimensions are:

   ```txt
   941 × 2048 px
   ```

3. The app targets portrait mobile display first.
4. The app will be hosted from a GitHub repository connected to GitHub Pages.
5. The custom domain will be configured outside the repository via GitHub Pages settings and DNS.
6. The browser/device timezone may differ from Nantes, so formatting must explicitly use `Europe/Paris`.
7. The app must display visible non-valid markings.

## 8. User stories

### US1 — Dynamic validity display

As a presentation operator, I want the ticket screen to show validity dates relative to the current time, so that the preview always looks temporally relevant.

Acceptance criteria:

- Given the current time is `2026-06-23T19:32:00+02:00`, the app renders:
  - `Début de validité`: `23 juin 2026, 18:42`
  - `Fin de validité`: `23 juin 2026, 19:42`
- Date format is French.
- Month names are lowercase French month names.
- Time uses 24-hour `HH:mm` format.
- Timezone is `Europe/Paris`.
- The rendered values update on page load.
- The rendered values refresh at least once per minute while the page is open.

### US2 — Deterministic presentation mode

As a presentation operator, I want to freeze the computed time using a URL parameter, so that I can reproduce a known state during a presentation.

Acceptance criteria:

- The app supports:

  ```txt
  ?now=2026-06-23T19:32:00+02:00
  ```

- When `now` is provided and valid, the app uses it as the reference time.
- When `now` is missing, the app uses the real current time.
- When `now` is invalid, the app falls back to the real current time and logs a warning in development mode only.

### US3 — Full-screen visual layout

As a presentation operator, I want the screen to visually fill my iPhone display, so that it looks like a native app screen during the presentation.

Acceptance criteria:

- The PNG mockup fills the viewport in portrait orientation.
- The aspect ratio is preserved.
- Overflow is hidden.
- No scrollbars are visible.
- Dynamic dates stay aligned with the background image after viewport resize or orientation change.
- The layout supports both `cover` and `contain` fit modes, defaulting to `cover`.
- Optional query parameter:

  ```txt
  ?fit=contain
  ```

  switches to contain mode for debugging.

### US4 — Non-valid safety marking

As a stakeholder, I want the rendered screen to be visibly marked as non-valid, so that it cannot be confused with a valid transport ticket.

Acceptance criteria:

- A visible non-valid watermark or badge is always rendered.
- The watermark is above the PNG and date overlays.
- The watermark cannot be disabled via query parameter.
- The watermark does not fully obscure the dynamic date fields.
- The watermark is visible in screenshots.

### US5 — GitHub Pages deployment

As a developer, I want the app to deploy automatically to GitHub Pages, so that pushing to `main` publishes the latest version.

Acceptance criteria:

- Repository contains a GitHub Actions workflow at:

  ```txt
  .github/workflows/deploy-pages.yml
  ```

- Workflow runs on push to `main`.
- Workflow can also be triggered manually with `workflow_dispatch`.
- Workflow installs dependencies with `npm ci`.
- Workflow runs quality checks.
- Workflow builds the static app.
- Workflow deploys the build output to GitHub Pages.
- GitHub Pages source is expected to be configured as `GitHub Actions`.
- The app supports the custom domain `naolib.arno.bzh`.

## 9. Functional requirements

### FR1 — Static frontend app

The app must be a client-side static frontend application.

Preferred stack:

```txt
Vite + TypeScript + vanilla DOM/CSS
```

No React/Vue/Svelte is required unless Codex has a strong implementation reason. The simplest maintainable implementation wins.

### FR2 — Asset loading

The app must load the mockup from:

```txt
/ticket-template.png
```

If the image fails to load, the app must display a clear error state in development mode.

### FR3 — Design canvas

The app must use a fixed internal design canvas matching the PNG dimensions:

```txt
width: 941px
height: 2048px
```

The canvas is then scaled to the viewport using CSS transforms.

### FR4 — Date computation

The app must compute:

```txt
start = now - 50 minutes
end = now + 10 minutes
```

The values must be recomputed:

1. On initial page load.
2. At least once per minute.
3. When returning to the page after visibility changes, if practical.

### FR5 — Date formatting

Dates must be formatted as:

```txt
D month YYYY, HH:mm
```

Examples:

```txt
23 juin 2026, 18:42
1 juillet 2026, 09:05
31 décembre 2026, 23:55
```

Formatting requirements:

- Locale: `fr-FR`
- Timezone: `Europe/Paris`
- No leading zero for the day.
- Full month name.
- Numeric year.
- 24-hour time.
- Two-digit hour.
- Two-digit minute.

### FR6 — Overlay masking

Because the PNG already contains hardcoded dates, the app must hide the original date text before rendering new dynamic values.

Preferred method:

1. Add a white rectangular mask over each original date value.
2. Render the dynamic text above the mask.

The mask must only cover the old date text, not the labels `Début de validité` and `Fin de validité`.

### FR7 — Overlay positions

Initial overlay coordinates for the 941 × 2048 design canvas:

```txt
Start date mask:
  left: 100px
  top: 930px
  width: 430px
  height: 58px

Start date text:
  left: 113px
  top: 939px

End date mask:
  left: 100px
  top: 1070px
  width: 430px
  height: 58px

End date text:
  left: 113px
  top: 1079px
```

These coordinates are initial values and should be easy to adjust in one constants/config section.

### FR8 — Text styling

Use a system font stack that approximates the iOS native look without bundling Apple font files:

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
```

Initial date style:

```txt
font-size: 38px
font-weight: 400
line-height: 1.1
letter-spacing: -0.4px
color: #111318
```

These values must be easy to adjust from one CSS section.

### FR9 — Full-screen mobile layout

The app must:

- Use `viewport-fit=cover`.
- Use `100dvh` where supported.
- Hide overflow.
- Render a fixed root viewport.
- Scale the 941 × 2048 stage using a `cover` algorithm by default.
- Center the scaled stage.
- Avoid scroll, pinch-layout bugs, or accidental white bars.

### FR10 — PWA metadata

The app must include:

- `manifest.webmanifest`
- Mobile viewport meta tags
- Apple mobile web app meta tags
- App title
- Theme color matching Naolib green
- Basic icons if available, or documented placeholders

Suggested app name:

```txt
Naolib mTicket
```

### FR11 — Debug/calibration mode

The app should support a debug mode:

```txt
?debug=1
```

Debug mode should optionally show:

- Canvas dimensions
- Current viewport size
- Scale factor
- Current computed start/end values
- Overlay bounding boxes

Debug mode must not remove the non-valid safety mark.

### FR12 — CNAME file

Include a file at:

```txt
public/CNAME
```

with exactly:

```txt
naolib.arno.bzh
```

This is useful for branch-based Pages deployments and repository portability, even though custom GitHub Actions deployments also require Pages settings to be configured separately.

## 10. Non-functional requirements

### NFR1 — Performance

- First render should be effectively instant on modern mobile devices.
- Bundle should remain small.
- No heavy runtime framework unless necessary.
- Avoid canvas rendering unless required.

### NFR2 — Offline tolerance

- The page should render after the static assets are loaded.
- No backend dependency.
- No runtime dependency on external CDNs.
- A service worker is optional but not required for MVP.

### NFR3 — Maintainability

- Date computation must be isolated in a small utility module.
- Overlay constants must be centralized.
- Deployment workflow must be readable and minimal.
- README must document local dev, build, deployment, and custom domain setup.

### NFR4 — Compatibility

Target:

- iPhone 16 portrait viewport
- iOS Chrome latest
- iOS Safari latest
- Desktop Chrome for local debugging

### NFR5 — Security/privacy

- No cookies.
- No local storage unless needed for fit/debug settings.
- No analytics.
- No external requests beyond loading the static assets.
- No secrets.

## 11. UX requirements

### UX1 — Default view

The default route `/` renders the ticket preview immediately.

### UX2 — Visual hierarchy

The dynamic dates must look visually consistent with the baked-in screenshot text.

### UX3 — Watermark

The watermark must be visible but should not block the two dynamic date values.

Suggested placement:

- Top-right corner inside the white ticket card, or
- Diagonal translucent overlay across the ticket card, or
- Bottom center above the tab bar

Suggested styling:

```txt
background: rgba(255, 255, 255, 0.82)
text color: #111318
border: 1px solid rgba(0, 0, 0, 0.2)
font-weight: 700
```

### UX4 — Error state

If the template image is missing, display:

```txt
Missing asset: /ticket-template.png
```

This error state is only for developers and must not expose stack traces.

## 12. Edge cases

The app must handle:

1. Time crossing midnight.
2. Time crossing month boundaries.
3. Time crossing year boundaries.
4. Daylight saving time changes in `Europe/Paris`.
5. Long French month names, especially `septembre` and `novembre`.
6. iPhone viewport changes caused by browser UI showing/hiding.
7. Orientation change.
8. Invalid `now` query parameter.
9. Image asset not found.

## 13. Test cases

### TC1 — Given mockup reference time

Input:

```txt
?now=2026-06-23T19:32:00+02:00
```

Expected:

```txt
Début de validité: 23 juin 2026, 18:42
Fin de validité: 23 juin 2026, 19:42
```

### TC2 — Midnight crossing

Input:

```txt
?now=2026-06-24T00:05:00+02:00
```

Expected:

```txt
Début de validité: 23 juin 2026, 23:15
Fin de validité: 24 juin 2026, 00:15
```

### TC3 — Year crossing

Input:

```txt
?now=2026-01-01T00:20:00+01:00
```

Expected:

```txt
Début de validité: 31 décembre 2025, 23:30
Fin de validité: 1 janvier 2026, 00:30
```

### TC4 — Invalid date parameter

Input:

```txt
?now=invalid
```

Expected:

- App does not crash.
- App falls back to real current time.
- Development console warning is acceptable.

### TC5 — Debug mode

Input:

```txt
?debug=1
```

Expected:

- App renders normally.
- Debug overlay appears.
- Non-valid safety mark remains visible.

## 14. Repository structure

Codex should generate the repository with this structure:

```txt
.
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── public/
│   ├── CNAME
│   ├── manifest.webmanifest
│   ├── ticket-template.png
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── src/
│   ├── main.ts
│   ├── styles.css
│   ├── date.ts
│   ├── layout.ts
│   └── config.ts
├── tests/
│   └── date.test.ts
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

Notes:

- If icons are not provided, Codex may create simple placeholder PNG icons or document that they need to be supplied.
- The real PNG mockup must be committed as `public/ticket-template.png`.
- Do not fetch the mockup from an external URL.

## 15. Package scripts

`package.json` must expose:

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

Linting is optional for this small app, but if ESLint is added, the GitHub Action must run it.

## 16. GitHub Actions requirements

Create:

```txt
.github/workflows/deploy-pages.yml
```

Workflow requirements:

- Name: `Deploy GitHub Pages`
- Trigger on:
  - push to `main`
  - `workflow_dispatch`
- Use Node.js LTS.
- Run:
  - `npm ci`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Upload `dist` as GitHub Pages artifact.
- Deploy with GitHub Pages deployment action.
- Use least required permissions:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

- Use concurrency:

```yaml
concurrency:
  group: pages
  cancel-in-progress: false
```

Expected workflow shape:

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 17. GitHub Pages / domain setup documentation

README must document that files alone are not sufficient for custom domain activation.

Required setup steps:

1. In GitHub repository settings, go to:

   ```txt
   Settings → Pages
   ```

2. Set build/deployment source to:

   ```txt
   GitHub Actions
   ```

3. Configure custom domain:

   ```txt
   naolib.arno.bzh
   ```

4. At the DNS provider for `arno.bzh`, configure DNS for `naolib.arno.bzh`.

   GitHub's Pages documentation distinguishes apex domains from subdomains:

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

5. Enable HTTPS once GitHub Pages certificate provisioning is ready.

The repository should still include `public/CNAME` with `naolib.arno.bzh`, but README must state that GitHub Actions-based Pages deployments require the GitHub Pages custom domain setting to be configured.

## 18. Definition of done

The implementation is done when:

1. `npm ci` works from a clean checkout.
2. `npm run build` succeeds.
3. `npm test` succeeds.
4. `npm run preview` serves the built app locally.
5. `/` displays the ticket mockup.
6. The original date values are hidden.
7. Dynamic dates are rendered in the expected locations.
8. `?now=2026-06-23T19:32:00+02:00` renders the expected sample values.
9. The app fills an iPhone 16 portrait viewport without visible scrollbars.
10. The app includes a visible non-valid safety mark.
11. The GitHub Action deploys to GitHub Pages from `main`.
12. The built artifact contains `CNAME` at the build root if copied from `public/CNAME`.
13. README explains local usage, deterministic URLs, deployment, and custom domain setup.

# Technical add-on — Suggested implementation technique

## A. Rendering model

Use a layered DOM approach:

```html
<div id="viewport">
  <div id="stage">
    <img id="ticket-template" src="/ticket-template.png" alt="Naolib non-valid ticket mockup" />

    <div class="date-mask date-mask--start"></div>
    <div class="date-mask date-mask--end"></div>

    <div id="start-date" class="date-overlay date-overlay--start"></div>
    <div id="end-date" class="date-overlay date-overlay--end"></div>

    <div class="safety-mark">SPECIMEN — NON VALABLE</div>
  </div>
</div>
```

The PNG is the bottom layer. White masks cover the hardcoded dates. Dynamic text is rendered above the masks. The watermark is rendered above all layers.

## B. Coordinate system

Use the mockup’s native dimensions as the design coordinate system:

```ts
export const DESIGN = {
  width: 941,
  height: 2048,
} as const;
```

All overlay coordinates are expressed in these native pixels.

Recommended config:

```ts
export const OVERLAYS = {
  startDate: {
    mask: { left: 100, top: 930, width: 430, height: 58 },
    text: { left: 113, top: 939 },
  },
  endDate: {
    mask: { left: 100, top: 1070, width: 430, height: 58 },
    text: { left: 113, top: 1079 },
  },
} as const;
```

## C. Scaling algorithm

Compute a single scale factor for the whole stage.

Default `cover` mode:

```ts
scale = Math.max(viewportWidth / DESIGN.width, viewportHeight / DESIGN.height)
```

Optional `contain` mode:

```ts
scale = Math.min(viewportWidth / DESIGN.width, viewportHeight / DESIGN.height)
```

Then center the scaled stage:

```ts
x = (viewportWidth - DESIGN.width * scale) / 2
y = (viewportHeight - DESIGN.height * scale) / 2
```

Apply:

```css
#stage {
  position: relative;
  width: 941px;
  height: 2048px;
  transform-origin: top left;
}
```

```ts
stage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
```

Use `ResizeObserver` or `window.resize` to recompute.

## D. Date utilities

Implement pure functions:

```ts
export function computeValidityWindow(now: Date): {
  start: Date;
  end: Date;
}
```

```ts
export function formatNaolibDate(date: Date): string
```

Expected behavior:

```ts
computeValidityWindow(new Date("2026-06-23T19:32:00+02:00"))
// start: 2026-06-23T18:42:00+02:00
// end:   2026-06-23T19:42:00+02:00
```

Formatting should use `Intl.DateTimeFormat` with:

```ts
{
  timeZone: "Europe/Paris",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}
```

Because `Intl.DateTimeFormat` may insert locale-specific separators, normalize the output if needed so the final format is exactly:

```txt
23 juin 2026, 18:42
```

## E. CSS essentials

```css
html,
body,
#app,
#viewport {
  margin: 0;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  overflow: hidden;
  background: #ffffff;
}

#viewport {
  position: fixed;
  inset: 0;
  touch-action: none;
  user-select: none;
}

#stage {
  position: relative;
  width: 941px;
  height: 2048px;
  transform-origin: top left;
}

#ticket-template {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.date-mask,
.date-overlay,
.safety-mark {
  position: absolute;
  z-index: 2;
}

.date-mask {
  background: #ffffff;
}

.date-overlay {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  font-size: 38px;
  line-height: 1.1;
  font-weight: 400;
  letter-spacing: -0.4px;
  color: #111318;
  white-space: nowrap;
}

.safety-mark {
  z-index: 3;
  right: 70px;
  top: 820px;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.82);
  color: #111318;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.2px;
}
```

## F. HTML metadata

`index.html` should include:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#64d900" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Naolib mTicket" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="manifest" href="/manifest.webmanifest" />
```

## G. Codex implementation instruction

Implement this PRD exactly. Favor the smallest robust solution. Use Vite + TypeScript + vanilla DOM/CSS. Create all repository files required to run locally, test date logic, build static assets, and deploy to GitHub Pages with the custom domain `naolib.arno.bzh`. Do not remove the visible non-valid safety mark. Do not generate a real ticket or a valid QR code.
