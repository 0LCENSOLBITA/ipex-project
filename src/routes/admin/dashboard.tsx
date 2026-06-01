import { createFileRoute } from "@tanstack/react-router";
import CreateClientModal from "./CreateClientModal";
import CreateBusinessUnitModal from "./CreateBUModal";
import { useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  Activity,
  Building2,
  Plus,
  TrendingUp,
} from "lucide-react";
import CreateProjectTypeModal
from "./CreateProjectTypeModal";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { api } from "@/lib/api";
import SubmissionDetailsModal from "@/routes/admin/SubmissionDetailsModal";
export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [subs, setSubs] = useState<any[]>([]);
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [
  showClientModal,
  setShowClientModal
] = useState(false);

const [
  showBUModal,
  setShowBUModal
] = useState(false);

const [
  showProjectTypeModal,
  setShowProjectTypeModal
] = useState(false);
const [selectedSubmission, setSelectedSubmission] =
  useState<any | null>(null);
const fetchDashboardData = async () => {

  const user =
  JSON.parse(
    localStorage.getItem(
      "user"
    ) || "{}"
  );

const data =
  await api.getSubmissions(
    user.role,
    user._id
  );

  setSubs(
    Array.isArray(data)
      ? data
      : []
  );

  const clients =
    await api.getClients();

  setClientsList(clients);

  console.log(
    "Clients:",
    clients
  );
};

useEffect(() => {

  fetchDashboardData();

}, []);

  const total = subs.length;

  const active = subs.filter(
    (s) => !["Awarded", "Cancelled", "Lost"].includes(s.status)
  ).length;
const filteredSubs = useMemo(() => {

  return subs.filter((s) => {

    const query = search.toLowerCase();

    return (
      s.data?.title
        ?.toLowerCase()
        .includes(query)

      ||

    s.client?.name
  ?.toLowerCase?.()
  ?.includes(query)

      ||

    s.businessUnit?.name
  ?.toLowerCase?.()
  ?.includes(query)

      ||

      s.submissionNumber
        ?.toLowerCase()
        .includes(query)
    );
  });

}, [subs, search]);

const chartData = [
  {
    name: "New",
    value: subs.filter(
      (s) => s.status === "New"
    ).length,
  },

  {
    name: "Quoted",
    value: subs.filter(
      (s) => s.status === "Quoted"
    ).length,
  },

  {
    name: "Awarded",
    value: subs.filter(
      (s) => s.status === "Awarded"
    ).length,
  },

  {
    name: "Lost",
    value: subs.filter(
      (s) => s.status === "Lost"
    ).length,
  },
];

const chartColors = [
  "#94a3b8",
  "#facc15",
  "#22c55e",
  "#ef4444",
];
  const clients = new Set(
    subs.map((s) => s.client?._id).filter(Boolean)
  ).size;

return (
  <div className="grid grid-cols-12 gap-6">

    {/* LEFT SIDE */}
    <div className="col-span-12 xl:col-span-8 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-display text-navy">
          Overview
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          All submissions across business units.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

   {/* TOTAL */}
<div
  className="
  border rounded-2xl p-5 bg-card
  transition-all duration-200
  hover:-translate-y-1
  hover:shadow-lg
  flex items-start justify-between
  "
>

  <div>

    <div className="text-xs text-muted-foreground uppercase tracking-wide">
      Total Projects
    </div>

    <div className="text-3xl font-semibold mt-3">
      {total}
    </div>

    <div className="text-xs text-muted-foreground mt-2">
      All submissions
    </div>
  </div>

  <div className="bg-neutral-100 p-3 rounded-xl">
    <FolderKanban size={20} />
  </div>
</div>

    {/* ACTIVE */}
<div
  className="
  border rounded-2xl p-5 bg-card
  transition-all duration-200
  hover:-translate-y-1
  hover:shadow-lg
  flex items-start justify-between
  "
>

  <div>

    <div className="text-xs text-muted-foreground uppercase tracking-wide">
      Active
    </div>

    <div className="text-3xl font-semibold mt-3">
      {active}
    </div>

    <div className="text-xs text-muted-foreground mt-2">
      In progress
    </div>
  </div>

  <div className="bg-blue-100 p-3 rounded-xl">
    <Activity size={20} />
  </div>
</div>

      {/* CLIENTS */}
<div
  className="
  border rounded-2xl p-5 bg-card
  transition-all duration-200
  hover:-translate-y-1
  hover:shadow-lg
  flex items-start justify-between
  "
>

  <div>

    <div className="text-xs text-muted-foreground uppercase tracking-wide">
      Clients
    </div>

    <div className="text-3xl font-semibold mt-3">
      {clients}
    </div>

    <div className="text-xs text-muted-foreground mt-2">
      Active client instances
    </div>
  </div>

  <div className="bg-green-100 p-3 rounded-xl">
    <Building2 size={20} />
  </div>
</div>
      </div>
{/* ANALYTICS */}
<div className="border rounded-2xl bg-card p-5">

  <div className="flex items-center justify-between">

    <div>
      <h2 className="text-lg font-semibold">
        Submission Analytics
      </h2>

      <p className="text-sm text-muted-foreground mt-1">
        Submission status distribution.
      </p>
    </div>

    <TrendingUp size={20} />
  </div>

<div className="flex items-center justify-between gap-8 mt-4">

  <div className="h-52 flex-1">

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      <PieChart>

        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={70}
        >

          {chartData.map((entry, index) => (

            <Cell
              key={index}
              fill={chartColors[index]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* LEGEND */}
  <div className="w-52 space-y-4">

    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-slate-400" />
        <span>New</span>
      </div>

      <span className="font-medium">
        {subs.filter((s) => s.status === "New").length}
      </span>
    </div>

    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <span>Quoted</span>
      </div>

      <span className="font-medium">
        {subs.filter((s) => s.status === "Quoted").length}
      </span>
    </div>

    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span>Awarded</span>
      </div>

      <span className="font-medium">
        {subs.filter((s) => s.status === "Awarded").length}
      </span>
    </div>

    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <span>Lost</span>
      </div>

      <span className="font-medium">
        {subs.filter((s) => s.status === "Lost").length}
      </span>
    </div>

  </div>
</div>

</div>
      {/* SUBMISSIONS TABLE */}
      <div className="border rounded-2xl bg-card overflow-hidden">

        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Recent Submissions
            </h2>

            <p className="text-xs text-muted-foreground mt-1">
              Latest submissions across all business units.
            </p>
          </div>

       <input
  value={search}

  onChange={(e) =>
    setSearch(e.target.value)
  }

  placeholder="Search submissions..."

  className="
border rounded-xl px-4 py-2.5 text-sm
bg-white
shadow-sm
  w-64
  focus:outline-none
  focus:ring-2
  focus:ring-gray-200
  "
/>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-muted text-xs text-muted-foreground sticky top-0">

              <tr>
                <th className="text-left p-3">
                  Client
                </th>

                <th className="text-left p-3">
                  BU
                </th>

                <th className="text-left p-3">
                  Title
                </th>

                <th className="text-left p-3">
                  Status
                </th>

                <th className="text-left p-3">
                  Quote
                </th>

                <th className="text-left p-3">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredSubs.map((s) => (

                <tr
                  key={s._id}

                  onClick={() =>
                    setSelectedSubmission(s)
                  }

                  title="Click to view submission details"

                  className="
                  transition-colors
                  cursor-pointer
                  hover:bg-neutral-100
                  border-b
                  "
                >

                <td className="p-3">

  {
    s.client?.name ||

    clientsList.find(
      (c) =>
        String(c._id) === String(s.client)
    )?.name ||

    "Deleted Client"
  }

</td>

                  <td className="p-3">
                    {s.businessUnit?.name || "—"}
                  </td>

                  <td className="p-3">
                    <div className="font-medium">
                      {s.data?.title || "—"}
                    </div>
                  </td>

                  <td className="p-3">

                    <select
                      onClick={(e) =>
                        e.stopPropagation()
                      }

                      value={s.status || "New"}

                      onChange={async (e) => {

                        const newStatus =
                          e.target.value;

                        await api.updateStatus(
                          s._id,
                          newStatus
                        );

                        setSubs((prev) =>
                          prev.map((item) =>
                            item._id === s._id
                              ? {
                                  ...item,
                                  status: newStatus,
                                }
                              : item
                          )
                        );
                      }}

                      className={`
                      px-3 py-1 rounded-full text-xs border
                      ${
                        s.status === "Awarded"
                          ? "bg-green-100 text-green-700"
                          : ""
                      }
                      ${
                        s.status === "Quoted"
                          ? "bg-yellow-100 text-yellow-700"
                          : ""
                      }
                      ${
                        s.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : ""
                      }
                      ${
                        s.status === "Lost"
                          ? "bg-gray-200 text-gray-600"
                          : ""
                      }
                      ${
                        s.status === "Received"
                          ? "bg-blue-100 text-blue-700"
                          : ""
                      }
                      ${
                        s.status === "New"
                          ? "bg-neutral-100 text-neutral-700"
                          : ""
                      }
                      `}
                    >
                      <option>New</option>
                      <option>Received</option>
                      <option>Quoted</option>
                      <option>Awarded</option>
                      <option>Cancelled</option>
                      <option>Lost</option>
                    </select>
                  </td>

                  <td className="p-3">

                    {s.quote?.price ? (
                      <div>

                        <div className="font-medium text-green-600">
                          $
                          {Number(
                            s.quote.price
                          ).toLocaleString()}
                        </div>

                        <div className="text-xs text-muted-foreground truncate max-w-52">
                          {s.quote.reason}
                        </div>

                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        —
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    {new Date(
                      s.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* RIGHT SIDEBAR */}
    <div className="col-span-12 xl:col-span-4 space-y-6">

      {/* QUICK ACTIONS */}
      <div className="border rounded-2xl p-5 bg-card">

        <h2 className="font-semibold text-lg">
          Quick Actions
        </h2>

        <div className="mt-4 space-y-3">

         <button
  onClick={() =>
    setShowClientModal(true)
  }
  className="
  w-full border rounded-xl py-3
  hover:bg-neutral-50
  transition
  "
>
  + New Client
</button>

         <button
  onClick={() =>
    setShowBUModal(true)
  }
  className="
  w-full border rounded-xl py-3
  hover:bg-neutral-50
  transition
  "
>
  + New Business Unit
</button>

        <button
  onClick={() =>
    setShowProjectTypeModal(true)
  }
  className="
  w-full border rounded-xl py-3
  hover:bg-neutral-50
  transition
  "
>
  + New Project Type
</button>
        </div>
      </div>

      {/* STATUS OVERVIEW */}
      <div className="border rounded-2xl p-5 bg-card">

        <h2 className="font-semibold text-lg">
          Status Overview
        </h2>

   <div className="mt-4 space-y-3">

  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
      <span>New</span>
    </div>

    <span className="font-medium">
      {subs.filter((s) => s.status === "New").length}
    </span>
  </div>

  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
      <span>Quoted</span>
    </div>

    <span className="font-medium">
      {subs.filter((s) => s.status === "Quoted").length}
    </span>
  </div>

  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
      <span>Awarded</span>
    </div>

    <span className="font-medium">
      {subs.filter((s) => s.status === "Awarded").length}
    </span>
  </div>

  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
      <span>Lost</span>
    </div>

    <span className="font-medium">
      {subs.filter((s) => s.status === "Lost").length}
    </span>
  </div>

</div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="border rounded-2xl p-5 bg-card">

        <h2 className="font-semibold text-lg">
          Recent Activity
        </h2>

        <div className="mt-4 space-y-4">

          {subs.slice(0, 5).map((s) => (

           <div
  key={s._id}

  className="
  border rounded-xl p-3
  hover:bg-gray-50
  transition-colors
  "
>

              <div className="font-medium">
                {s.data?.title}
              </div>

           <div className="text-muted-foreground text-xs mt-1">
  {s.client?.name || "Deleted Client"}
</div>

              <div className="text-muted-foreground text-xs mt-1">
                {new Date(
                  s.createdAt
                ).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {selectedSubmission && (
      <SubmissionDetailsModal
        submission={selectedSubmission}
        onClose={() =>
          setSelectedSubmission(null)
        }
      />
    )}

    {/* CLIENT MODAL */}
{showClientModal && (
  <CreateClientModal
    onClose={() =>
      setShowClientModal(false)
    }

    onCreated={() => {
      setShowClientModal(false);
      fetchDashboardData();
    }}
  />
)}

{/* BUSINESS UNIT MODAL */}
{showBUModal && (
  <CreateBusinessUnitModal
    onClose={() =>
      setShowBUModal(false)
    }

    onCreated={() => {
      setShowBUModal(false);
      fetchDashboardData();
    }}
  />
)}

{/* PROJECT TYPE MODAL */}
{showProjectTypeModal && (
  <CreateProjectTypeModal
    onClose={() =>
      setShowProjectTypeModal(false)
    }

    onCreated={() => {
      setShowProjectTypeModal(false);
      fetchDashboardData();
    }}
  />
)}
   
  </div>
);
}