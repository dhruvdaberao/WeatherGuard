import type { SVGProps } from 'react';

export function TelegramLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 240 240" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="tg-grad" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#37aee2" />
          <stop offset="1" stopColor="#1e96c8" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="120" fill="url(#tg-grad)" />
      <g transform="translate(-12, 10)">
        <path d="M52.3 115.7l133.1-51.5c6.2-2.3 11.6 1.4 9.7 10.7l-22.6 106.8c-1.7 7.7-6.3 9.6-12.7 6l-35.1-25.9-17 16.4c-1.9 1.9-3.5 3.5-7.1 3.5l2.5-35.8 65.3-59c2.8-2.5-1.2-4.1-4.7-1.8l-80.7 50.8-34.8-10.9c-7.6-2.4-7.7-7.6 1.6-11.3z" fill="#fff" />
      </g>
    </svg>
  );
}
