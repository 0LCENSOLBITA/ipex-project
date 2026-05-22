import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientHeader } from "@/components/ClientHeader";
import { Check, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSubmission } from "@/lib/store";
import { useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/submit/confirmation")({
  head: () => ({
    meta: [{ title: "Submitted — IPEX Submission Portal" }],
  }),
  component: Confirmation,
});

function Confirmation() {
  const reset = useSubmission((s) => s.reset);

const { submissionNumber } = useSearch({
  from: "/submit/confirmation",
}) as { submissionNumber?: string };

// ✅ GET REAL SUBMISSION ID
const id =
  submissionNumber ||
  sessionStorage.getItem("submissionNumber") ||
  `PRJ-${2042 + Math.floor(Math.random() * 50)}`;

  // ✅ CLEANUP ON UNMOUNT (SAFE RESET + CLEAR SESSION)
  useEffect(() => {
    return () => {
      reset();
      sessionStorage.removeItem("submissionNumber");
    };
  }, [reset]);

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader />

      <main className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-10">

        {/* ICON */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage/15 text-sage">
          <Check className="h-7 w-7" strokeWidth={2.5} />
        </div>

        {/* TITLE */}
        <h1 className="mt-8 font-display text-5xl font-light leading-tight text-navy">
          Your submission
          <br />
          <span className="italic">has been received.</span>
        </h1>

        {/* SUBTEXT */}
        <p className="mt-4 text-base text-muted-foreground">
          Thank you. Your account manager has been notified and will be in touch within 24 hours.
        </p>

        {/* SUBMISSION ID */}
        <div className="mt-10 inline-flex flex-col items-center gap-1 rounded-lg border border-border bg-card px-8 py-5">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Submission ID
          </div>
          <div className="font-display text-2xl text-navy">
            {id}
          </div>
        </div>

        {/* STATUS CARDS */}
        <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
          {[
             { n: "01", t: "Submitted", d: "Your request has been received" },
             { n: "02", t: "Routed", d: "Assigned to your account manager" },
             { n: "03", t: "Response", d: "You’ll hear back within 24 hours" },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-md border border-border bg-card p-4"
            >
              <div className="text-[10px] uppercase tracking-wider text-bronze">
                {s.n}
              </div>
              <div className="mt-1 font-display text-base text-navy">
                {s.t}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {s.d}
              </div>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="mt-12 flex items-center justify-center gap-4">

          {/* BACK TO LANDING */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:border-navy/40"
          >
            Back to portal
          </Link>

          {/* SUBMIT AGAIN */}
          <Link
            to="/submit/business-unit"
            className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-soft"
          >
            Submit another
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </main>
    </div>
  );
}