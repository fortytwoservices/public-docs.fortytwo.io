---
description: How an app gets your brand. Colours and layout are set once for every new app in the control panel; the app's name, logo and its own changes live in branding.config.ts.
icon: palette
---

# Branding an app

Your brand is set once, for the whole platform, and every new app starts from it. After that, an app's look is part of its own code, so its team can adjust it without affecting any other app.

## Set once for every app

An administrator sets the brand under **Settings** > **Branding**, which opens the **Your brand** section of the Designsystem: name, logo, browser icon, colours for light and dark, and the layout every app is built with. Each change shows straight away on the components below it.

If a colour would make text, focus rings or markers hard to read, the page lists which pairs fail, refuses to save, and offers the nearest shade that passes WCAG 2.2 AA.

When an app is created, the platform writes the brand's colours and layout into that app's code. The app's name comes from the app itself.

:::note[Existing apps keep their look]
Changing the brand later reaches the apps created after the change. An app created earlier keeps the colours written into it, until its team changes them in its own code.
:::

## In the app's code

`branding.config.ts`, at the root of the app's repository, holds the app's name, colours, logo and layout:

```ts
export const branding: Branding = {
  displayName: 'Nordlys Expenses',
  primaryHsl: '214 84% 45%',
  accentHsl: '38 92% 55%',
  logoPath: '/branding/logo.svg',
};
```

| Field | What it sets |
|-|-|
| `displayName` | The browser title and the name in the header. |
| `primaryHsl` | The main colour. |
| `accentHsl` | Optional. A second colour. |
| `logoPath` | Optional. Your own logo instead of the built-in mark. |
| `shell` | Optional. The navigation layout (`top`, `sidebar` or `panel`), the density and the navigation colour. |

Changing a value here changes this app alone. A colour you want in every new app belongs in the control panel instead.

Write colours as three HSL values, `214 84% 45%`, not as `hsl(...)`. The text colour on top of each one is worked out for you, so labels stay readable on a light or a dark choice.

For a logo, put the file in `client/public/branding/` and point `logoPath` at it, for example `/branding/logo.svg`. Make sure the file is there: a missing logo shows as a broken image, not as the built-in mark.

Keep to changing the values. The shape of `branding.config.ts` belongs to the platform.

## Language

Fortytwo's code, and the code an app is built on, is in English. Text people see in your app can be in any language: write it directly in your own module code, and set `<html lang>` in `client/index.html` to match. Keep identifiers and code in English.

There is no language setting to switch. The platform does not translate an app.

## Components

Build every screen from the designsystem, `@/shared`, so a brand change reaches every part of the app at once. The lint enforces it; see [Checks on every change](checks.md#the-designsystem-first).
