'use client';

import { useState } from 'react';
import { getCountryProfilePath } from '@/utils/countryMapping';

interface CountryProfileProps {
  countryName: string | null;
  onClose?: () => void;
}

export default function CountryProfile({ countryName, onClose }: CountryProfileProps) {
  // Track which country had an error (not just boolean)
  const [errorCountry, setErrorCountry] = useState<string | null>(null);

  // Only show error if it's for the current country
  const imageError = errorCountry === countryName;

  if (!countryName) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 border-l border-gray-200">
        <div className="text-center text-gray-500 p-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">No Country Selected</h3>
          <p className="text-sm">Click on a country on the globe to view its seismic risk profile</p>
        </div>
      </div>
    );
  }

  const profilePath = getCountryProfilePath(countryName);

  return (
    <div className="flex flex-col bg-white overflow-hidden h-full">
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between border-b border-gray-200 bg-gray-50"
        style={{ padding: '1rem', minHeight: '60px' }}
      >
        <h2 className="text-xl font-semibold text-gray-800">{countryName}</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Profile Image */}
      <div
        className="flex-1 overflow-auto"
        style={{ padding: '1rem', minHeight: 0 }}
      >
        {imageError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm">
                Profile not found for <b>{countryName}</b>
              </p>
              {/* <p className="text-xs mt-2 text-gray-400">
                Expected path: {profilePath}
              </p> */}
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profilePath}
              alt={`${countryName} Seismic Risk Profile`}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={() => setErrorCountry(countryName)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
