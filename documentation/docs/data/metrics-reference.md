---
sidebar_position: 2
---

# Metrics Reference

All metrics are sourced from the [GEM Global Seismic Risk Model](https://www.globalquakemodel.org/gem) and are aggregated at the **country level (Adm0)**.

## Exposure metrics

These describe the physical and economic assets present in each country, independent of hazard.

| CSV column | UI label | Unit | Description |
|------------|----------|------|-------------|
| `EXP_BUILDINGS` | Total number of buildings | count | Approximate total number of buildings in the country |
| `EXP_COST_TOTAL` | Total replacement cost | USD | Total monetary value of the building stock (replacement cost) |
| `EXP_OCCUPANTS_TOTAL` | Population | people | Total number of occupants / population exposed |

## Annual Average Loss (AAL) metrics

AAL is the expected loss per year averaged over a long time period (typically thousands of years of simulated seismic activity). It represents the long-run average impact across all possible earthquake scenarios weighted by their probability of occurrence.

| CSV column | UI label | Unit | Description |
|------------|----------|------|-------------|
| `AAL_TOTAL` | AAL Economic | USD / year | Average annual monetary loss from structural damage |
| `AAL_FATALITIES` | AAL Fatalities | deaths / year | Average annual number of fatalities |
| `AAL_BUILDINGS` | AAL Buildings | buildings / year | Average annual number of buildings experiencing damage |
| `AAL_PEOPLE_DISPLACED` | AAL Displaced | people / year | Average annual number of people displaced from their homes |

## Globe texture metrics

The three globe textures visualise aggregated spatial distributions:

| Tab | Underlying data | Colour encoding |
|-----|-----------------|-----------------|
| **Losses** | AAL monetary | White → teal → yellow → orange → deep red |
| **Fatalities** | AAL fatality rate | Grey/blue → purple → red → near-black |
| **Buildings** | Building exposure density | White → blue → yellow-green → orange-red |

The textures are pre-rendered at a fixed resolution and do not change dynamically — they represent a snapshot of the GEM dataset at the time the app was built.

## Null values

Some countries have `null` for one or more metrics in the CSV (insufficient data coverage). In the radar chart, a null value means that country's series is omitted for that axis. The tooltip shows `N/A` for any null metric.
