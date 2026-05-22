import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ClientHeader } from "@/components/ClientHeader";
import { useSubmission } from "@/lib/store";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
export const Route = createFileRoute("/submit/details")({
  component: DetailsPage,
});

function DetailsPage() {
  const s = useSubmission();
  const navigate = useNavigate();
const [aiQuestions, setAiQuestions] = useState<string[]>([]);
const aiAnswers = useSubmission(
  (s) => s.aiAnswers || {}
);

const setAiAnswers = useSubmission(
  (s) => s.setAiAnswers
);
const [aiPassed, setAiPassed] = useState(false);
const [aiLoading, setAiLoading] = useState(false);
const [aiAttempts, setAiAttempts] = useState(0);
const MAX_ATTEMPTS = 3;
const [aiForcedPass, setAiForcedPass] = useState(false);
const [quote, setQuote] = useState<any>(null);
const [quoteLoading, setQuoteLoading] = useState(false);
  const [buData, setBuData] = useState<any>(null);
  const [ptData, setPtData] = useState<any>(null);
const formData = useSubmission((s) => s.formData);
const setFormData = useSubmission((s) => s.setFormData);
const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentDesc, setCurrentDesc] = useState("");

  useEffect(() => {
    if (s.buId) {
      api.getBusinessUnits().then((res) => {
        setBuData(res.find((b: any) => b._id === s.buId));
      });

api.getProjectTypesByBU(s.buId).then((res) => {
  const pt = res.find((p: any) => String(p._id) === String(s.projectType));
  console.log("PROJECT TYPES:", res);
console.log("SELECTED PT:", s.projectType);
  setPtData(pt);

if (pt?.fields && Object.keys(formData).length === 0) {
  const initial: any = {};
  pt.fields.forEach((f: any) => {
    initial[f.name] = "";
  });
  setFormData(initial);
}
});
    }
  }, [s.buId, s.projectType]);
const runValidation = async () => {
if (aiAttempts >= MAX_ATTEMPTS) {
  setAiForcedPass(true);
  setAiPassed(true);

  setQuoteLoading(true);

  try {
    const mergedData = {
      ...formData,
      ...aiAnswers,
      title: s.title,
      description: s.description,
      audience: s.audience,
      budget: s.budget,
      deadline: s.deadline,
    };

    const quoteRes = await api.generateQuote({
      projectType: ptData?.name || "",
      data: mergedData,
    });

  setQuote(
quoteRes
);

sessionStorage.setItem(
"quote",
JSON.stringify(
quoteRes
)
);

s.patch({

quote:
quoteRes,

aiAnswers:
aiAnswers,

});

setQuoteLoading(
false
);
  } catch (err) {
    console.error("FORCED QUOTE ERROR:", err);
  }

  setQuoteLoading(false);

  return;
}
  if (!ptData) return;
  setAiLoading(true);

const mergedData = {
  ...formData,
  ...aiAnswers,

  title: s.title,
  description: s.description,
  audience: s.audience,
  budget: s.budget,
  deadline: s.deadline,
};

let res;

try {
  res = await api.validateBrief({
    projectType: ptData?.name || "",
    data: mergedData,
  });
} catch (err) {
  console.error("VALIDATION ERROR:", err);

  setAiPassed(false);
  setAiQuestions([]);
  setAiAttempts((prev) => prev + 1);

  setAiLoading(false);
  return;
}

  if (res.pass) {
    setAiPassed(true);
    setAiQuestions([]);
      setQuoteLoading(true);

let quoteRes;

try {
  quoteRes = await api.generateQuote({
    projectType: ptData?.name || "",
    data: mergedData,
  });
} catch (err) {
  console.error("QUOTE ERROR", err);
  setQuote(null);
  setQuoteLoading(false);
  return;
}

setQuote(quoteRes);

sessionStorage.setItem(
"quote",
JSON.stringify(
quoteRes
)
);

s.patch({

quote:
quoteRes,

aiAnswers:
aiAnswers,

});

setQuoteLoading(
false
);
  } else {
     setAiPassed(false);

  const nextQuestions = Array.isArray(res?.questions)
  ? res.questions
  : [];

setAiQuestions(nextQuestions);

  setAiAttempts((prev) => prev + 1);
  }

  setAiLoading(false);
};
  const aiPrompt = useMemo(() => {
    if (!s.description) return null;
    if (s.description.length < 40) {
      return "A bit more detail will help us scope this accurately.";
    }
    return null;
  }, [s.description]);

const dynamicValid =
  ptData?.fields?.every((f: any) => {
    if (!f.required) return true;
    return formData[f.name]?.toString().trim().length > 0;
  }) ?? true;

const valid =
  s.title.trim().length > 0 &&
  s.description.trim().length >= 20 &&
  dynamicValid;
useEffect(() => {
  setAiPassed(false);
  setAiAttempts(0);
  setAiForcedPass(false);
  setAiAnswers({});
setAiQuestions([]);
sessionStorage.removeItem("quote");
setQuote(null);
}, [
  s.title,
  s.description,
  s.audience,
  s.budget,
  s.deadline,
  formData,
]);

if (!buData || !ptData) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader step={{ current: 3, total: 4, label: "Project Details" }} />

      <main className="mx-auto max-w-6xl px-6 py-14">

        {/* BACK */}
        <Link
          to="/submit/project-type"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>

        {/* HEADER */}
        <div className="mt-6">
          <div className="text-[11px] uppercase tracking-[0.18em] text-bronze">
            Step 03
          </div>

          <h1 className="mt-3 text-4xl font-light text-navy">
            Tell us about{" "}
            <span className="italic">{ptData.name.toLowerCase()}</span>.
          </h1>

          <p className="mt-3 text-muted-foreground">
            Only what we need. Your account manager{" "}
            <span className="font-medium text-foreground">
             {
  buData
    ?.accountManagers?.[0]
    ?.name || "TBD"
}
            </span>{" "}
            will follow up if anything's missing.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-10 mt-10">

          {/* LEFT */}
          <div className="col-span-2 space-y-6">

            {/* TITLE */}
            <div>
              <label className="text-sm text-muted-foreground">
                Project title
              </label>
              <input
                value={s.title}
                onChange={(e) => s.patch({ title: e.target.value })}
                placeholder="e.g. Q2 Trade Show Banner Set"
                className="w-full border rounded-md p-3 mt-1 bg-card"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <label>Brief description</label>
                <span>What needs to be created and why?</span>
              </div>

              <textarea
                value={s.description}
                onChange={(e) => s.patch({ description: e.target.value })}
                placeholder="Describe the project, its goal, and any context that matters."
                className="w-full border rounded-md p-3 mt-1 h-32 bg-card"
              />
            </div>
            

            {aiPrompt && (
              <div className="p-3 border rounded bg-sage/10 text-sm">
                {aiPrompt}
              </div>
            )}

            {/* AUDIENCE + BUDGET */}
         <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="text-sm text-muted-foreground">
      Audience / Target Market
    </label>
    <input
      placeholder="e.g. Distributors, EU"
      className="border p-3 rounded-md w-full mt-1 bg-card"
      value={s.audience || ""}
     onChange={(e) =>
  s.patch({ audience: e.target.value })
}
    />
  </div>

  <div>
    <label className="text-sm text-muted-foreground">
      Budget (Estimate)
    </label>
    <input
      placeholder="e.g. 25,000 (USD)"
      className="border p-3 rounded-md w-full mt-1 bg-card"
      value={s.budget || ""}
     onChange={(e) =>
  s.patch({ budget: e.target.value })
}
    />
  </div>
</div>
{/* DEADLINE DATE PICKER */}
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <label className="text-sm text-muted-foreground">
      Deadline
    </label>

    <span className="text-sm text-muted-foreground">
      When do you need this delivered?
    </span>
  </div>

  <Popover>
    <PopoverTrigger asChild>
      <button
        type="button"
        className="w-full border rounded-md p-3 bg-card flex items-center justify-between text-left"
      >
        {s.deadline ? (
          format(new Date(s.deadline), "dd/MM/yyyy")
        ) : (
          <span className="text-muted-foreground">
            dd/mm/yyyy
          </span>
        )}

        <CalendarIcon className="h-4 w-4 opacity-60" />
      </button>
    </PopoverTrigger>

    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={
          s.deadline ? new Date(s.deadline) : undefined
        }
        onSelect={(date) => {
          if (date) {
            s.patch({
              deadline: date.toISOString(),
            });
          }
        }}
        initialFocus
      />
    </PopoverContent>
  </Popover>
</div>
            {/* DEADLINE */}
{ptData?.fields?.length > 0 && (
  <div className="space-y-4">
    {ptData.fields.map((f: any) => (
      <div key={f.name}>
     <label className="text-sm text-muted-foreground">
  {f.label}
  {f.required && <span className="text-red-500 ml-1">*</span>}
</label>

    {f.type === "textarea" ? (
  <textarea
    className="border p-3 rounded-md w-full mt-1 bg-card"
    value={formData[f.name] || ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        [f.name]: e.target.value,
      })
    }
  />
) : f.type === "number" ? (
  <input
    type="number"
    className="border p-3 rounded-md w-full mt-1 bg-card"
    value={formData[f.name] || ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        [f.name]: e.target.value,
      })
    }
  />
) : f.type === "select" ? (
  <select
    className="border p-3 rounded-md w-full mt-1 bg-card"
    value={formData[f.name] || ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        [f.name]: e.target.value,
      })
    }
  >
    <option value="">Select...</option>
    {(f.options || []).map((opt: string, i: number) => (
      <option key={i} value={opt}>
        {opt}
      </option>
    ))}
  </select>
) : (
  <input
    type="text"
    className="border p-3 rounded-md w-full mt-1 bg-card"
    value={formData[f.name] || ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        [f.name]: e.target.value,
      })
    }
  />
)}
      </div>
    ))}
  </div>
)}
{aiAttempts > 0 && aiAttempts < MAX_ATTEMPTS && (
  <div className="mt-4 text-sm text-yellow-600">
    Attempt {aiAttempts} of {MAX_ATTEMPTS}
  </div>
)}

{aiForcedPass && (
  <div className="mt-4 text-sm text-orange-600">
    You can proceed, but some details may be incomplete.
  </div>
)}
{aiQuestions?.length > 0 && (
  <div className="mt-6 space-y-4 border p-4 rounded-md">
    <h3 className="font-semibold">We need a bit more detail</h3>

    {aiQuestions.map((q, i) => (
      <div key={i}>
        <label className="text-sm">{q}</label>
     <input
  className="border p-2 w-full mt-1"
  value={aiAnswers[q] || ""}
  onChange={(e) =>
    setAiAnswers({
      ...aiAnswers,
      [q]: e.target.value,
    })
  }
/>
      </div>
    ))}
  </div>
)}

            {/* FILES */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Reference files</span>
                <span>Add a short descriptor for each</span>
              </div>

             <div className="border rounded-lg p-4 space-y-3">

  {(s.attachments || []).map((f, i) => (
    <div
      key={i}
      className="flex items-center justify-between border rounded-md p-3"
    >
      <div>
        <div className="font-medium text-sm">
          {f.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {f.description}
        </div>
      </div>

      <button
        onClick={() => {
          const updated = s.attachments.filter((_, idx) => idx !== i);
          s.patch({ attachments: updated });
        }}
        className="text-muted-foreground hover:text-red-500"
      >
        ✕
      </button>
    </div>
  ))}

  <div className="flex gap-2">
 <input
  ref={fileInputRef}
  type="file"
  onChange={(e) =>
    setCurrentFile(e.target.files?.[0] || null)
  }
  className="border p-2 rounded-md w-1/3"
/>

    <input
      value={currentDesc}
      onChange={(e) => setCurrentDesc(e.target.value)}
      placeholder="What's in this file?"
      className="border p-2 rounded-md flex-1"
    />

    <button
      onClick={() => {
        if (!currentFile || !currentDesc) return;

        const updated = [
          ...(s.attachments || []),
          {
  file: currentFile,
  name: currentFile.name,
  description: currentDesc,
}
        ];

        s.patch({ attachments: updated });

        setCurrentFile(null);
        setCurrentDesc("");
        if (fileInputRef.current) {
  fileInputRef.current.value = "";
}
      }}
      className="bg-navy text-white px-4 rounded-md"
    >
      Add
    </button>
  </div>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="border rounded-lg p-6 h-fit bg-card">
            <div className="text-xs uppercase text-muted-foreground mb-4">
              Routing
            </div>

            <div className="space-y-3 text-sm">
              <div><b>Business Unit:</b> {buData.name}</div>
              <div><b>Project Type:</b> {ptData.name}</div>
            <div>
  <b>Account Manager:</b>{" "}

  {
    buData
      ?.accountManagers?.[0]
      ?.name || "TBD"
  }
</div>
              <div><b>Currency:</b> {buData.currency}</div>
              <div><b>Region:</b> {buData.region}</div>
            </div>

            <div className="mt-6 text-xs text-muted-foreground border-t pt-4">
              We've pre-filled what we know about your unit. You'll review everything in the next step.
            </div>
          </div>
        </div>
        {quoteLoading && (
  <div className="mt-6 text-sm text-muted-foreground">
    Generating estimate...
  </div>
)}
{quote && (
  <div className="mt-8 border rounded-lg p-6 bg-card space-y-3">
    <div className="text-sm text-muted-foreground">Estimated Quote</div>

{quote?.price && (
  <div className="text-2xl font-semibold text-navy">
    ${Number(quote.price).toLocaleString()}
  </div>
)}

    <div className="text-sm text-muted-foreground">
      {quote.reason}
    </div>

  {quote.breakdown?.length > 0 && (
  <div className="space-y-2">
    {quote.breakdown.map((b: any, i: number) => (
      <div
        key={i}
        className="flex justify-between text-sm border-b pb-1"
      >
        <span>{b.label}</span>
        <span>${b.amount}</span>
      </div>
    ))}
  </div>
)}
  </div>
)}
        {/* BUTTON */}
        <div className="sticky bottom-6 mt-12 flex justify-end">
       <button
disabled={
  !valid ||
  aiLoading ||
  (aiPassed && (quoteLoading || !quote))
}
 onClick={async () => {
  if (!aiPassed) {
    await runValidation();
    return;
  }

  // 🚨 BLOCK if quote not ready
  if (!quote) {
    return;
  }

  navigate({ to: "/submit/review" });
}}
  className="bg-bronze px-6 py-3 rounded-md text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
>
  {aiLoading
    ? "Checking..."
    : aiPassed
    ? "Review submission"
    : "Validate & Continue"}

  <ArrowRight className="h-4 w-4" />
</button>
        </div>

      </main>
    </div>
  );
}