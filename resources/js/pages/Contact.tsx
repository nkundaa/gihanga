import { useState } from "react";
import { CheckCircle2, Globe, Mail, MapPinned, Phone } from "lucide-react";
import { MagneticButton } from "../components/ui";
import Seo from "../components/Seo";

const faqs = [
  { q: "How do verified stores get approved?", a: "Each boutique is personally reviewed by the GIHANGA team for authenticity, quality of catalog and service commitment before listing." },
  { q: "Is GIHANGA available outside Kigali?", a: "Phase one is Kigali-first. Secondary cities are on the roadmap for 2027." },
  { q: "How does payment work?", a: "Pay the full item price via mobile money directly to the store person upon delivery. A transport fee is automatically calculated and added based on your delivery location." },
  { q: "How fast is delivery?", a: "Kigali deliveries are targeted within 24 to 48 hours with live rider tracking." },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="overflow-x-hidden bg-[#F8F9FA]">
      <Seo title="Contact - Gihanga Market" path="/contact" description="Get in touch with the GIHANGA team. We're here to help with your fashion marketplace experience in Rwanda." />
      <section className="relative overflow-hidden bg-[#111111] px-4 pb-12 pt-36 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-44">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(191,215,241,0.18),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,213,234,0.16),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-[#BFD7F1] sm:text-xs sm:tracking-[0.42em]">Contact</p>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(1.5rem,7vw,8rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] sm:mt-6">
            Let's <span className="font-editorial normal-case text-[#BFD7F1]">talk</span><br /><span className="text-stroke text-white">fashion</span>.
          </h1>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div data-reveal>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">Send a message</p>
            <h2 className="mt-4 font-display text-3xl font-black tracking-[-0.05em] sm:text-4xl">Questions, partnerships, press.</h2>

            {sent ? (
              <div className="mt-10 flex items-center gap-4 rounded-[2rem] border border-black/[0.08] bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,0.06)]">
                <CheckCircle2 className="h-10 w-10 text-[#BFD7F1]" />
                <div>
                  <p className="font-display text-2xl font-black tracking-[-0.04em]">Message received.</p>
                  <p className="mt-1 text-sm text-[#666666]">Our team will reply within one business day.</p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="mt-10 grid gap-5 rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)] sm:p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" name="name" required />
                  <Field label="Email" name="email" type="email" required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Topic</label>
                  <select className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" defaultValue="general">
                    <option value="general">General question</option>
                    <option value="vendor">Open a store</option>
                    <option value="press">Press & media</option>
                    <option value="support">Customer support</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]" htmlFor="msg">Message</label>
                  <textarea id="msg" name="message" rows={5} required autoComplete="off" className="min-h-12 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" placeholder="Tell us how we can help..." />
                </div>
                <MagneticButton type="submit" variant="berry" className="min-h-12 w-full sm:w-auto sm:justify-self-start px-6 py-3 text-sm">Send message</MagneticButton>
              </form>
            )}
          </div>

          <aside data-reveal className="space-y-5">
            <InfoCard icon={MapPinned} title="Visit us" lines={["GIHANGA HQ", "Kicukiro, Kigali, Rwanda"]} />
            <InfoCard icon={Mail} title="Email" lines={["gihangamarket@gmail.com"]} />
            <InfoCard icon={Phone} title="Phone" lines={["+250 799 576 704"]} />
            <InfoCard icon={Globe} title="Social" lines={["instagram.com/gihangamarket"]} link="https://www.instagram.com/gihangamarket/" />
          </aside>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#BFD7F1]">FAQ</p>
          <h2 className="mt-4 font-display text-[clamp(1.5rem,4.5vw,4.6rem)] font-black leading-[0.95] tracking-[-0.05em]">Frequently <span className="font-editorial text-[#BFD7F1]">asked</span>.</h2>
          <div className="mt-10 divide-y divide-black/[0.08] rounded-[2rem] border border-black/[0.08] bg-[#F8F9FA]">
            {faqs.map((f, i) => (
              <button key={f.q} type="button" onClick={() => setOpen(open === i ? null : i)} className="flex w-full flex-col items-start gap-3 p-6 text-left sm:p-8">
                <span className="flex w-full items-center justify-between gap-4">
                  <span className="font-display text-lg font-black tracking-[-0.03em] sm:text-xl">{f.q}</span>
                  <span className="text-2xl text-[#BFD7F1]">{open === i ? "−" : "+"}</span>
                </span>
                {open === i ? <span className="text-sm leading-7 text-[#666666]">{f.a}</span> : null}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">{label}</label>
      <input id={name} name={name} type={type} required={required} autoComplete={name === "email" ? "email" : name === "name" ? "name" : "off"} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#BFD7F1]" />
    </div>
  );
}

function InfoCard({ icon: Icon, title, lines, link }: { icon: typeof Mail; title: string; lines: string[]; link?: string }) {
  return (
    <div className="flex items-start gap-4 rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.05)]">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#111111] text-[#BFD7F1]">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <div>
        <p className="font-display text-lg font-black tracking-[-0.03em]">{title}</p>
        {lines.map((l) =>
          link ? (
            <a key={l} href={link} target="_blank" rel="noopener noreferrer" className="block py-1 text-sm text-[#666666] transition hover:text-[#BFD7F1]">{l}</a>
          ) : (
            <p key={l} className="text-sm text-[#666666]">{l}</p>
          )
        )}
      </div>
    </div>
  );
}
