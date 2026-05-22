import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientHeader } from "@/components/ClientHeader";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IPEX Submission Portal — Submit a Project Request" },
      { name: "description", content: "A guided, single-window way to brief the IPEX marketing team. Structured. Fast. Routed to the right people." },
      { property: "og:title", content: "IPEX Submission Portal" },
      { property: "og:description", content: "Submit a project request to the IPEX marketing team in minutes." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <ClientHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-120 bg-linear-to-b from-ivory to-transparent" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-10 lg:pt-28">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                IPEX Marketing — Internal Portal
              </div>

              <h1 className="mt-8 font-display text-5xl font-light leading-[1.05] text-navy lg:text-7xl">
                Submit a project<br />
                <span className="italic text-navy-soft">with intention.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
                A guided, single-window brief that routes your request to the right business unit, the right account manager, and the right creative team — without the back-and-forth.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/submit/business-unit"
                  className="group inline-flex items-center gap-3 rounded-md bg-bronze px-6 py-3.5 text-sm font-medium text-bronze-foreground shadow-elevated transition-all hover:-translate-y-px hover:bg-bronze/90"
                >
                  Start submission
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a href="#process" className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
                  How it works
                </a>
              </div>

              <div className="mt-14 grid max-w-lg grid-cols-3 gap-8 border-t border-border pt-8">
                {[
                  { k: "12", l: "Business Units" },
                  { k: "24h", l: "First Response" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-2xl text-navy">{s.k}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

       <div className="lg:col-span-5 lg:pl-20 lg:pt-10">

  <div className="
  grid grid-cols-2 gap-4
  ">

    {[
      {
        title: "AI-reviewed briefs",
        desc: "Smart follow-up questions help complete requests faster.",
        bg: "bg-[#EEF4F1]",
      },
      {
        title: "Faster routing",
        desc: "Requests automatically reach the correct business unit.",
        bg: "bg-[#EEF1F5]",
      },
      {
        title: "File uploads",
        desc: "Attach screenshots, documents, and creative references.",
        bg: "bg-[#F2F3F7]",
      },
      {
        title: "Quote-ready submissions",
        desc: "Structured briefs reduce clarification cycles.",
        bg: "bg-[#F5F1F7]",
      },
    ].map((card) => (

      <div
        key={card.title}
        className={`
        ${card.bg}

        rounded-2xl
        p-6
        p-5
min-h-[180px]

        transition-all duration-300
        hover:-translate-y-1

        flex flex-col
        justify-between
        `}
      >

        <div>

          <div className="
          text-xl leading-tight
          font-semibold text-navy
          ">
            {card.title}
          </div>

          <div className="
          mt-4 text-sm leading-relaxed
          text-muted-foreground
          ">
            {card.desc}
          </div>

        </div>

        <div className="
        flex justify-end
        ">

          <div className="
          h-2 w-2 rounded-full
          bg-navy/70
          " />

        </div>

      </div>
    ))}

  </div>

</div>
</div>

          <div id="process" className="mt-32 grid gap-10 lg:grid-cols-3">
            {[
              { n: "01", t: "Choose your unit", d: "Pick the IPEX business unit your project belongs to. We'll handle the routing." },
              { n: "02", t: "Tell us what you need", d: "A short, guided brief — only the questions that matter for your project type." },
              { n: "03", t: "Submit & track", d: "Your account manager is notified instantly. You'll receive a submission ID to follow it." },
            ].map((s) => (
              <div key={s.n} className="border-t border-border pt-6">
                <div className="font-display text-sm tracking-widest text-bronze">{s.n}</div>
                <h3 className="mt-3 font-display text-2xl text-navy">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-xs text-muted-foreground lg:px-10">
          <span>© 2026 IPEX. Internal use only.</span>
          <span>Powered by STAAK</span>
        </div>
      </footer>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-border pb-3 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
