---
sidebar_position: 1
---

# Adding a Country Profile

This guide explains how to add or update the seismic risk profile image for a country.

## Step 1 — Generate the profile image

Profile images are created outside the web app (e.g. with a Python/R script against the GEM dataset). The output must be a **PNG file**. There is no enforced size, but images around **1200 × 900 px** render well at the default panel size (700 × 600 px).

## Step 2 — Name the file correctly

File names follow this pattern:

```
country_profile_<NormalizedName>.png
```

### Normalisation rules

1. Replace all **spaces** with **underscores**.
2. Apply any **special-case override** from the table below.

| GeoJSON country name | Normalised name |
|----------------------|-----------------|
| United States of America | `United_States` |
| USA | `United_States` |
| UK | `United_Kingdom` |
| UAE | `United_Arab_Emirates` |
| Democratic Republic of Congo | `Democratic_Republic_of_the_Congo` |
| Republic of the Congo | `Congo` |
| Côte d'Ivoire | `Ivory_Coast` |
| Czech Republic | `Czechia` |

For any country not listed above, simply replace spaces with underscores. For example:
- `New Zealand` → `New_Zealand`
- `Saudi Arabia` → `Saudi_Arabia`

## Step 3 — Place the file

Drop the PNG into:

```
globe-app/public/country-profiles/
```

The file will be served automatically by Next.js at `/country-profiles/country_profile_<NormalizedName>.png`.

## Step 4 — Verify in the app

Run the dev server and click the country on the globe. The profile panel should load the image. If it still shows the "No profile found" error, check that:

- The file name exactly matches the normalised country name (including capitalisation).
- The file is a valid PNG.
- The development server was restarted (or the browser cache was cleared) after placing the file.

## Adding a new special-case mapping

If a country's GeoJSON name does not normalise correctly with the generic rule, add an entry to the `specialCases` object in `utils/countryMapping.ts`:

```ts
// utils/countryMapping.ts
const specialCases: Record<string, string> = {
  // existing entries …
  'New_Unusual_Name': 'Correct_File_Stem',
};
```

The key is the name **after** spaces have been replaced by underscores. The value is the desired file stem (without the `country_profile_` prefix and `.png` suffix).
