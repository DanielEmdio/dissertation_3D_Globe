/**
 * Color mapping based on QGIS QML file for seismic risk losses
 * Extracted from Global_Seismic_Risk_GEM.qml
 */

export interface RiskLevel {
  min: number;
  max: number;
  color: string;
  label: string;
}

// Color scale from QML file - graduated by "losses" field
export const riskColorScale: RiskLevel[] = [
  { min: 1000, max: 5000, color: 'rgb(240,248,255)', label: '1k - 5k' },
  { min: 5000, max: 10000, color: 'rgb(250,252,243)', label: '5k - 10k' },
  { min: 10000, max: 25000, color: 'rgb(139,210,206)', label: '10k - 25k' },
  { min: 25000, max: 50000, color: 'rgb(213,230,53)', label: '25k - 50k' },
  { min: 50000, max: 100000, color: 'rgb(244,237,30)', label: '50k - 100k' },
  { min: 100000, max: 500000, color: 'rgb(246,219,30)', label: '100k - 500k' },
  { min: 500000, max: 1000000, color: 'rgb(249,201,29)', label: '500k - 1M' },
  { min: 1000000, max: 2000000, color: 'rgb(249,168,14)', label: '1M - 2M' },
  { min: 2000000, max: 5000000, color: 'rgb(249,134,0)', label: '2M - 5M' },
  { min: 5000000, max: 10000000, color: 'rgb(255,97,3)', label: '5M - 10M' },
  { min: 10000000, max: Infinity, color: 'rgb(255,69,0)', label: '10M+' },
];

/**
 * Get color for a given loss value
 * @param losses - The seismic loss value
 * @returns RGB color string
 */
export function getColorForLosses(losses: number): string {
  if (losses < 1000) {
    return 'rgb(255,255,255)'; // White for very low/no risk
  }

  for (const level of riskColorScale) {
    if (losses >= level.min && losses < level.max) {
      return level.color;
    }
  }

  // Return highest risk color for values above scale
  return riskColorScale[riskColorScale.length - 1].color;
}

/**
 * Convert RGB string to hex format
 * @param rgb - RGB color string like 'rgb(255,69,0)'
 * @returns Hex color string like '#ff4500'
 */
export function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return '#000000';

  const [, r, g, b] = match;
  return '#' + [r, g, b]
    .map(x => parseInt(x).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Get hex color for a given loss value
 * @param losses - The seismic loss value
 * @returns Hex color string
 */
export function getHexColorForLosses(losses: number): string {
  return rgbToHex(getColorForLosses(losses));
}
