/**
 * Country profile mapping utilities
 * Maps country names to their profile image paths
 */

/**
 * Normalize country name to match profile image filename format
 * Converts spaces to underscores and handles special cases
 * @param countryName - The country name (e.g., "United States")
 * @returns Normalized name (e.g., "United_States")
 */
export function normalizeCountryName(countryName: string): string {
  // Replace spaces with underscores
  let normalized = countryName.replace(/\s+/g, '_');

  // Handle special cases
  const specialCases: Record<string, string> = {
    'United_States_of_America': 'United_States',
    'USA': 'United_States',
    'UK': 'United_Kingdom',
    'UAE': 'United_Arab_Emirates',
    'Democratic_Republic_of_Congo': 'Democratic_Republic_of_the_Congo',
    'Republic_of_the_Congo': 'Congo',
    'Côte_d\'Ivoire': 'Ivory_Coast',
    'Czechia': 'Czechia',
    'Czech_Republic': 'Czechia',
  };

  return specialCases[normalized] || normalized;
}

/**
 * Get the profile image path for a country
 * @param countryName - The country name
 * @returns Path to the profile image in the public folder
 */
export function getCountryProfilePath(countryName: string): string {
  const normalized = normalizeCountryName(countryName);
  return `/country-profiles/country_profile_${normalized}.png`;
}

/**
 * Regional grouping of countries (matching the folder structure)
 */
export const regions = {
  Africa: [
    'Algeria', 'Angola', 'Benin', 'Botswana', 'Burundi', 'Cameroon',
    'Central_African_Republic', 'Chad', 'Comoros', 'Congo',
    'Democratic_Republic_of_the_Congo', 'Djibouti', 'Egypt',
    'Equatorial_Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon',
    'Gambia', 'Ghana', 'Guinea', 'Guinea_Bissau', 'Ivory_Coast',
    'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi',
    'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique',
    'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Senegal',
    'Sierra_Leone', 'Somalia', 'South_Africa', 'South_Sudan',
    'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
  ],
  // Add other regions as needed
};

/**
 * Check if a country profile exists (basic validation)
 * @param countryName - The country name
 * @returns Boolean indicating if profile likely exists
 */
export function hasCountryProfile(countryName: string): boolean {
  // In a real app, you might want to fetch this list dynamically
  // For now, we'll assume profiles exist for normalized names
  const normalized = normalizeCountryName(countryName);
  return normalized.length > 0;
}
