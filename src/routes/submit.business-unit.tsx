import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ClientHeader } from "@/components/ClientHeader";
import { useSubmission } from "@/lib/store";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, MapPin } from "lucide-react";

export const Route = createFileRoute("/submit/business-unit")({
  component: BUPage,
});

function BUPage() {
  const { buId, setBu, setClient } = useSubmission();
  const navigate = useNavigate();

  const [businessUnits, setBusinessUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const buRes = await api.getBusinessUnits();
        setBusinessUnits(buRes || []);

        const clientRes = await api.getClients();
        if (clientRes?.length > 0) {
          setClient(clientRes[0]._id);
        }
      } catch (err) {
        console.error("BU LOAD ERROR:", err);
        setBusinessUnits([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="p-10 text-sm">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader step={{ current: 1, total: 4, label: "Business Unit" }} />

      <main className="mx-auto max-w-7xl px-6 py-14 lg:px-10">

        {/* HEADER */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="flex items-center gap-1.5 hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </div>

        <div className="mt-6 max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.18em] text-bronze">
            Step 01
          </div>

          <h1 className="mt-3 font-display text-4xl text-navy">
            Which business unit is this for?
          </h1>

          <p className="mt-3 text-muted-foreground">
            We’ll route your request to the right account manager.
          </p>
        </div>

        {/* GRID */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businessUnits.map((bu) => {
            const selected = buId === bu._id;

            return (
              <button
                key={bu._id}
                onClick={() => setBu(bu._id)}
                className={`group relative flex flex-col items-start rounded-lg border p-5 text-left transition-all ${
                  selected
                    ? "border-navy bg-navy text-white shadow-elevated"
                    : "border-border bg-card hover:border-navy/40 hover:shadow-card"
                }`}
              >
                <div className="flex w-full justify-between items-start">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-md ${
                      selected ? "bg-bronze" : "bg-secondary"
                    }`}
                  >
                    {bu.name?.charAt(0)}
                  </div>

                  {selected && <Check className="h-4 w-4" />}
                </div>

                <h3 className="mt-5 font-display text-lg">
                  {bu.name}
                </h3>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {bu.region || "—"}
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  {bu.currency || "—"}
                </div>
              </button>
            );
          })}
        </div>

        {/* CONTINUE */}
        <div className="mt-12 flex justify-end">
          <button
            disabled={!buId}
            onClick={() => navigate({ to: "/submit/project-type" })}
            className="bg-bronze px-6 py-3 rounded-md text-white disabled:opacity-30"
          >
            Continue
          </button>
        </div>

      </main>
    </div>
  );
}