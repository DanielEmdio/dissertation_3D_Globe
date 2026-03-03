---
sidebar_position: 3
---

# Country Profile Panel

Clicking any country on the globe opens a **draggable profile panel** anchored by default to the **bottom-right corner** of the screen.

<!-- TODO: add a screenshot showing the panel open with a country profile image -->

## Contents

Each country's profile is a pre-generated **PNG image** stored in `/public/country-profiles/`. The image typically contains charts and statistics summarising the country's seismic exposure and risk indicators (produced outside the app, e.g. via Python/R scripts).

If no image exists for a clicked country, the panel displays an error state: an alert icon and the message *"No profile found for \<country name\>"*.

## Panel behaviour

### Dragging

The panel is wrapped in `DraggableCardContainer` / `DraggableCardBody` (custom `ui/` component). Click and drag the panel header to reposition it anywhere on screen.

### Snap to default position

A **magnet button** (pulsing icon, bottom-right of the screen) resets the card to its default anchored position if you have moved it far away.

### Resizing

The panel can be resized by dragging its **lower-left corner**:

- Dragging **left** increases the width.
- Dragging **down** increases the height.

Limits: **300 – 800 px** wide, **300 px – (viewport height − 64 px)** tall.

### Loading state

While the profile image is loading a spinner (`<LoaderOne />`) is shown inside the panel. The image is hidden until it finishes loading to avoid a flash of broken layout.

### Closing

Click the **×** button in the panel header to close the profile. This sets `selectedCountry` to `null` in the Dashboard state; the panel unmounts but the radar chart retains the last two selected countries.

## Country name mapping

The panel derives the image path from the country name provided by the GeoJSON polygon. A utility function normalises the name to match the filename convention. See [Country Profile Mapping](../reference/adding-a-country-profile) for the full mapping rules.
