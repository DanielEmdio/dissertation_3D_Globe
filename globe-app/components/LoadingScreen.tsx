// import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d1b2a]">
      {/* Animated wireframe globe */}
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        {/* Sphere outline */}
        <circle cx="50" cy="50" r="44" stroke="white" strokeWidth="1.2" strokeOpacity="0.85" />

        {/* Latitude lines */}
        <ellipse cx="50" cy="50" rx="44" ry="12"  stroke="white" strokeWidth="0.8" strokeOpacity="0.5" />
        <ellipse cx="50" cy="28" rx="38" ry="10"  stroke="white" strokeWidth="0.7" strokeOpacity="0.4" />
        <ellipse cx="50" cy="72" rx="38" ry="10"  stroke="white" strokeWidth="0.7" strokeOpacity="0.4" />
        <ellipse cx="50" cy="12" rx="22" ry="6"   stroke="white" strokeWidth="0.6" strokeOpacity="0.3" />
        <ellipse cx="50" cy="88" rx="22" ry="6"   stroke="white" strokeWidth="0.6" strokeOpacity="0.3" />

        {/* Spinning meridians — SMIL animates rx to simulate Y-axis rotation */}
        {/* Meridian 0 — phase 0° */}
        <ellipse cx="50" cy="50" ry="44" stroke="white" strokeWidth="0.9" strokeOpacity="0.65">
          <animate attributeName="rx" values="44;31;0;31;44;31;0;31;44" keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1" dur="4s" repeatCount="indefinite" />
        </ellipse>
        {/* Meridian 1 — phase 45° */}
        <ellipse cx="50" cy="50" ry="44" stroke="white" strokeWidth="0.9" strokeOpacity="0.65">
          <animate attributeName="rx" values="31;0;31;44;31;0;31;44;31" keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1" dur="4s" repeatCount="indefinite" />
        </ellipse>
        {/* Meridian 2 — phase 90° */}
        <ellipse cx="50" cy="50" ry="44" stroke="white" strokeWidth="0.9" strokeOpacity="0.65">
          <animate attributeName="rx" values="0;31;44;31;0;31;44;31;0" keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1" dur="4s" repeatCount="indefinite" />
        </ellipse>
        {/* Meridian 3 — phase 135° */}
        <ellipse cx="50" cy="50" ry="44" stroke="white" strokeWidth="0.9" strokeOpacity="0.65">
          <animate attributeName="rx" values="31;44;31;0;31;44;31;0;31" keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1" dur="4s" repeatCount="indefinite" />
        </ellipse>
      </svg>

      {/* Label */}
      <p className="mt-6 text-white/75 text-sm font-light tracking-[0.2em]">
        Loading globe...
      </p>

      {/* Indeterminate progress bar */}
      <div className="mt-4 w-32 h-px bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full w-1/3 bg-white/50 rounded-full"
          style={{ animation: 'loading-slide 1.8s ease-in-out infinite' }}
        />
      </div>
    </div>
  );
}

// return (
//       <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d1b2a]">
//         {/* Animated wireframe globe */}
//         <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
//           {/* Sphere outline */}
//           <circle cx="50" cy="50" r="44" stroke="white" strokeWidth="1.2" strokeOpacity="0.85" />

//           {/* Latitude lines */}
//           <ellipse cx="50" cy="50" rx="44" ry="12"  stroke="white" strokeWidth="0.8" strokeOpacity="0.5" />
//           <ellipse cx="50" cy="28" rx="38" ry="10"  stroke="white" strokeWidth="0.7" strokeOpacity="0.4" />
//           <ellipse cx="50" cy="72" rx="38" ry="10"  stroke="white" strokeWidth="0.7" strokeOpacity="0.4" />
//           <ellipse cx="50" cy="12" rx="22" ry="6"   stroke="white" strokeWidth="0.6" strokeOpacity="0.3" />
//           <ellipse cx="50" cy="88" rx="22" ry="6"   stroke="white" strokeWidth="0.6" strokeOpacity="0.3" />

//           {/* Spinning meridians — SMIL animates rx to simulate Y-axis rotation */}
//           {/* Meridian 0 — phase 0° */}
//           <ellipse cx="50" cy="50" ry="44" stroke="white" strokeWidth="0.9" strokeOpacity="0.65">
//             <animate attributeName="rx" values="44;31;0;31;44;31;0;31;44" keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1" dur="4s" repeatCount="indefinite" />
//           </ellipse>
//           {/* Meridian 1 — phase 45° */}
//           <ellipse cx="50" cy="50" ry="44" stroke="white" strokeWidth="0.9" strokeOpacity="0.65">
//             <animate attributeName="rx" values="31;0;31;44;31;0;31;44;31" keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1" dur="4s" repeatCount="indefinite" />
//           </ellipse>
//           {/* Meridian 2 — phase 90° */}
//           <ellipse cx="50" cy="50" ry="44" stroke="white" strokeWidth="0.9" strokeOpacity="0.65">
//             <animate attributeName="rx" values="0;31;44;31;0;31;44;31;0" keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1" dur="4s" repeatCount="indefinite" />
//           </ellipse>
//           {/* Meridian 3 — phase 135° */}
//           <ellipse cx="50" cy="50" ry="44" stroke="white" strokeWidth="0.9" strokeOpacity="0.65">
//             <animate attributeName="rx" values="31;44;31;0;31;44;31;0;31" keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1" dur="4s" repeatCount="indefinite" />
//           </ellipse>
//         </svg>

//         {/* Label */}
//         <p className="mt-6 text-white/75 text-sm font-light tracking-[0.2em]">
//           Loading globe...
//         </p>

//         {/* Indeterminate progress bar */}
//         <div className="mt-4 w-32 h-px bg-white/10 rounded-full overflow-hidden">
//           <div
//             className="h-full w-1/3 bg-white/50 rounded-full"
//             style={{ animation: 'loading-slide 1.8s ease-in-out infinite' }}
//           />
//         </div>
//       </div>
//     );