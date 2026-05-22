import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ClientHeader } from "@/components/ClientHeader";
import { useSubmission } from "@/lib/store";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Film,
  Image,
  FileText,
  Hash,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/submit/project-type")({
  component: ProjectTypePage,
});

const getProjectTypeIcon = (name: string) => {
  const iconProps = { size: 20, strokeWidth: 1.5 };

  const n = name.toLowerCase();

  if (n.includes("video")) return <Film {...iconProps} />;
  if (n.includes("banner")) return <Image {...iconProps} />;
  if (n.includes("print")) return <FileText {...iconProps} />;
  if (n.includes("social")) return <Hash {...iconProps} />;
  if (n.includes("other")) return <Sparkles {...iconProps} />;

  return (
    <span className="font-semibold text-sm">
      {name?.charAt(0).toUpperCase()}
    </span>
  );
};

function ProjectTypePage() {
  const { buId, projectType, setType } = useSubmission();
  const navigate = useNavigate();

  const [projectTypes, setProjectTypes] = useState<any[]>([]);
  const [buData, setBuData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buId) {
      navigate({ to: "/submit/business-unit" });
      return;
    }

    const load = async () => {
      try {
        const [ptRes, buList] = await Promise.all([
          api.getProjectTypesByBU(buId),
          api.getBusinessUnits(),
        ]);

        console.log("PT RES:", ptRes); 
        const selectedBU = buList.find((b: any) => b._id === buId);

        setProjectTypes(ptRes);
        setBuData(selectedBU);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    load();
  }, [buId, navigate]);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader step={{ current: 2, total: 4, label: "Project Type" }} />

      <main className="mx-auto max-w-6xl px-6 py-14">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <Link
              to="/submit/business-unit"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <h1 className="mt-4 font-display text-4xl text-navy">
              What kind of project?
            </h1>

            <p className="mt-2 text-muted-foreground">
              Select the type of work so we can route it correctly.
            </p>
          </div>

          {/* ROUTING PANEL */}
          <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              Routing to
            </div>
           <div className="font-medium text-navy">
  {buData?.name} •{" "}
  {buData?.accountManagers?.[0]?.name || "TBD"}
</div>
          </div>
        </div>

        {/* PROJECT TYPES */}
 <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {[...projectTypes]
    .sort((a, b) => {
      const getIndex = (name: string) => {
        const n = name.toLowerCase();

        if (n.includes("video")) return 0;
        if (n.includes("banner")) return 1;
        if (n.includes("print")) return 2;
        if (n.includes("social")) return 3;
        if (n.includes("other")) return 4;

        return 999;
      };

      return getIndex(a.name) - getIndex(b.name);
    })
    .map((pt) => {
      const selected = String(projectType) === String(pt._id);

      return (
        <button
          key={pt._id}
          onClick={() => setType(pt._id)}
          className={`group flex flex-col items-start rounded-lg border p-5 text-left transition-all ${
            selected
              ? "border-navy bg-navy text-primary-foreground shadow-elevated"
              : "border-border bg-card hover:border-navy/40 hover:shadow-card"
          }`}
        >
          <div className="flex w-full items-start justify-between">
            <div className={`flex h-10 w-10 items-center justify-center rounded-md ${
              selected
                ? "bg-bronze text-bronze-foreground"
                : "bg-secondary text-navy"
            }`}>
              {getProjectTypeIcon(pt.name)}
            </div>

            <span className="text-xs">
              {selected ? "Selected →" : "Choose →"}
            </span>
          </div>

          <h3 className="mt-4 font-display text-lg">{pt.name}</h3>

          <p className="mt-1 text-sm opacity-70">
            {pt.description}
          </p>
        </button>
      );
    })}
</div>

        {/* CONTINUE BUTTON */}
        <div className="mt-12 flex justify-end">
          <button
            disabled={!projectType}
            onClick={() => navigate({ to: "/submit/details" })}
            className="flex items-center gap-2 rounded-md bg-bronze px-6 py-3 text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}