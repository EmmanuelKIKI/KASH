interface KashLogoSVGProps {
  width?: number;
  height?: number;
  variant?: 'full' | 'icon';
  className?: string;
}

export function KashLogoSVG({
  width = 200,
  height = 70,
  variant = 'full',
  className,
}: KashLogoSVGProps) {
  if (variant === 'icon') {
    return (
      <svg width={width} height={height} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="60" height="60" rx="14" fill="#00A36C"/>
        <path d="M14 44V16H20V28L31 16H39L27 29L40 44H32L22 32V44H14Z" fill="white"/>
        <path d="M36 20L44 12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M44 12L44 19" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M44 12L37 12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <ellipse cx="39" cy="31" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/>
        <text x="37" y="35" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">F</text>
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 340 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="KASH – Gérer. Encaisser. Grandir."
    >
      {/* Icône K avec flèche */}
      <g>
        {/* K */}
        <path d="M8 68V12H20V38L42 12H58L35 40L60 68H44L24 43V68H8Z" fill="#00A36C"/>
        {/* Flèche montante */}
        <path d="M48 8L68 8L68 28" stroke="#00A36C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M32 32L68 8" stroke="#00A36C" strokeWidth="5" strokeLinecap="round" fill="none"/>
        {/* Cercle F */}
        <circle cx="52" cy="52" r="14" fill="none" stroke="#00A36C" strokeWidth="3"/>
        <text x="46" y="58" fill="#00A36C" fontSize="14" fontWeight="bold" fontFamily="Georgia, serif">F</text>
      </g>
      {/* Texte KASH */}
      <text x="88" y="52" fill="#00A36C" fontSize="38" fontWeight="900" fontFamily="Georgia, serif" letterSpacing="-1">
        KASH
      </text>
      {/* Tagline */}
      <text x="88" y="70" fill="#1A202C" fontSize="11" fontWeight="600" fontFamily="sans-serif" letterSpacing="2">
        GÉRER. ENCAISSER. GRANDIR.
      </text>
    </svg>
  );
}
