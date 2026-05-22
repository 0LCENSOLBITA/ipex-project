import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ClientHeader } from "@/components/ClientHeader";
import { useSubmission } from "@/lib/store";
import { api } from "@/lib/api";
import { ArrowLeft, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/submit/review")({
  component: ReviewPage,
});

function ReviewPage() {
  const s = useSubmission();
  const navigate = useNavigate();

  const [quote, setQuote] =
useState<any>(
s.quote || null
);
  const [buData, setBuData] = useState<any>(null);
  const [ptData, setPtData] = useState<any>(null);
const [submitting, setSubmitting] = useState(false);

  // 🔥 LOAD BU + PROJECT TYPE
  useEffect(() => {
    if (!s.buId || !s.projectType) {
      navigate({ to: "/submit/business-unit" });
      return;
    }

    api.getBusinessUnits().then((res) => {
      setBuData(res.find((b: any) => b._id === s.buId));
    });

    api.getProjectTypesByBU(s.buId).then((res) => {
      setPtData(res.find((p: any) => p._id === s.projectType));
    });
  }, [s.buId, s.projectType]);

  // 🔥 LOAD QUOTE
useEffect(() => {

if (s.quote) {
setQuote(s.quote);
return;
}

const storedQuote =
sessionStorage.getItem(
"quote"
);

if (storedQuote) {
setQuote(
JSON.parse(storedQuote)
);
}

}, [s.quote]);

  // 🔥 SAFE DEBUG
  useEffect(() => {
    console.log("Final Quote:", quote);
  }, [quote]);

  // 🔥 SUBMIT FUNCTION
  const submit = async () => {
    try {
      setSubmitting(true);
      let uploaded: any[] = [];

      if (s.attachments?.length > 0) {
        const files = s.attachments.map((f: any) => f.file);

       const resUpload =
  await api.uploadFiles(
    files
  );

const uploadedFiles =
  Array.isArray(
    resUpload
  )
    ? resUpload
    : [];

uploaded =
  uploadedFiles.map(
    (
      file:any,
      i:number
    ) => ({
      ...file,

      description:
        s.attachments[i]
          ?.description || "",
    })
  );
      }
const resolvedQuote =
  s.quote ||
  quote ||
  JSON.parse(
    sessionStorage.getItem("quote") || "null"
  );

const resolvedAiAnswers = s.aiAnswers || {};

const resolvedAttachments =
  uploaded.length > 0
    ? uploaded
    : s.attachments || [];

console.log("SENDING QUOTE:", resolvedQuote);
console.log("SENDING AI:", resolvedAiAnswers);
console.log("SENDING ATTACHMENTS:", resolvedAttachments);

      const res = await api.createSubmission({
        client: s.clientId,
        businessUnit: s.buId,
        projectType: s.projectType,

        data: {
          ...s.formData,
          title: s.title,
          description: s.description,
          audience: s.audience,
          budget: s.budget,
          deadline: s.deadline,
        },

        aiAnswers: resolvedAiAnswers,

        quote: resolvedQuote,

        attachments: resolvedAttachments,
      });

      console.log("SUBMISSION RESULT:", res);

      sessionStorage.setItem(
        "submissionNumber",
        res?.submissionNumber || ""
      );

      console.log("NAVIGATING TO CONFIRMATION");

      navigate({
        to: "/submit/confirmation",
        search: {
          submissionNumber:
            res?.submissionNumber ||
            sessionStorage.getItem("submissionNumber") ||
            "",
        },
      });

      setTimeout(() => {
        s.reset();
      }, 100);
    } catch (err) {
     setSubmitting(false);
      console.error("SUBMISSION FAILED:", err);
      alert("Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader step={{ current: 4, total: 4, label: "Review" }} />

      <main className="mx-auto max-w-5xl px-6 py-14">

        {/* BACK */}
        <Link
          to="/submit/details"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Edit details
        </Link>

        {/* HEADER */}
        <div className="mt-6">
          <div className="text-[11px] uppercase tracking-[0.18em] text-bronze">
            Step 04
          </div>

          <h1 className="mt-3 text-4xl font-light text-navy">
            Looks good?
          </h1>

          <p className="mt-3 text-muted-foreground">
            One last look before this lands with{" "}
            <span className="font-medium text-foreground">
             {
  buData
    ?.accountManagers?.[0]
    ?.name || "Account Manager"
}
            </span>.
          </p>
        </div>

        {/* CARD */}
        <div className="mt-10 rounded-xl border bg-card overflow-hidden">

          {/* ROUTING */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium mb-4">Routing</h3>

            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="text-muted-foreground">Business Unit</div>
              <div>{buData?.name}</div>

              <div className="text-muted-foreground">Project Type</div>
              <div>{ptData?.name}</div>

      <div className="text-muted-foreground">
  Account Manager
</div>

<div>
  {buData?.accountManagers?.[0]?.name || "TBD"}
</div>

              <div className="text-muted-foreground">Currency</div>
              <div>{buData?.currency || "—"}</div>
            </div>
          </div>

          {/* PROJECT */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium mb-4">Project</h3>

            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="text-muted-foreground">Title</div>
              <div>{s.title}</div>

              <div className="text-muted-foreground">Description</div>
              <div>{s.description}</div>

              <div className="text-muted-foreground">Audience</div>
              <div>{s.audience || "—"}</div>

              <div className="text-muted-foreground">Budget</div>
              <div>{s.budget || "—"}</div>

              <div className="text-muted-foreground">Deadline</div>
              <div>{s.deadline}</div>

              {/* 🔥 DYNAMIC FIELDS */}
              {s.formData && Object.keys(s.formData).length > 0 && (
                <>
                  <div className="col-span-2 mt-4 font-medium">Details</div>

                  {Object.entries(s.formData).map(([key, value]) => (
                    <div key={key} className="contents">
                      <div className="text-muted-foreground">{key}</div>
                      <div>{String(value)}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* FILES */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium mb-4">
              Files ({s.attachments?.length || 0})
            </h3>

            {s.attachments?.length > 0 ? (
              <div className="divide-y border rounded-md">
                {s.attachments.map((f: any, i: number) => (
                  <div key={i} className="px-4 py-3 text-sm">
                    <div className="font-medium">
                      {f.file?.name || "File"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {f.description || "—"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No files attached.</p>
            )}
          </div>

          {/* 🔥 QUOTE (CORRECT PLACE) */}
          {quote && (
            <div className="p-6 border-t bg-green-50">
              <h3 className="text-lg font-medium text-green-700">
                Estimated Cost
              </h3>

              <div className="text-3xl font-bold text-green-800 mt-2">
                ${Number(quote.price || 0).toLocaleString()}
              </div>

              {quote.reason && (
                <p className="text-sm text-muted-foreground mt-2">
                  {quote.reason}
                </p>
              )}

              {quote.breakdown?.length > 0 && (
  <div className="mt-6 space-y-2">
    {quote.breakdown.map((item: any, i: number) => (
      <div
        key={i}
        className="flex items-center justify-between border-b pb-2 text-sm"
      >
        <span>{item.label}</span>

        <span className="font-medium">
          ${Number(item.amount).toLocaleString()}
        </span>
      </div>
    ))}
  </div>
)}
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <div className="mt-10 flex justify-end">
        <button
  disabled={!quote || submitting}

  onClick={submit}

  className="
  bg-bronze
  px-6 py-3
  rounded-md
  text-white
  hover:opacity-90
  disabled:opacity-40
  disabled:cursor-not-allowed
  transition-all duration-200
  min-w-[220px]
  flex items-center justify-center gap-2
  "
>

  {submitting ? (
    <>
      <div
        className="
        w-4 h-4
        border-2 border-white/40
        border-t-white
        rounded-full
        animate-spin
        "
      />

      <span>
        Submitting...
      </span>
    </>
  ) : (
    "Submit project"
  )}

</button>
        </div>
      </main>
    </div>
  );
}