import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      {...props}
    >
      <defs>
        <linearGradient id="sunGrad" x1="42" y1="18" x2="82" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFDE4D" />
          <stop offset="100%" stopColor="#FFA800" />
        </linearGradient>
        <linearGradient id="cloudGrad" x1="15" y1="45" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Perfectly Symmetric Sun Rays (Uniform 8px length, safe margins, no bottom poke) */}
      <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
        <line x1="62" y1="13" x2="62" y2="5" />
        <line x1="80" y1="20" x2="85.5" y2="14.5" />
        <line x1="87" y1="38" x2="95" y2="38" />
        <line x1="80" y1="56" x2="85.5" y2="61.5" />
        <line x1="44.5" y1="20.5" x2="39" y2="15" />
      </g>

      {/* Sun Body */}
      <circle cx="62" cy="38" r="20" fill="url(#sunGrad)" stroke="currentColor" strokeWidth="3.5" />
      
      {/* Sun Cheerful Professional Face */}
      <circle cx="55" cy="34" r="2.2" fill="currentColor" />
      <circle cx="67" cy="34" r="2.2" fill="currentColor" />
      <circle cx="49" cy="40" r="3" fill="#FB7185" />
      <circle cx="73" cy="40" r="3" fill="#FB7185" />
      <path d="M 57 40 Q 61 45 65 40" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Fluffy Professional Cloud Body */}
      <path 
        d="M 28 78 C 10 78 8 58 24 54 C 26 36 54 36 60 52 C 76 52 82 68 70 78 Z" 
        fill="url(#cloudGrad)" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinejoin="round" 
      />
      
      {/* Cloud Quirky & Cute Face */}
      <path d="M 34 60 Q 37.5 55 41 60" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 49 60 Q 52.5 55 56 60" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="29" cy="66" r="3.2" fill="#FB7185" />
      <circle cx="61" cy="66" r="3.2" fill="#FB7185" />
      <path d="M 42 65 Q 45 68.5 48 65" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
