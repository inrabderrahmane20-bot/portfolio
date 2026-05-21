import Link from 'next/link';
import { contactData } from '@/lib/content';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#DDD2C3', borderTop: '1px solid #CBB8A0', padding: '4rem 0 2.5rem' }}>
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-10 mb-12">
          <div>
            <p className="font-display font-bold text-[0.7rem] uppercase tracking-[0.42em] mb-4"
              style={{ color: '#FFFFFF' }}>AC.</p>
            <p className="font-sans text-sm leading-6 max-w-xs" style={{ color: '#8A8178' }}>
              Software engineer &amp; product designer crafting elegant digital systems.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] mb-5" style={{ color: '#8A8178' }}>Navigation</p>
              <div className="flex flex-col gap-3">
                {[['Work', '/work'], ['About', '/about'], ['Contact', '/contact']].map(([label, href]) => (
                  <Link key={href} href={href}
                    className="font-sans text-sm transition-colors hover:opacity-70"
                    style={{ color: '#6E5846' }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] mb-5" style={{ color: '#8A8178' }}>Contact</p>
              <div className="flex flex-col gap-3">
                <a href={`mailto:${contactData.email}`}
                  className="font-sans text-sm transition-colors hover:opacity-70"
                  style={{ color: '#6E5846' }}>{contactData.email}</a>
                <p className="font-sans text-sm" style={{ color: '#8A8178' }}>{contactData.location}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6"
          style={{ borderTop: '1px solid #CBB8A0' }}>
          <p className="font-sans text-[0.65rem] uppercase tracking-[0.2em]" style={{ color: '#8A8178' }}>
            © {new Date().getFullYear()} Abderrahmane Charak
          </p>
          <p className="font-sans text-[0.65rem] uppercase tracking-[0.2em]" style={{ color: '#8A8178' }}>
            Designed &amp; built with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
