import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      {...props}
    >
      {/* Sun Rays */}
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <line x1="60" y1="8" x2="60" y2="15" />
        <line x1="82" y1="18" x2="87" y2="13" />
        <line x1="92" y1="40" x2="99" y2="40" />
        <line x1="82" y1="62" x2="87" y2="67" />
        <line x1="60" y1="72" x2="60" y2="79" />
        <line x1="38" y1="18" x2="33" y2="13" />
      </g>

      {/* Sun Body */}
      <circle cx="60" cy="40" r="22" fill="#FBBF24" stroke="currentColor" strokeWidth="3" />
      
      {/* Sun Face */}
      <circle cx="52" cy="35" r="2.5" fill="currentColor" />
      <circle cx="66" cy="35" r="2.5" fill="currentColor" />
      <circle cx="45" cy="42" r="3.5" fill="#FB7185" />
      <circle cx="73" cy="42" r="3.5" fill="#FB7185" />
      <path d="M 54 42 Q 59 48 64 42" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Cloud Body */}
      <path d="M 25 75 C 5 75 5 55 25 55 C 25 30 60 30 60 55 C 80 55 80 75 65 75 Z" fill="#38BDF8" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      
      {/* Cloud Face */}
      <path d="M 32 55 Q 35 50 38 55" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 46 55 Q 49 50 52 55" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="28" cy="62" r="3.5" fill="#FB7185" />
      <circle cx="56" cy="62" r="3.5" fill="#FB7185" />
      <path d="M 39 60 Q 40.5 64 42 60 Q 43.5 64 45 60" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
