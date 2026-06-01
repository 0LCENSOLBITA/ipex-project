import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SubmissionDetailsModal from "@/routes/admin/SubmissionDetailsModal";
import { API_URL as BASE_URL } from "@/lib/config";

export const Route = createFileRoute(
  "/admin/submissions"
)({
  component: AdminSubmissions,
});

function AdminSubmissions() {

  const [submissions, setSubmissions] =
    useState<any[]>([]);

  const [search, setSearch] = useState("");
const [selectedSubmission, setSelectedSubmission] =
  useState<any | null>(null);
const loadSubmissions = async () => {
  try {

    const res = await fetch(
      `${BASE_URL}/submissions`
    );

    const data =
      await res.json();

    console.log(
      "SUBMISSION API:",
      data
    );

    setSubmissions(
      data || []
    );

  } catch {

    toast.error(
      "Failed to load submissions"
    );

  }
};

  useEffect(() => {
    loadSubmissions();
  }, []);

  const updateStatus = async (
    id: string,
    status: string
  ) => {
    try {

      await fetch(
  `${BASE_URL}/submissions/${id}/status`,
        {
       method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      setSubmissions((prev) =>
        prev.map((s) =>
          s._id === id
            ? { ...s, status }
            : s
        )
      );

      toast.success(
        "Status updated"
      );

    } catch {
      toast.error(
        "Failed to update status"
      );
    }
  };

  const filtered = submissions.filter(
    (s) => {

      const q = search.toLowerCase();

      return (
        s.submissionNumber
          ?.toLowerCase()
          .includes(q) ||

        s.data?.title
          ?.toLowerCase()
          .includes(q) ||

        s.status
          ?.toLowerCase()
          .includes(q)
      );
    }
  );

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-display text-navy">
          Submissions
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Manage project submissions,
          statuses, and quotes.
        </p>

        <div className="mt-6">
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search submissions..."
            className="border rounded-xl px-4 py-3 w-full max-w-md bg-white"
          />
        </div>
      </div>

      <div className="border rounded-2xl overflow-hidden bg-white">

        <table className="w-full">

          <thead className="bg-neutral-50 border-b">

            <tr className="text-left text-sm">

              <th className="p-4">
                Submission
              </th>

              <th className="p-4">
                Project
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Quote
              </th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((submission) => (

          <tr
  key={submission._id}
  title="Click to view submission details"
 onClick={() => {
  console.log("CLICKED", submission);

  setSelectedSubmission(submission);
}}
  className="
border-b
hover:bg-blue-50
hover:shadow-sm
transition-all
duration-200
cursor-pointer
group
"
>

                <td className="p-4">

                  <div className="font-mono text-xs text-muted-foreground">
                    {submission.submissionNumber}
                  </div>

                </td>

                <td className="p-4">

               <div className="font-medium group-hover:text-blue-700 transition">
  {submission.data?.title ||
    "Untitled"}
</div>

                  <div className="text-xs text-muted-foreground mt-1">
                    {submission.projectType?.name}
                  </div>

                </td>

                <td className="p-4">

                <select
  onClick={(e) => e.stopPropagation()}
  value={
    submission.status
  }

                    onChange={(e) =>
                      updateStatus(
                        submission._id,
                        e.target.value
                      )
                    }

                    className={`
                      px-3 py-1 rounded-full text-xs font-medium border outline-none transition

                      ${
                        submission.status ===
                        "New"
                          ? "bg-blue-100 text-blue-700 border-blue-200"

                        : submission.status ===
                          "Received"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"

                        : submission.status ===
                          "Quoted"
                          ? "bg-purple-100 text-purple-700 border-purple-200"

                        : submission.status ===
                          "Awarded"
                          ? "bg-green-100 text-green-700 border-green-200"

                        : submission.status ===
                          "Cancelled"
                          ? "bg-red-100 text-red-700 border-red-200"

                        : "bg-neutral-100 text-neutral-700 border-neutral-200"
                      }
                    `}
                  >

                    <option>
                      New
                    </option>

                    <option>
                      Received
                    </option>

                    <option>
                      Quoted
                    </option>

                    <option>
                      Awarded
                    </option>

                    <option>
                      Cancelled
                    </option>

                    <option>
                      Lost
                    </option>

                  </select>
                </td>

                <td className="p-4">

                  <div className="font-semibold text-green-600">
                    {
                      submission.quote?.price
                        ? `$${Number(submission.quote.price).toLocaleString()}`
                        : "N/A"
                    }
                  </div>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filtered.length && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No submissions found.
          </div>
        )}
      </div>
      {selectedSubmission && (
  <SubmissionDetailsModal
    submission={selectedSubmission}
    onClose={() =>
      setSelectedSubmission(null)
    }
  />
)}
    </div>
  );
}