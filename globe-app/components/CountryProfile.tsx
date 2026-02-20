'use client';

import { useState, useEffect } from 'react';
import { getCountryProfilePath } from '@/utils/countryMapping';
import { OctagonAlert } from "lucide-react"
import { LoaderOne } from "@/components/ui/loader";


interface CountryProfileProps {
  countryName: string | null;
  onClose?: () => void;
}

export default function CountryProfile({ countryName, onClose }: CountryProfileProps) {
  // Track which country had an error (not just boolean)
  const [errorCountry, setErrorCountry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state whenever the selected country changes
  useEffect(() => {
    setIsLoading(true);
  }, [countryName]);

  // Only show error if it's for the current country
  const imageError = errorCountry === countryName;

  if (!countryName) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 border-l border-gray-200">
        <div className="text-center text-gray-500 p-8">
            <OctagonAlert className="mx-auto h-12 w-12 text-gray-400 mb-4" />
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
        style={{ padding: '0.1rem', minHeight: 0 }}
      >
        {imageError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <OctagonAlert className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm">
                No profile found for <b>{countryName}</b>
              </p>
              {/* <p className="text-xs mt-2 text-gray-400">
                Expected path: {profilePath}
              </p> */}
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <LoaderOne />
                </div>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profilePath}
              alt={`${countryName} Seismic Risk Profile`}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: isLoading ? 'none' : 'block' }}
              onLoad={() => setIsLoading(false)}
              onError={() => { setErrorCountry(countryName); setIsLoading(false); }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
