import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EditBUModal from "@/routes/admin/EditBUModal";
export const Route = createFileRoute("/admin/business-units")({
  component: AdminBusinessUnits,
});

const BASE_URL = "http://localhost:5000/api";

function AdminBusinessUnits() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [region, setRegion] = useState("");
  const [bus, setBus] = useState<any[]>([]);
const [users, setUsers] =
  useState<any[]>([]);
const [creating, setCreating] = useState(false);
const [showCreateModal,
setShowCreateModal] =
  useState(false);
const [editingBU, setEditingBU] =
  useState<any | null>(null);
const [search, setSearch] = useState("");
 const [page, setPage] =
  useState(1);

const ITEMS_PER_PAGE = 10;
const [form, setForm] =
  useState<any>({
    name: "",

    accountManagers: [],

    ccEmails: "",

    currency: "USD",
  });

  // 🔹 LOAD CLIENTS
 useEffect(() => {

  const load = async () => {

    const res =
      await fetch(
        `${BASE_URL}/clients`
      );

    const data =
      await res.json();

    setClients(data);
  };

  const loadUsers =
    async () => {

      const res =
        await fetch(
          `${BASE_URL}/users`
        );

      const data =
        await res.json();

      setUsers(data || []);
    };

  load();
  loadUsers();

}, []);

  // 🔹 LOAD BU PER CLIENT
  useEffect(() => {

  const loadBU = async () => {

    let url =
      `${BASE_URL}/business-units`;

    // FILTER ONLY IF CLIENT SELECTED
    if (selectedClient) {

      url +=
        `?clientId=${selectedClient}`;
    }

    const res =
      await fetch(url);

    const data =
      await res.json();

    setBus(data || []);
  };

  loadBU();

}, [selectedClient]);

  // 🔹 CREATE BU
  const createBU = async () => {
    if (!form.name) return;

    await fetch(`${BASE_URL}/business-units`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        client:
  selectedClient || clients[0]?._id,
         region,
     accountManagers:
  form.accountManagers,
        emails: {
          cc: form.ccEmails
  .split(",")
  .map((s: string) => s.trim())
  .filter(Boolean),
        },
        currency: form.currency,
      }),
    });

    setForm({
      name: "",
      accountManagers: [],
      ccEmails: "",
      currency: "USD",
    });
    setRegion("");

    // reload
    const res = await fetch(
      selectedClient
  ? `${BASE_URL}/business-units?clientId=${selectedClient}`
  : `${BASE_URL}/business-units`
    );
    const data = await res.json();
    setBus(data || []);
  };
const filteredBUs = bus.filter((b) => {

  const q =
    search.toLowerCase();

  return (
    b.name
      ?.toLowerCase()
      .includes(q) ||

    b.region
      ?.toLowerCase()
      .includes(q) ||

    b.accountManagers
      ?.some((m: any) =>
        m.name
          ?.toLowerCase()
          .includes(q)
      )
  );
});
const totalPages =
  Math.ceil(
    filteredBUs.length /
    ITEMS_PER_PAGE
  );

const paginatedBUs =
  filteredBUs.slice(
    (page - 1) *
      ITEMS_PER_PAGE,

    page *
      ITEMS_PER_PAGE
  );
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-display text-navy">
          Business Units
        </h1>
        <div className="mt-6 mb-6">

  <input
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    placeholder="Search business units..."
    className="border rounded-xl px-4 py-3 w-full max-w-md bg-white"
  />
</div>
        <p className="text-sm text-muted-foreground">
          Manage BU routing, account managers, and email flows.
        </p>
      </div>

      {/* CLIENT SELECT */}
      <div className="max-w-sm">
      <select
  value={selectedClient}
  onChange={(e) =>
    setSelectedClient(e.target.value)
  }
  className="
  w-full h-12
  border border-neutral-200
  rounded-2xl
  px-4
  text-sm
  bg-white
  focus:outline-none
  focus:ring-2
  focus:ring-[#0B1B36]/10
  focus:border-[#0B1B36]
  transition
  "
>

  <option value="">
    All Business Units
  </option>

  {clients.map((c) => (

    <option
      key={c._id}
      value={c._id}
    >
      {c.name}
    </option>

  ))}

</select>
      </div>

      <div className="space-y-6">

     
{/* LIST */}
<div className="space-y-4">

  <div className="flex items-center justify-between">

    <h2 className="text-lg font-semibold">
      Existing Business Units
    </h2>

    <button
      onClick={() =>
        setShowCreateModal(true)
      }
      className="
      bg-navy text-white
      px-4 py-2
      rounded-xl text-sm
      "
    >
      + Create Business Unit
    </button>

  </div>

  <div className="
  border rounded-2xl
  overflow-hidden
  bg-white
  ">

    <table className="w-full">

      <thead className="
      bg-neutral-50 border-b
      ">

        <tr className="text-left">

          <th className="p-4 text-sm font-medium">
            Name
          </th>

          <th className="p-4 text-sm font-medium">
            Region
          </th>

          <th className="p-4 text-sm font-medium">
            Currency
          </th>

          <th className="p-4 text-sm font-medium">
            Managers
          </th>

          <th className="p-4 text-sm font-medium text-right">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {paginatedBUs.map((b) => (

          <tr
            key={b._id}
            className="
            border-b last:border-0
            hover:bg-neutral-50
            transition
            "
          >

            <td className="p-4 font-medium">
              {b.name}
            </td>

            <td className="p-4 text-sm text-muted-foreground">
              {b.region || "-"}
            </td>

            <td className="p-4">

              <span className="
              px-2 py-1 rounded-full
              bg-green-100
              text-green-700
              text-xs
              ">
                {b.currency}
              </span>

            </td>

            <td className="p-4 text-sm">
              {b.accountManagers?.length || 0}
            </td>

            <td className="p-4 text-right">

              <button
                onClick={() =>
                  setEditingBU(b)
                }
                className="
                border rounded-lg
                px-3 py-1.5 text-sm
                hover:bg-neutral-100
                transition
                "
              >
                Edit
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>
<div
  className="
  flex items-center
  justify-between
  border border-t-0
  rounded-b-2xl
  bg-white
  px-5 py-4
  "
>

  <div className="text-sm text-muted-foreground">
    Showing page {page} of {totalPages || 1}
  </div>

  <div className="flex items-center gap-2">

    <button
      disabled={page === 1}

      onClick={() =>
        setPage(page - 1)
      }

      className="
      border rounded-lg
      px-4 py-2 text-sm
      disabled:opacity-40
      "
    >
      Previous
    </button>

    <div className="text-sm font-medium">
      Page {page} of {totalPages || 1}
    </div>

    <button
      disabled={
        page === totalPages ||
        totalPages === 0
      }

      onClick={() =>
        setPage(page + 1)
      }

      className="
      border rounded-lg
      px-4 py-2 text-sm
      disabled:opacity-40
      "
    >
      Next
    </button>

  </div>

</div>
</div>
 

      </div>
{showCreateModal && (

  <div className="
  fixed inset-0 z-50
  bg-black/40
  flex items-center
  justify-center
  p-6
  ">

    <div className="
    bg-white rounded-3xl
    w-full max-w-xl
    p-8 space-y-4
    ">

      <div className="
      flex items-center
      justify-between
      ">

        <h2 className="
        text-2xl font-semibold
        ">
          Create Business Unit
        </h2>

        <button
          onClick={() =>
            setShowCreateModal(false)
          }
          className="
          text-sm text-muted-foreground
          "
        >
          Close
        </button>

      </div>

      <input
        placeholder="Business Unit Name"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
        className="
        border p-3 w-full
        rounded-xl
        "
      />

      <input
        placeholder="Region / Location"
        value={region}
        onChange={(e) =>
          setRegion(e.target.value)
        }
        className="
        border p-3 w-full
        rounded-xl
        "
      />

   <select
  multiple
  value={form.accountManagers}
  onChange={(e) =>
    setForm({
      ...form,

      accountManagers:
        Array.from(
          e.target.selectedOptions,
          (o) => o.value
        ),
    })
  }
  className="
  border p-3 w-full
  rounded-xl
  h-40
  "
>

  {users.map((u) => (

    <option
      key={u._id}
      value={u._id}
    >
      {u.name}
    </option>

  ))}

</select>

      <input
        placeholder="CC Emails"
        value={form.ccEmails}
        onChange={(e) =>
          setForm({
            ...form,
            ccEmails:
              e.target.value,
          })
        }
        className="
        border p-3 w-full
        rounded-xl
        "
      />

      <select
        value={form.currency}
        onChange={(e) =>
          setForm({
            ...form,
            currency:
              e.target.value,
          })
        }
        className="
        border p-3 w-full
        rounded-xl
        "
      >
        <option value="USD">
          USD
        </option>

        <option value="CAD">
          CAD
        </option>
      </select>

      <div className="
      flex justify-end
      gap-3 pt-2
      ">

        <button
          onClick={() =>
            setShowCreateModal(false)
          }
          className="
          border rounded-xl
          px-5 py-2.5
          "
        >
          Cancel
        </button>

        <button
          onClick={async () => {

            await createBU();

            setShowCreateModal(false);

            toast.success(
              "Business Unit created"
            );
          }}
          className="
          bg-navy text-white
          rounded-xl
          px-5 py-2.5
          "
        >
          Save
        </button>

      </div>

    </div>

  </div>
)}
      {editingBU && (
  <EditBUModal
    bu={editingBU}
    onClose={() => setEditingBU(null)}
    onSaved={async () => {

      const res = await fetch(
      selectedClient
  ? `${BASE_URL}/business-units?clientId=${selectedClient}`
  : `${BASE_URL}/business-units`
      );

      const data = await res.json();

      setBus(data || []);
    }}
  />
)}
    </div>
  );
}