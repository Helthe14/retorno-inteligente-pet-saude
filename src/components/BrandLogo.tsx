import React from 'react';

interface BrandProps {
  className?: string;
}

export function BrandLogo({ className = "h-44 w-auto mx-auto" }: BrandProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} id="svg-pet-saude-ufrr">
        {/* Deep Blue Medical Cross - representing healthcare/medicine */}
        <path 
          d="M84 105 H116 V125 H136 V157 H116 V187 H84 V157 H64 V125 H84 Z" 
          fill="#044C8C" 
          stroke="#033d70" 
          strokeWidth="1.5" 
          strokeLinejoin="round" 
        />
        
        {/* Digital circuit paths inside the medical cross */}
        <circle cx="100" cy="146" r="4.5" fill="#1D92D1" />
        <path d="M100 128 V142 M100 150 V168 M78 146 H95 M105 146 H122" stroke="#1D92D1" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="100" cy="128" r="2.5" fill="#ffffff" />
        <circle cx="100" cy="168" r="2.5" fill="#ffffff" />
        <circle cx="78" cy="146" r="2.5" fill="#ffffff" />
        <circle cx="122" cy="146" r="2.5" fill="#ffffff" />

        {/* Cyan Ribbon Wave overlaying the center of the cross */}
        <path 
          d="M68 141 C 82 129, 98 153, 114 141 C 124 133, 128 138, 132 141" 
          stroke="#1D92D1" 
          strokeWidth="5" 
          strokeLinecap="round" 
          fill="none"
        />
        <path 
          d="M70 135 C 80 123, 96 132, 106 123 C 114 116, 120 123, 128 133" 
          fill="#1D92D1" 
          stroke="#ffffff" 
          strokeWidth="1" 
        />

        {/* Orange Graduation Cap sitting elegantly on top */}
        {/* Cap Diamond */}
        <path d="M100 62 L138 78 L100 94 L62 78 Z" fill="#F26F22" stroke="#ffffff" strokeWidth="1.5" />
        {/* Cap Base under-shadow */}
        <path d="M78 82 V88 C78 94, 122 94, 122 88 V82" fill="#D65812" />
        {/* Tassel line and knob */}
        <path d="M100 78 L133 85 V98" stroke="#F26F22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="133" cy="98" r="3" fill="#F26F22" />

        {/* Curved title text "PET-Saúde Digital" following a smooth circular arc */}
        <path id="textPathArc" d="M 40 76 A 64 64 0 0 1 160 76" fill="none" />
        <text className="font-sans font-bold" fill="#044C8C" style={{ fontSize: '11.5px', letterSpacing: '0.6px' }}>
          <textPath href="#textPathArc" startOffset="50%" textAnchor="middle">
            PET-Saúde Digital
          </textPath>
        </text>

        {/* "UFRR" main typography brand */}
        <text x="100" y="214" textAnchor="middle" fill="#044C8C" className="font-sans font-extrabold" style={{ fontSize: '25px', letterSpacing: '1.5px' }}>
          UFRR
        </text>

        {/* Lower explanatory tagline label */}
        <text x="100" y="231" textAnchor="middle" fill="#1D92D1" className="font-sans font-bold" style={{ fontSize: '9px', letterSpacing: '0.4px' }}>
          Informação e Saúde Digital
        </text>
      </svg>
    </div>
  );
}

export function MiniBrandLogo({ className = "h-9 w-9" }: BrandProps) {
  return (
    <div className={`p-1 bg-white rounded-xl border border-slate-100 flex items-center justify-center shrink-0 ${className}`} id="mini-logo-wrapper">
      <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        {/* Simplified Medical Cross */}
        <path d="M84 105 H116 V125 H136 V157 H116 V187 H84 V157 H64 V125 H84 Z" fill="#044C8C" />
        {/* Wave */}
        <path d="M68 141 C 82 129, 98 153, 114 141" stroke="#1D92D1" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* Orange Cap */}
        <path d="M100 62 L138 78 L100 94 L62 78 Z" fill="#F26F22" />
        <text x="100" y="222" textAnchor="middle" fill="#044C8C" className="font-bold font-sans" style={{ fontSize: '32px' }}>V</text>
      </svg>
    </div>
  );
}
