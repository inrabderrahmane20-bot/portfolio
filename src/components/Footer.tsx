import Link from 'next/link';
import { contactData } from '@/lib/content';

export default function Footer() {
  return (
    <footer
      style={{
        background:  'linear-gradient(160deg, #07071a 0%, #030308 100%)',
        borderTop:   '1px solid rgba(255,255,255,0.07)',
        padding:     '4rem 0 2rem',
      }}
    >
      <div className="container">
        {/* Top area — stacks on mobile, row on sm+ */}
        <div className="flex flex-col gap-10 mb-10 sm:flex-row sm:items-start sm:justify-between sm:gap-16">
          {/* Brand */}
          <div className="flex-shrink-0">
            <p className="font-display font-black text-[0.72rem] uppercase tracking-[0.42em] mb-3"
              style={{
                background:           'linear-gradient(135deg, #818cf8, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}>
              AC.
            </p>
            <p className="font-sans text-sm leading-6 max-w-[22ch]"
              style={{ color: 'rgba(255,255,255,0.40)' }}>
              Software engineer &amp; product designer crafting elegant digital systems.
            </p>
          </div>

          {/* Links — on mobile: side-by-side (they're short); email wraps safely */}
          <div className="flex gap-10 sm:gap-16 flex-wrap">
            {/* Navigation */}
            <div className="min-w-[80px]">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.28em] mb-4"
                style={{ color: 'rgba(255,255,255,0.28)' }}>Navigation</p>
              <div className="flex flex-col gap-3">
                {[['Work','/work'],['About','/about'],['Contact','/contact']].map(([label,href]) => (
                  <Link key={href} href={href}
                    className="font-sans text-sm transition-all"
                    style={{ color: 'rgba(255,255,255,0.50)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact — email uses break-all so it never overflows */}
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.28em] mb-4"
                style={{ color: 'rgba(255,255,255,0.28)' }}>Contact</p>
              <div className="flex flex-col gap-3">
                <a href={`mailto:${contactData.email}`}
                  className="font-sans text-sm transition-all"
                  style={{ color: 'rgba(255,255,255,0.50)', wordBreak: 'break-all' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#38bdf8')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}>
                  {contactData.email}
                </a>
                <p className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.32)' }}>
                  {contactData.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="font-mono text-[0.60rem] uppercase tracking-[0.2em]"
            style={{ color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} Abderrahmane Charak
          </p>
          <p className="font-mono text-[0.60rem] uppercase tracking-[0.2em]"
            style={{ color: 'rgba(255,255,255,0.25)' }}>
            Designed &amp; built with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
