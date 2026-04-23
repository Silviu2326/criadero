import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  badge?: string;
  title: string;
  highlightedText?: string;
  description: string;
  ctaPrimary?: { text: string; to: string };
  ctaSecondary?: { text: string; to: string };
  centered?: boolean;
  dark?: boolean;
}

export function LandingHero({
  badge,
  title,
  highlightedText,
  description,
  ctaPrimary,
  ctaSecondary,
  centered = true,
  dark = false,
}: LandingHeroProps) {
  const textColor = dark ? 'text-white' : 'text-apple-black';
  const descColor = dark ? 'text-white/70' : 'text-apple-gray-200';

  return (
    <section
      className={`relative pt-32 pb-16 lg:pt-40 lg:pb-24 ${dark ? 'aurora-dark noise-overlay-dark' : 'aurora-bg'} overflow-hidden`}
    >
      {/* Decorative orbs */}
      <div className="orb orb-gold w-[600px] h-[600px] -top-40 -left-40 animate-pulse-glow" />
      <div className="orb orb-green w-[500px] h-[500px] top-1/3 right-0 animate-float-slow" />
      <div className="orb orb-terracotta w-[400px] h-[400px] bottom-0 left-1/3 animate-float-orbit" />

      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${centered ? 'text-center' : ''}`}
      >
        {badge && (
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full badge-aurora mb-8 ${centered ? 'mx-auto' : ''}`}
          >
            <span>{badge}</span>
          </div>
        )}

        <h1 className={`kinetic-subhead font-display ${textColor} ${centered ? 'mx-auto max-w-4xl' : 'max-w-4xl'}`}>
          {title}
          {highlightedText && (
            <>
              {' '}
              <span className="text-gradient-premium">{highlightedText}</span>
            </>
          )}
        </h1>

        <p
          className={`mt-6 text-lg md:text-xl ${descColor} max-w-3xl leading-relaxed ${centered ? 'mx-auto' : ''}`}
        >
          {description}
        </p>

        {(ctaPrimary || ctaSecondary) && (
          <div
            className={`mt-10 flex flex-col sm:flex-row items-center gap-4 ${centered ? 'justify-center' : 'justify-start'}`}
          >
            {ctaPrimary && (
              <Link
                to={ctaPrimary.to}
                className="btn-shimmer px-8 py-4 rounded-xl text-base inline-flex items-center gap-2"
              >
                {ctaPrimary.text}
                <ArrowRight size={20} />
              </Link>
            )}
            {ctaSecondary && (
              <Link
                to={ctaSecondary.to}
                className={`px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2 glass-ultra hover:bg-white/80 transition-all ${dark ? 'text-apple-black' : 'text-apple-black'}`}
              >
                {ctaSecondary.text}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
