---
sidebar_position: 1
---

# Data Sources

The application combines two data files loaded at runtime and three pre-rendered texture images baked into the public folder.

## Runtime data files

Both files are served from `/public/data/` and fetched by the browser on page load.

### `Global_Risk_Summary_Adm0.csv`

**Source:** [Global Earthquake Model (GEM) Foundation](https://www.globalquakemodel.org/)

A country-level summary of seismic exposure and risk metrics. Each row represents one country (administrative level 0). The relevant columns used by the app are listed in [Metrics Reference](./metrics-reference).

The CSV is loaded once by `lib/riskData.ts` and cached in memory for the lifetime of the browser session. Subsequent calls to `getRawData()` return the cached `Map<string, RawCountryData>` without re-fetching.

### `countries_bounderies.geojson`

A GeoJSON `FeatureCollection` of country polygons. Each feature's `properties.NAME` field is the country name as used throughout the app (and as the key in the risk CSV).

This file is used exclusively for click-detection on the globe — the polygons are rendered as transparent, invisible layers on top of the globe surface. It is **not** used for drawing borders (those come from the globe texture images).

## Texture images

Three pre-rendered PNG images in `/public/textures/` are used as the globe surface for each metric:

| File | Generated from |
|------|----------------|
| `seismic-risk-map-losses.png` | GEM losses data, rendered externally |
| `seismic-risk-map-fatalities.png` | GEM fatalities data, rendered externally |
| `seismic-risk-map-buildings.png` | GEM buildings data, rendered externally |

These images are produced outside the web application (e.g. via a GIS tool or Python script) and placed in the public folder. They are not generated at runtime.

If any texture is absent, the globe falls back to the standard blue-marble Earth image and the corresponding metric still functions — only the spatial colour encoding is lost.

## Country profile images

Static PNG images in `/public/country-profiles/` provide per-country detail views. File naming follows the convention `country_profile_<NormalizedName>.png`. See [Country Profile Mapping](../reference/adding-a-country-profile) for how names are normalised.
