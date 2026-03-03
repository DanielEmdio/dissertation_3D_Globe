---
sidebar_position: 2
---

# Metric Tabs

The tab bar in the **top-left corner** controls which seismic risk layer is projected onto the globe. Switching tabs swaps the globe texture and updates the colour-scale legend below.

<!-- TODO: add a screenshot of the MetricTabs card with the legend visible -->

## Available metrics

### Losses

**Annual Average Loss (AAL) — monetary**

Represents the long-term expected replacement and repair cost due to seismic events, expressed in USD per year. The colour scale runs from near-white (very low loss) to deep orange-red (extreme loss).

| Colour | Approximate loss range |
|--------|----------------------|
| Near white | ~ $1 K |
| Teal/green | ~ $10 K |
| Yellow | ~ $50 K – $100 K |
| Orange | ~ $500 K – $2 M |
| Deep red | $10 M+ |

### Fatalities

**Seismic risk to life — expected annual deaths**

Encodes the probability of fatalities per seismic event, from cool blues (very low) through purples and reds to near-black (extreme).

| Colour | Level |
|--------|-------|
| Light grey / blue | Very low |
| Blue-purple | Low – Moderate |
| Red | High |
| Dark red / near-black | Very high – Extreme |

### Buildings

**Structural exposure — approximate building count**

Shows the density of buildings in a given area, highlighting regions with high structural exposure to seismic shaking. The scale runs from white (sparse) to orange-red (dense).

## Toggle behaviour

Clicking the **active** tab a second time hides the description card and legend without switching the metric, effectively giving the user more screen real estate. Clicking it again brings the card back. Switching to a different tab always makes the card visible.

## Colour-scale legend

Each metric card displays a gradient bar representing its full colour range, with low/high endpoint labels. The **Losses** and **Fatalities** metrics also show named category labels with colour swatches beneath the gradient bar for precise reading.
