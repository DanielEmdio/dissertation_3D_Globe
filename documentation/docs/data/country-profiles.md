---
sidebar_position: 3
---

# Country Profile Images

Each country may have an associated **profile image** — a PNG that provides a richer breakdown of its seismic risk indicators. These images are stored in `/public/country-profiles/` and loaded on demand when the user clicks a country.

<!-- TODO: add an example of a country profile image (e.g. Portugal or Turkey) -->

## Image contents

Profile images are generated outside the web app (e.g. using a Python/R script against the GEM dataset). A typical profile includes:

- Bar or pie charts of building stock by construction type.
- AAL breakdown by metric.
- Return-period loss curves.
- Key statistics summary table.

The exact layout depends on the generation script used.

## File naming convention

Images follow the pattern:

```
country_profile_<NormalizedName>.png
```

Where `<NormalizedName>` is the country name with **spaces replaced by underscores**, plus a set of special-case overrides. Examples:

| GeoJSON name | Normalised filename |
|--------------|---------------------|
| `Portugal` | `country_profile_Portugal.png` |
| `United States of America` | `country_profile_United_States.png` |
| `Côte d'Ivoire` | `country_profile_Ivory_Coast.png` |
| `Czechia` | `country_profile_Czechia.png` |

The full mapping logic is handled by `utils/countryMapping.ts`. See [Adding a Country Profile](../reference/adding-a-country-profile) to add or update entries.

## Missing profiles

If no image is found at the expected path, the profile panel shows an error state (alert icon + "No profile found for \<country\>"). This is expected for countries that have not yet had a profile generated.

## Coverage

Not all countries in the GeoJSON dataset have a corresponding profile image. Countries without profiles can still be selected on the globe (the radar chart will still populate if they have CSV data), but the profile panel will show the missing-data state.
