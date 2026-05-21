import { useEffect, useState } from 'react';
import { featuredWork, services, contactData } from '@/lib/content';

const STORAGE_KEY = 'portfolioo-admin-content';

const defaultAdminState = {
  headline: 'Craft premium brand and digital experiences with cinematic precision.',
  intro: 'Edit projects, services, and contact details in a lightweight studio dashboard.',
  services: services.map((service) => ({ title: service.title, detail: service.detail })),
  contact: { ...contactData }
};

export default function Admin() {
  const [data, setData] = useState(defaultAdminState);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  const projects = featuredWork;

  const handleSave = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <main className="relative overflow-hidden pt-28">
      <section className="container py-24">
        <div className="mb-12 max-w-4xl">
          <p className="text-sm uppercase tracking-[0.35em] text-white/50">Studio dashboard</p>
          <h1 className="mt-4 text-[clamp(3.8rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.05em]">A lightweight editing interface for portfolio content.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">Update placeholder storytelling, service details, and contact essentials with a simple local CMS workflow.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-10">
            <div className="glow-card rounded-[2rem] p-10">
              <h2 className="text-3xl font-semibold">Hero content</h2>
              <label className="mt-8 block text-sm uppercase tracking-[0.35em] text-white/50">Headline</label>
              <input value={data.headline} onChange={(event) => setData((prev) => ({ ...prev, headline: event.target.value }))} className="mt-4 w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/30" />
              <label className="mt-8 block text-sm uppercase tracking-[0.35em] text-white/50">Intro text</label>
              <textarea value={data.intro} onChange={(event) => setData((prev) => ({ ...prev, intro: event.target.value }))} rows={5} className="mt-4 w-full rounded-[2rem] border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/30" />
            </div>

            <div className="glow-card rounded-[2rem] p-10">
              <h2 className="text-3xl font-semibold">Contacts</h2>
              <label className="mt-8 block text-sm uppercase tracking-[0.35em] text-white/50">Email</label>
              <input value={data.contact.email} onChange={(event) => setData((prev) => ({ ...prev, contact: { ...prev.contact, email: event.target.value } }))} className="mt-4 w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/30" />
              <label className="mt-8 block text-sm uppercase tracking-[0.35em] text-white/50">Location</label>
              <input value={data.contact.location} onChange={(event) => setData((prev) => ({ ...prev, contact: { ...prev.contact, location: event.target.value } }))} className="mt-4 w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/30" />
              <label className="mt-8 block text-sm uppercase tracking-[0.35em] text-white/50">Social links</label>
              <input value={data.contact.socials.join(', ')} onChange={(event) => setData((prev) => ({ ...prev, contact: { ...prev.contact, socials: event.target.value.split(',').map((item) => item.trim()) } }))} className="mt-4 w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/30" />
            </div>
          </div>

          <aside className="space-y-8">
            <div className="glow-card rounded-[2rem] p-10">
              <h2 className="text-3xl font-semibold">Active projects</h2>
              <div className="mt-8 space-y-6">
                {projects.map((project) => (
                  <div key={project.slug} className="rounded-3xl border border-white/10 bg-black/10 p-6">
                    <p className="text-sm uppercase tracking-[0.35em] text-white/50">{project.category}</p>
                    <h3 className="mt-4 text-xl font-semibold">{project.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/70">{project.summary}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleSave} className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-10 py-4 text-sm uppercase tracking-[0.3em] transition hover:border-white/40 hover:bg-white/10">
              Save changes
            </button>
            {saved ? <p className="text-sm text-emerald-300">Content saved locally.</p> : null}
          </aside>
        </div>
      </section>
    </main>
  );
}
