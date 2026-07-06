import React from 'react';

interface TeamFlagProps {
  isoCode?: string;
  code?: string;
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const ISO_MAP: Record<string, string> = {
  esp: 'es',
  por: 'pt',
  arg: 'ar',
  fra: 'fr',
  bra: 'br',
  eng: 'gb-eng',
  usa: 'us',
  ita: 'it',
  uru: 'uy',
  col: 'co',
  jpn: 'jp',
  sui: 'ch',
  can: 'ca',
  mex: 'mx',
  mar: 'ma',
  sen: 'sn',
  bel: 'be',
  nor: 'no',
  par: 'py',
  egy: 'eg',
  // standard codes
  es: 'es', pt: 'pt', ar: 'ar', fr: 'fr', br: 'br', 'gb-eng': 'gb-eng', us: 'us', it: 'it', uy: 'uy', co: 'co', jp: 'jp', ch: 'ch', ca: 'ca', mx: 'mx', ma: 'ma', sn: 'sn', be: 'be', no: 'no', py: 'py', eg: 'eg',
  // emojis to iso
  '🇪🇸': 'es',
  '🇵🇹': 'pt',
  '🇦🇷': 'ar',
  '🇫🇷': 'fr',
  '🇧🇷': 'br',
  '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 'gb-eng',
  '🇺🇸': 'us',
  '🇮🇹': 'it',
  '🇺🇾': 'uy',
  '🇨🇴': 'co',
  '🇯🇵': 'jp',
  '🇨🇭': 'ch',
  '🇨🇦': 'ca',
  '🇲🇽': 'mx',
  '🇲🇦': 'ma',
  '🇸🇳': 'sn',
  '🇧🇪': 'be',
  '🇳🇴': 'no',
  '🇵🇾': 'py',
  '🇪🇬': 'eg',
  '🇭🇷': 'hr',
  '🇨🇱': 'cl',
  '🇩🇪': 'de',
  '🇳🇱': 'nl',
  '🇦🇹': 'at',
  '🇨🇿': 'cz',
  '🇵🇱': 'pl',
  '🇩🇰': 'dk',
  '🇦🇺': 'au',
  '🇰🇷': 'kr',
  '🇸🇪': 'se',
  '🇮🇷': 'ir',
  '🇸🇦': 'sa',
  '🇶🇦': 'qa',
  '🇺🇿': 'uz',
  '🇳🇬': 'ng',
  '🇬🇭': 'gh',
  '🇨🇲': 'cm',
  '🇨🇮': 'ci',
  '🇩🇿': 'dz',
  '🇿🇦': 'za',
  '🇹🇳': 'tn',
  '🇲🇱': 'ml',
  '🇵🇪': 'pe',
  '🇪🇨': 'ec',
  '🇻🇪': 've',
  '🇧🇴': 'bo',
  '🇵🇦': 'pa',
  '🇨🇷': 'cr',
  '🇭🇳': 'hn',
  '🇯🇲': 'jm',
};

export default function TeamFlag({ isoCode, code, name = 'Flag', className = '', size = 'md' }: TeamFlagProps) {
  const lookupKey = (isoCode || code || '').toLowerCase();
  const flagCode = ISO_MAP[lookupKey] || lookupKey;
  
  // Choose width based on size
  let widthParam = 'w80';
  let sizeClasses = 'w-6 h-4 sm:w-7 sm:h-5';
  
  if (size === 'sm') {
    widthParam = 'w40';
    sizeClasses = 'w-4 h-3 sm:w-5 sm:h-3.5';
  } else if (size === 'md') {
    widthParam = 'w80';
    sizeClasses = 'w-6 h-4 sm:w-7 sm:h-5';
  } else if (size === 'lg') {
    widthParam = 'w160';
    sizeClasses = 'w-8 h-6 sm:w-10 sm:h-7';
  } else if (size === 'xl') {
    widthParam = 'w160';
    sizeClasses = 'w-12 h-8 sm:w-16 sm:h-11';
  } else if (size === '2xl') {
    widthParam = 'w320';
    sizeClasses = 'w-16 h-11 sm:w-24 sm:h-16';
  }

  const url = `https://flagcdn.com/${widthParam}/${flagCode}.png`;
  const srcset = `https://flagcdn.com/w160/${flagCode}.png 2x`;

  return (
    <img
      src={url}
      srcSet={size === 'xl' || size === 'lg' || size === '2xl' ? srcset : undefined}
      alt={`Bendera ${name}`}
      title={name}
      className={`inline-block object-cover rounded shadow-sm border border-slate-200/80 shrink-0 ${sizeClasses} ${className}`}
      loading="lazy"
    />
  );
}

// Helper function to render text that contains emoji flags into real Flagpedia images
export function renderFlagText(text?: string, size: 'sm' | 'md' | 'lg' = 'sm') {
  if (!text) return null;

  // Regex to match any known flag emojis
  const flagRegex = /(🏴󠁧󠁢󠁥󠁮󠁧󠁿|🏴󠁧󠁢󠁳󠁣󠁴󠁿|🏴󠁧󠁢󠁷󠁬󠁳󠁿|🇪🇸|🇵🇹|🇦🇷|🇫🇷|🇧🇷|🇺🇸|🇮🇹|🇺🇾|🇨🇴|🇯🇵|🇨🇭|🇨🇦|🇲🇽|🇲🇦|🇸🇳|🇧🇪|🇳🇴|🇵🇾|🇪🇬|🇭🇷|🇨🇱|🇩🇪|🇳🇱|🇦🇹|🇨🇿|🇵🇱|🇩🇰|🇦🇺|🇰🇷|🇸🇪|🇮🇷|🇸🇦|🇶🇦|🇺🇿|🇳🇬|🇬🇭|🇨🇲|🇨🇮|🇩🇿|🇿🇦|🇹🇳|🇲🇱|🇵🇪|🇪🇨|🇻🇪|🇧🇴|🇵🇦|🇨🇷|🇭🇳|🇯🇲)/gu;

  const parts = text.split(flagRegex);
  if (parts.length === 1) return text;

  return (
    <span className="inline-flex items-center flex-wrap gap-1 align-middle">
      {parts.map((part, idx) => {
        let iso = ISO_MAP[part];
        if (!iso && part.length >= 4) {
          const cp1 = part.codePointAt(0);
          const cp2 = part.codePointAt(2);
          if (cp1 && cp2 && cp1 >= 0x1F1E6 && cp1 <= 0x1F1FF && cp2 >= 0x1F1E6 && cp2 <= 0x1F1FF) {
            const char1 = String.fromCharCode(0x61 + (cp1 - 0x1F1E6));
            const char2 = String.fromCharCode(0x61 + (cp2 - 0x1F1E6));
            iso = `${char1}${char2}`;
          }
        }
        if (iso) {
          return <TeamFlag key={idx} isoCode={iso} size={size} className="my-0.5" />;
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
}
