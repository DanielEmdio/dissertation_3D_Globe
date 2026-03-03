---
sidebar_position: 4
---

# Radar Chart

The radar chart appears in the **bottom-left corner** once at least one country has been clicked. It enables a quick multi-metric comparison between the **last two selected countries**.

<!-- TODO: add a screenshot of the radar chart comparing two countries -->

## Compared metrics

The chart plots seven risk metrics across its axes:

| Axis label | CSV column | Description |
|------------|-----------|-------------|
| Total number of buildings | `EXP_BUILDINGS` | Structural exposure count |
| Total replacement cost | `EXP_COST_TOTAL` | USD value of all buildings |
| Population | `EXP_OCCUPANTS_TOTAL` | People exposed |
| AAL Economic | `AAL_TOTAL` | Annual Average Loss — monetary |
| AAL Fatalities | `AAL_FATALITIES` | Annual Average Loss — deaths |
| AAL Buildings | `AAL_BUILDINGS` | Annual Average Loss — building damage |
| AAL Displaced | `AAL_PEOPLE_DISPLACED` | Annual Average Loss — displaced people |

## Normalisation

Values on each axis are **normalised relative to the two countries being compared**: whichever country has the higher value for a metric is plotted at 100; the other is plotted proportionally. This makes it easy to see *where* one country outweighs the other, even when the underlying numbers span several orders of magnitude.

Raw values are shown in the **tooltip** on hover, formatted automatically (K / M / B / T suffixes).

## Colours

Each time a country that was already set in the chart is *replaced* by a new selection, the colour palette advances. The colour cycle has six distinct colours, so repeated comparisons remain visually distinct.

## Missing data

If a country has no entry in `Global_Risk_Summary_Adm0.csv`, its radar series is omitted and its label is suffixed with `(no data)`.

## Minimise

The chart can be collapsed to a small **pulsing icon button** by clicking the eye icon in the chart title bar. Clicking the button expands it again. This frees up screen space without losing the current comparison.

## Country selection logic

The dashboard keeps a two-slot buffer `[country1, country2]`. Every time a country is clicked:

1. If the country is already in the buffer, no change occurs.
2. Otherwise it replaces the *oldest* slot (slot 0), shifting the previous slot-0 country out.

This means the chart always reflects the **two most recently clicked distinct countries**.
