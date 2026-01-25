# Performance Optimization Guide

## Current Optimizations ✅

### 1. Optimized Data File (85% size reduction)
- **Before**: 50MB GeoJSON with complex geometries
- **After**: 7MB JSON with only essential data
- Removed unnecessary polygon geometry data
- Kept only: lat, lng, losses, fatalities, buildings

### 2. Reduced Hexagon Resolution
- Changed `hexBinResolution` from 3 to 2
- Fewer, larger hexagons = better performance
- Still maintains good visual quality

### 3. Added Loading States
- Shows loading screen while data loads
- Better user experience

## Additional Optimizations (If Still Slow)

### Option A: Sample the Data (Recommended)

Edit `app/page.tsx` and uncomment this line:

```typescript
const sampled = data.filter((_, index) => index % 3 === 0);
setHexagonData(sampled); // Use sampled instead of data
```

This keeps every 3rd point, reducing data by 66%.

**Trade-off**: Slightly less detail, but MUCH faster loading and rendering.

### Option B: Create a Sampled File

Run the optimization script with sampling enabled:

1. Edit `scripts/optimize-data.js`
2. Uncomment these lines:
   ```javascript
   const SAMPLE_RATE = 5; // Keep every 5th point
   const sampled = optimized.filter((_, index) => index % SAMPLE_RATE === 0);
   ```
3. Change the output to use `sampled` instead of `optimized`
4. Run: `node scripts/optimize-data.js`

### Option C: Reduce Hexagon Resolution Further

In `components/Globe3D.tsx`, change:
```typescript
hexBinResolution={2}  // Lower = fewer hexagons
```

Try values: 1 (fastest) to 3 (most detailed)

### Option D: Disable Auto-Rotation (Minor)

In `components/Globe3D.tsx`, comment out:
```typescript
// globeEl.current.controls().autoRotate = true;
// globeEl.current.controls().autoRotateSpeed = 0.5;
```

### Option E: Progressive Loading

For advanced users - load data in chunks:

```typescript
// Load first 10,000 points, then load more
fetch('/data/seismic-risk-optimized.json')
  .then(res => res.json())
  .then((data: HexagonData[]) => {
    // Initial render with subset
    setHexagonData(data.slice(0, 10000));

    // Load rest after a delay
    setTimeout(() => setHexagonData(data), 1000);
  });
```

## Performance Benchmarks

| Optimization | File Size | Load Time* | Rendering |
|--------------|-----------|------------|-----------|
| Original     | 50 MB     | ~8-10s     | Slow      |
| Optimized    | 7 MB      | ~2-3s      | Medium    |
| + Sampling 3 | 2.3 MB    | ~1s        | Fast      |
| + Sampling 5 | 1.4 MB    | ~0.5s      | Very Fast |

*Approximate times on average connection

## Recommended Settings

**For Best Balance (Current)**:
- Optimized data file (7MB)
- hexBinResolution: 2
- No sampling

**For Maximum Performance**:
- Optimized + sampled data (every 3rd point)
- hexBinResolution: 1
- Disable auto-rotation

**For Maximum Quality**:
- Full optimized data
- hexBinResolution: 3
- Accept slower loading

## Troubleshooting

**Still slow on initial load?**
- Check your internet connection speed
- Try sampling the data (Option A)
- Consider hosting on a CDN

**Slow when rotating/zooming?**
- Reduce hexBinResolution
- Sample the data more aggressively

**Hexagons not appearing?**
- Check browser console for errors
- Verify data file exists in public/data/
- Check that data has valid lat/lng values

## Future Optimizations

- **Server-side rendering**: Pre-render hexagon aggregations
- **CDN hosting**: Serve data files from CDN
- **Compression**: Enable gzip/brotli compression
- **Web Workers**: Process data in background thread
- **IndexedDB**: Cache data locally after first load
