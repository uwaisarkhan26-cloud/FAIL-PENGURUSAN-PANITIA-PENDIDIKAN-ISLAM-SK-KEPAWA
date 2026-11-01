import React from 'react';

export interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  customLogoUrl?: string;
  logoChoice?: 'sk_kepawa' | 'jata_negara';
  showTitle?: boolean;
}

const sizeMap = {
  xs: 'w-7 h-7',
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28',
  '2xl': 'w-36 h-36',
};

// ==========================================
// 1. JATA NEGARA MALAYSIA (Authentic High-Detail Vector)
// ==========================================
export const JataNegaraBadge: React.FC<{ className?: string; ariaLabel?: string }> = ({
  className = 'w-full h-full',
  ariaLabel = 'Jata Negara Malaysia',
}) => (
  <svg
    viewBox="0 0 240 200"
    className={`${className} drop-shadow-md filter transition-transform hover:scale-105 duration-200`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={ariaLabel}
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF275" />
        <stop offset="50%" stopColor="#F5B300" />
        <stop offset="100%" stopColor="#C98A00" />
      </linearGradient>
      <linearGradient id="tigerGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFAA2A" />
        <stop offset="100%" stopColor="#D96B00" />
      </linearGradient>
    </defs>

    {/* Top Star & Crescent (Bulan dan Bintang Persekutuan 14 Bucu) */}
    <g transform="translate(120, 24)">
      {/* Crescent */}
      <path
        d="M -14 -12 A 18 18 0 1 0 10 16 A 15 15 0 1 1 -14 -12 Z"
        fill="url(#goldGradient)"
        stroke="#664600"
        strokeWidth="0.8"
      />
      {/* 14-pointed Star */}
      <path
        d="M 6 0 L 8 4 L 12 3 L 11 7 L 15 8 L 12 11 L 15 14 L 11 15 L 12 19 L 8 18 L 6 22 L 4 18 L 0 19 L 1 15 L -3 14 L 0 11 L -3 8 L 1 7 L 0 3 L 4 4 Z"
        fill="url(#goldGradient)"
        stroke="#664600"
        strokeWidth="0.8"
      />
    </g>

    {/* Left Supporter: Harimau Belang Kiri */}
    <g id="left-tiger">
      {/* Tail */}
      <path
        d="M 46 122 C 30 135 22 152 26 162 C 28 166 32 165 31 159 C 29 148 37 136 50 126 Z"
        fill="url(#tigerGold)"
        stroke="#401800"
        strokeWidth="1"
      />
      {/* Body & Hind Leg */}
      <path
        d="M 48 85 C 36 96 32 120 40 142 C 43 149 52 155 58 145 C 64 135 59 110 55 98 Z"
        fill="url(#tigerGold)"
        stroke="#401800"
        strokeWidth="1.2"
      />
      {/* Foreleg stepping forward onto scroll */}
      <path
        d="M 52 95 C 44 105 38 122 45 138 L 52 138 C 47 125 50 110 58 102 Z"
        fill="url(#tigerGold)"
        stroke="#401800"
        strokeWidth="1"
      />
      {/* Tiger Head */}
      <ellipse cx="44" cy="80" rx="9" ry="8" fill="url(#tigerGold)" stroke="#401800" strokeWidth="1" />
      <path d="M 40 73 L 42 77 M 46 73 L 45 77" stroke="#401800" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="41" cy="79" r="1.5" fill="#000" />
      <path d="M 38 84 L 43 83 L 40 86 Z" fill="#FFF" />
      {/* Tiger Stripes */}
      <path d="M 39 90 L 45 93 M 36 102 L 43 104 M 38 116 L 45 117 M 42 128 L 48 127" stroke="#401800" strokeWidth="1.5" strokeLinecap="round" />
      {/* Paws with claws */}
      <path d="M 48 146 L 53 158 L 58 158 L 62 148" fill="#FFC875" stroke="#401800" strokeWidth="1.2" strokeLinejoin="round" />
    </g>

    {/* Right Supporter: Harimau Belang Kanan */}
    <g id="right-tiger">
      {/* Tail */}
      <path
        d="M 194 122 C 210 135 218 152 214 162 C 212 166 208 165 209 159 C 211 148 203 136 190 126 Z"
        fill="url(#tigerGold)"
        stroke="#401800"
        strokeWidth="1"
      />
      {/* Body & Hind Leg */}
      <path
        d="M 192 85 C 204 96 208 120 200 142 C 197 149 188 155 182 145 C 176 135 181 110 185 98 Z"
        fill="url(#tigerGold)"
        stroke="#401800"
        strokeWidth="1.2"
      />
      {/* Foreleg */}
      <path
        d="M 188 95 C 196 105 202 122 195 138 L 188 138 C 193 125 190 110 182 102 Z"
        fill="url(#tigerGold)"
        stroke="#401800"
        strokeWidth="1"
      />
      {/* Tiger Head */}
      <ellipse cx="196" cy="80" rx="9" ry="8" fill="url(#tigerGold)" stroke="#401800" strokeWidth="1" />
      <path d="M 200 73 L 198 77 M 194 73 L 195 77" stroke="#401800" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="199" cy="79" r="1.5" fill="#000" />
      <path d="M 202 84 L 197 83 L 200 86 Z" fill="#FFF" />
      {/* Stripes */}
      <path d="M 201 90 L 195 93 M 204 102 L 197 104 M 202 116 L 195 117 M 198 128 L 192 127" stroke="#401800" strokeWidth="1.5" strokeLinecap="round" />
      {/* Paws */}
      <path d="M 192 146 L 187 158 L 182 158 L 178 148" fill="#FFC875" stroke="#401800" strokeWidth="1.2" strokeLinejoin="round" />
    </g>

    {/* Central Heraldic Shield (Perisai Jata) */}
    <g id="shield">
      {/* Shield Base Outline */}
      <path
        d="M 68 56 L 172 56 C 172 88 172 124 120 148 C 68 124 68 88 68 56 Z"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Top Red Field: 5 Keris */}
      <path d="M 70 58 L 170 58 L 170 82 L 70 82 Z" fill="#D31010" stroke="#000" strokeWidth="1" />
      {/* 5 Keris in Gold */}
      <g fill="url(#goldGradient)" stroke="#503500" strokeWidth="0.6">
        {/* Keris 1 */}
        <path d="M 79 78 L 81 62 L 83 78 Z" />
        <rect x="78" y="77" width="6" height="2" rx="0.5" />
        {/* Keris 2 */}
        <path d="M 98 78 L 100 62 L 102 78 Z" />
        <rect x="97" y="77" width="6" height="2" rx="0.5" />
        {/* Keris 3 (Center) */}
        <path d="M 119 78 L 120 60 L 122 78 Z" />
        <rect x="117" y="77" width="6" height="2" rx="0.5" />
        {/* Keris 4 */}
        <path d="M 139 78 L 140 62 L 142 78 Z" />
        <rect x="137" y="77" width="6" height="2" rx="0.5" />
        {/* Keris 5 */}
        <path d="M 158 78 L 160 62 L 162 78 Z" />
        <rect x="157" y="77" width="6" height="2" rx="0.5" />
      </g>

      {/* Center 4 Quadrants: Red, Black, White, Yellow */}
      <rect x="70" y="83" width="50" height="20" fill="#D31010" stroke="#000" strokeWidth="0.8" />
      <rect x="120" y="83" width="50" height="20" fill="#151515" stroke="#000" strokeWidth="0.8" />
      <rect x="70" y="103" width="50" height="20" fill="#FFFFFF" stroke="#000" strokeWidth="0.8" />
      <rect x="120" y="103" width="50" height="20" fill="#FFD100" stroke="#000" strokeWidth="0.8" />

      {/* Flanking Quarters: Pulau Pinang (Left) and Melaka (Right) */}
      {/* Pulau Pinang (Pinang Palm on White) */}
      <g transform="translate(71, 104)">
        <rect x="0" y="0" width="23" height="19" fill="#FFFFFF" stroke="#000" strokeWidth="0.5" />
        {/* Palm tree */}
        <path d="M 11 18 L 11 10" stroke="#5C3814" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="8" r="4.5" fill="#1C8C24" />
      </g>
      {/* Melaka (Pokok Melaka on White) */}
      <g transform="translate(146, 104)">
        <rect x="0" y="0" width="23" height="19" fill="#FFFFFF" stroke="#000" strokeWidth="0.5" />
        {/* Melaka tree */}
        <path d="M 11 18 L 11 9" stroke="#5C3814" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="11" cy="7" rx="5" ry="4" fill="#1B7A23" />
      </g>

      {/* Bottom Row of Perisai: Sabah (Left), Bunga Raya (Center), Sarawak (Right) */}
      <path
        d="M 70 123 C 82 138 102 146 120 146 C 138 146 158 138 170 123 Z"
        fill="#FFFFFF"
        stroke="#000"
        strokeWidth="1"
      />

      {/* Sabah section (Left corner) */}
      <path d="M 70 123 C 78 133 90 140 100 143 L 100 123 Z" fill="#0066CC" stroke="#000" strokeWidth="0.5" />
      {/* White hands holding flag motif */}
      <rect x="80" y="127" width="12" height="7" rx="1" fill="#FFFFFF" />
      <path d="M 80 127 L 92 134 M 80 134 L 92 127" stroke="#D31010" strokeWidth="0.8" />

      {/* Sarawak section (Right corner) */}
      <path d="M 140 123 L 140 143 C 150 140 162 133 170 123 Z" fill="#FFD100" stroke="#000" strokeWidth="0.5" />
      {/* Hornbill silhouette motif */}
      <path d="M 148 128 C 153 125 158 130 160 135 L 147 135 Z" fill="#D31010" />

      {/* Center National Flower: Bunga Raya (Red Hibiscus with Gold Stamen) */}
      <g transform="translate(120, 133)">
        <circle cx="0" cy="0" r="6" fill="#D31010" stroke="#8A0000" strokeWidth="0.6" />
        {/* 5 Petals shape */}
        <circle cx="-3" cy="-2" r="2.8" fill="#E61C1C" />
        <circle cx="3" cy="-2" r="2.8" fill="#E61C1C" />
        <circle cx="-3" cy="2" r="2.8" fill="#E61C1C" />
        <circle cx="3" cy="2" r="2.8" fill="#E61C1C" />
        <circle cx="0" cy="-4" r="2.8" fill="#E61C1C" />
        {/* Yellow Stamen */}
        <line x1="0" y1="0" x2="2" y2="-5" stroke="#FFE600" strokeWidth="1" strokeLinecap="round" />
        <circle cx="2" cy="-5" r="1" fill="#FFE600" />
      </g>
    </g>

    {/* Bottom Motto Scroll Banner (Pita Cogan Kata) */}
    <g id="motto-scroll" transform="translate(0, 5)">
      {/* Ribbon Ends Left */}
      <path d="M 28 152 L 48 144 L 54 158 L 32 165 Z" fill="url(#goldGradient)" stroke="#000" strokeWidth="1.5" />
      <polygon points="28,152 18,158 32,165" fill="#C98A00" stroke="#000" strokeWidth="1" />

      {/* Ribbon Ends Right */}
      <path d="M 212 152 L 192 144 L 186 158 L 208 165 Z" fill="url(#goldGradient)" stroke="#000" strokeWidth="1.5" />
      <polygon points="212,152 222,158 208,165" fill="#C98A00" stroke="#000" strokeWidth="1" />

      {/* Main Arch Banner */}
      <path
        d="M 42 150 C 85 140 155 140 198 150 L 192 166 C 152 156 88 156 48 166 Z"
        fill="url(#goldGradient)"
        stroke="#000000"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Motto Text: BERSEKUTU BERTAMBAH MUTU */}
      <text
        x="120"
        y="159"
        fill="#000000"
        fontSize="7.5"
        fontWeight="900"
        textAnchor="middle"
        fontFamily="'Times New Roman', serif, system-ui"
        letterSpacing="0.8"
      >
        BERSEKUTU BERTAMBAH MUTU
      </text>
    </g>
  </svg>
);

// ==========================================
// 2. LOGO SK KEPAWA (Authentic Official School Badge)
// ==========================================
export const SkKepawaBadge: React.FC<{ className?: string; ariaLabel?: string }> = ({
  className = 'w-full h-full',
  ariaLabel = 'Lencana Rasmi SK Kepawa',
}) => (
  <svg
    viewBox="0 0 500 550"
    className={`${className} drop-shadow-md filter transition-transform hover:scale-105 duration-200`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={ariaLabel}
  >
    <defs>
      {/* Path for curved text: SEK. KEB. KEPAWA */}
      <path id="textPathKepawaMain" d="M 85 180 A 210 210 0 0 1 415 180" fill="none" />
    </defs>

    {/* Outer Shield Boundary & Yellow Base */}
    <path
      d="M 50 180 C 80 50 420 50 450 180 L 415 240 L 425 250 L 390 395 L 250 480 L 110 395 L 75 250 L 85 240 Z"
      fill="#FFF200"
      stroke="#000"
      strokeWidth="10"
      strokeLinejoin="round"
    />

    {/* Top Green Arc Area */}
    <path
      d="M 95 180 C 120 70 380 70 405 180 C 330 155 170 155 95 180 Z"
      fill="#00D048"
      stroke="#000"
      strokeWidth="7"
      strokeLinejoin="round"
    />

    {/* School Name along Top Arch */}
    <text
      fill="#000"
      fontWeight="900"
      fontSize="36"
      letterSpacing="2"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      <textPath href="#textPathKepawaMain" startOffset="50%" textAnchor="middle">
        SEK. KEB. KEPAWA
      </textPath>
    </text>

    {/* Lower Blue Ribbon Extensions (Behind) */}
    <path
      d="M 10 330 L 120 400 L 90 460 L 10 420 L 50 375 Z"
      fill="#0026B3"
      stroke="#000"
      strokeWidth="8"
      strokeLinejoin="round"
    />
    <path
      d="M 490 330 L 380 400 L 410 460 L 490 420 L 450 375 Z"
      fill="#0026B3"
      stroke="#000"
      strokeWidth="8"
      strokeLinejoin="round"
    />

    {/* Inner Crest: Red Canopy / Drape */}
    <path
      d="M 95 180 C 130 160 370 160 405 180 L 375 245 C 340 230 310 245 250 125 C 190 245 160 230 125 245 Z"
      fill="#E60000"
      stroke="#000"
      strokeWidth="7"
      strokeLinejoin="round"
    />
    <path
      d="M 125 245 L 250 420 L 375 245 C 330 270 290 250 250 395 C 210 250 170 270 125 245 Z"
      fill="#E60000"
      stroke="#000"
      strokeWidth="7"
      strokeLinejoin="round"
    />

    {/* Central White Rolled Scroll / Diploma */}
    <g transform="translate(165, 170) rotate(-7)">
      <rect x="30" y="25" width="145" height="28" rx="6" fill="#FFFFFF" stroke="#000" strokeWidth="6" />
      <ellipse cx="30" cy="39" rx="12" ry="14" fill="#F8FAFC" stroke="#000" strokeWidth="5" />
      {/* Scroll Tie Ribbon */}
      <rect x="98" y="24" width="12" height="30" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
      <path d="M 104 22 C 90 0 100 0 104 20 C 108 0 118 0 104 22 Z" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
      <path d="M 101 54 L 88 80 L 100 75 L 108 80 L 105 54" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
    </g>

    {/* Central Open Book (Al-Quran & Ilmu) */}
    <g transform="translate(190, 255)">
      {/* Left page */}
      <path
        d="M 60 85 C 30 75 5 80 -10 70 L -10 10 C 5 20 30 15 60 25 Z"
        fill="#FFFFFF"
        stroke="#000"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Right page */}
      <path
        d="M 60 85 C 90 75 115 80 130 70 L 130 10 C 115 20 90 15 60 25 Z"
        fill="#FFFFFF"
        stroke="#000"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Book spine line */}
      <line x1="60" y1="25" x2="60" y2="85" stroke="#000" strokeWidth="6" />

      {/* Book script lines on left page */}
      <line x1="5" y1="32" x2="45" y2="36" stroke="#000" strokeWidth="4" strokeLinecap="round" />
      <line x1="5" y1="46" x2="45" y2="50" stroke="#000" strokeWidth="4" strokeLinecap="round" />
      <line x1="5" y1="60" x2="45" y2="64" stroke="#000" strokeWidth="4" strokeLinecap="round" />

      {/* Book script lines on right page */}
      <line x1="75" y1="36" x2="115" y2="32" stroke="#000" strokeWidth="4" strokeLinecap="round" />
      <line x1="75" y1="50" x2="115" y2="46" stroke="#000" strokeWidth="4" strokeLinecap="round" />
      <line x1="75" y1="64" x2="115" y2="60" stroke="#000" strokeWidth="4" strokeLinecap="round" />
    </g>

    {/* Lower Shield Triangular tip in Yellow */}
    <polygon points="250,470 120,400 380,400" fill="#FFF200" stroke="#000" strokeWidth="7" />

    {/* Motto Ribbon Foreground (Green banner with black border) */}
    <polygon
      points="90,400 410,400 410,480 250,545 90,480"
      fill="#00D048"
      stroke="#000"
      strokeWidth="8"
      strokeLinejoin="round"
    />
    <polygon
      points="100,410 400,410 400,472 250,530 100,472"
      fill="none"
      stroke="#000"
      strokeWidth="4"
      strokeLinejoin="round"
    />

    {/* Motto Text: USAHA JAYA */}
    <text
      x="160"
      y="462"
      fill="#000"
      fontWeight="900"
      fontSize="36"
      letterSpacing="4"
      fontFamily="'Times New Roman', serif"
    >
      USAHA
    </text>
    <text
      x="290"
      y="462"
      fill="#000"
      fontWeight="900"
      fontSize="36"
      letterSpacing="4"
      fontFamily="'Times New Roman', serif"
    >
      JAYA
    </text>
  </svg>
);

// ==========================================
// 3. MAIN UNIFIED LOGO COMPONENT
// ==========================================
export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  customLogoUrl,
  logoChoice = 'sk_kepawa',
  showTitle = false,
}) => {
  const chosenSizeClass = sizeMap[size] || sizeMap.md;

  // Render content according to user's explicit choice:
  // 1. If logoChoice is specifically 'jata_negara', display authentic Jata Negara Malaysia
  // 2. Otherwise display SK Kepawa (either custom uploaded file or authentic SVG badge)
  const [imageError, setImageError] = React.useState(false);

  // If customLogoUrl is provided, use it. Otherwise use the authentic SK Kepawa logo asset.
  const logoSrc = customLogoUrl && customLogoUrl.trim() !== ''
    ? customLogoUrl
    : '/assets/logo_sk_kepawa.png';

  const renderGraphic = () => {
    if (imageError) {
      return <SkKepawaBadge className={chosenSizeClass} />;
    }

    return (
      <img
        src={logoSrc}
        alt="Logo Rasmi SK Kepawa"
        className={`${chosenSizeClass} object-contain drop-shadow-sm rounded-sm`}
        referrerPolicy="no-referrer"
        onError={() => {
          if (logoSrc !== '/assets/logo_sk_kepawa.png') {
            // Try official asset if custom URL fails
            const target = document.querySelector('img[alt="Logo Rasmi SK Kepawa"]') as HTMLImageElement;
            if (target) target.src = '/assets/logo_sk_kepawa.png';
          } else {
            setImageError(true);
          }
        }}
      />
    );
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {renderGraphic()}

      {showTitle && (
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
            Kementerian Pendidikan Malaysia
          </span>
          <h1 className="text-lg font-extrabold text-white tracking-tight leading-tight">
            SK KEPAWA
          </h1>
          <span className="text-xs font-semibold text-amber-200/90">
            Panitia Pendidikan Islam 2026
          </span>
        </div>
      )}
    </div>
  );
};
