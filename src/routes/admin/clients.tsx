import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api";
import EditClientModal from "@/routes/admin/EditClientModal";
import { toast } from "sonner";
import { API_URL as BASE_URL } from "@/lib/config";
export const Route = createFileRoute("/admin/clients")({
  component: AdminClients,
});

function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [page, setPage] =
  useState(1);

const ITEMS_PER_PAGE = 10;
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [rateCard, setRateCard] = useState({ CAD: "", USD: "" });
  const [lineItems, setLineItems] = useState<string[]>([]);
  const [showPricing, setShowPricing] =
  useState(true);
const [newItem, setNewItem] = useState("");
const [editingClient, setEditingClient] = useState<any | null>(null);

const [creating, setCreating] = useState(false);

const [savingPricing, setSavingPricing] =
  useState(false);
const [search, setSearch] = useState("");


const [form, setForm] = useState<any>({
  name: "",
  prefix: "",
  subdomain: "",
  logo: "",
  primary: "",
  secondary: "",
  emailSender: "",
});
  // LOAD CLIENTS
  const loadClients = async () => {
    try {
      const res = await fetch(`${BASE_URL}/clients`);
      const data = await res.json();
      setClients(data || []);
    } catch (err) {
      console.error("CLIENT LOAD ERROR:", err);
      setClients([]);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  // CREATE CLIENT
 const createClient = async () => {
  try {
    setCreating(true);
    if (!form.name || !form.subdomain) {
  toast.error("Client name and subdomain are required");
  setCreating(false);
  return;
}

    await fetch(`${BASE_URL}/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
body: JSON.stringify({
  name: form.name,

  prefix:
    generatedCode ||
    form.name
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 8),

  subdomain: form.subdomain,

  branding: {
    logo: form.logo,

    colors: {
      primary: form.primary,
      secondary: form.secondary,
    },
  },

  emailSenderName: form.emailSender,

  rateCard: {
    CAD: 0,
    USD: 0,
  },

  lineItems: [],
})
    });

    toast.success("Client created");

 setForm({
  name: "",
  prefix: "",
  subdomain: "",
  logo: "",
  primary: "",
  secondary: "",
  emailSender: "",
});
    loadClients();
    setCreating(false);

} catch (err) {
  toast.error("Failed to create client");

  setCreating(false);
}
};
const filteredClients = clients.filter((c) => {

  const q = search.toLowerCase();

  return (
    c.name?.toLowerCase().includes(q) ||

    c.subdomain
      ?.toLowerCase()
      .includes(q) ||

    c.emailSender
      ?.toLowerCase()
      .includes(q)
  );
});
const totalPages =
  Math.ceil(
    filteredClients.length /
    ITEMS_PER_PAGE
  );

const paginatedClients =
  filteredClients.slice(
    (page - 1) *
      ITEMS_PER_PAGE,

    page *
      ITEMS_PER_PAGE
  );
const generatedCode =
  form.name
    ?.replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 8);
  return (
    <div className="space-y-8">
      {/* HEADER */}
    <div>
  <h1 className="text-3xl font-display text-navy">
    Clients
  </h1>

  <p className="text-sm text-muted-foreground mt-1">
    Manage client instances, branding, and configuration.
  </p>

  <div className="mt-6">
    <input
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      placeholder="Search clients..."
      className="border rounded-xl px-4 py-3 w-full max-w-md bg-white"
    />
  </div>
</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT — CREATE */}
        <div className="border rounded-xl p-6 space-y-5 bg-card">
          <h2 className="text-lg font-semibold">Create Client</h2>

      <input
  placeholder="Client Name"
  value={form.name}
  onChange={(e) =>
    setForm({
      ...form,
      name: e.target.value,
    })
  }
  className="border p-2 w-full rounded-md"
/>

      
<input
  placeholder="Subdomain"
  value={form.subdomain}
  onChange={(e) =>
    setForm({
      ...form,
      subdomain: e.target.value,
    })
  }
  className="border p-2 w-full rounded-md"
/>
          <input
            placeholder="Logo URL"
            value={form.logo}
            onChange={(e) => setForm({ ...form, logo: e.target.value })}
            className="border p-2 w-full rounded-md"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Primary Color (#000000)"
              value={form.primary}
              onChange={(e) =>
                setForm({ ...form, primary: e.target.value })
              }
              className="border p-2 w-full rounded-md"
            />

            <input
              placeholder="Secondary Color (#ffffff)"
              value={form.secondary}
              onChange={(e) =>
                setForm({ ...form, secondary: e.target.value })
              }
              className="border p-2 w-full rounded-md"
            />
          </div>

          <input
            placeholder="Email Sender"
            value={form.emailSender}
            onChange={(e) =>
              setForm({ ...form, emailSender: e.target.value })
            }
            className="border p-2 w-full rounded-md"
          />

      <button
  onClick={createClient}
 disabled={
  !form.name ||
  creating
}
  className="bg-navy text-white px-4 py-2 rounded-md w-full disabled:opacity-40"
>
  {creating ? "Creating..." : "Create Client"}
</button>
        </div>

        {/* RIGHT — LIST */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Existing Clients</h2>

          {clients.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No clients yet.
            </div>
          )}

          {paginatedClients.map((c) => (
            <div
              key={c._id}
         onClick={() => {
  setSelectedClient(c);

  setShowPricing(true);

  setRateCard({
    CAD: c.rateCard?.CAD || "",
    USD: c.rateCard?.USD || "",
  });

  setLineItems(
    c.lineItems?.map((l: any) =>
      typeof l === "string"
        ? l
        : l.name
    ) || []
  );
}}
           className={`border rounded-xl p-4 flex justify-between items-center bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer ${
                selectedClient?._id === c._id
                  ? "border-navy"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
       {c.branding?.logo ? (
  <img
    src={c.branding?.logo}
    alt={c.name}
    className="h-10 w-10 rounded-xl object-cover border"
  />
) : (
  <div
    className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold"
    style={{
     background:
  c.branding?.colors?.primary || "#0f172a",
    }}
  >
    {c.name?.charAt(0)}
  </div>
)}

<div>

  <div className="font-medium">
    {c.name}
  </div>


  <div className="text-sm text-neutral-500">
    Subdomain: {c.subdomain || "—"}
  </div>

</div>
              </div>

           <button
  onClick={(e) => {
    e.stopPropagation();
    setEditingClient(c);
  }}
  className="text-xs bg-neutral-100 hover:bg-neutral-200 transition px-3 py-1 rounded-md"
>
  Edit
</button>
            </div>
          ))}
     
     <div
  className="
  flex
  items-center
  justify-end
  gap-3
  pt-2
  "
>

  <button
    disabled={page === 1}

    onClick={() =>
      setPage(page - 1)
    }

    className="
    rounded-md
    border
    border-neutral-200
    px-4
    py-2
    text-sm
    text-neutral-500
    disabled:opacity-40
    "
  >
    Previous
  </button>

  <span className="text-sm">
    Page {page} of {totalPages || 1}
  </span>

  <button
    disabled={
      page === totalPages ||
      totalPages === 0
    }

    onClick={() =>
      setPage(page + 1)
    }

    className="
    rounded-md
    border
    border-neutral-200
    px-4
    py-2
    text-sm
    text-neutral-500
    disabled:opacity-40
    "
  >
    Next
  </button>

</div>

        </div>
      </div>

  {selectedClient && showPricing && (
  <div className="border rounded-xl p-6 bg-card space-y-6 relative">
    <h2 className="text-lg font-semibold">
      Pricing — {selectedClient.name}
    </h2>
<button
  onClick={() =>
    setShowPricing(false)
  }
  className="
    absolute
    top-4
    right-4
    h-8
    w-8
    rounded-full
    border
    hover:bg-neutral-100
    text-neutral-500
  "
>
  ×
</button>
    {/* RATE CARD */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">
          CAD (Base Rate)
        </label>
       <input
  type="number"
  value={rateCard.CAD}
          onChange={(e) =>
            setRateCard({
              ...rateCard,
              CAD: e.target.value,
            })
          }
          className="border p-2 rounded-md w-full"
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">
          USD (Base Rate)
        </label>
      <input
  type="number"
  value={rateCard.USD}
          onChange={(e) =>
            setRateCard({
              ...rateCard,
              USD: e.target.value,
            })
          }
          className="border p-2 rounded-md w-full"
        />
      </div>
    </div>

    {/* LINE ITEMS */}
    <div>
      <label className="text-xs text-muted-foreground mb-2 block">
        Services / Line Items
      </label>

      <div className="flex gap-2 mb-3">
        <input
          placeholder="Add service (e.g. Copywriting)"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="border p-2 rounded-md flex-1"
        />

        <button
          onClick={() => {
            if (!newItem) return;
            setLineItems([...lineItems, newItem]);
            setNewItem("");
          }}
          className="bg-navy text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {lineItems.map((item, i) => (
        <div
  key={i}
  className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-sm"
>
  <span>{item}</span>

  <button
    onClick={() =>
      setLineItems(
        lineItems.filter((_, idx) => idx !== i)
      )
    }
    className="text-red-500"
  >
    ×
  </button>
</div>
        ))}
      </div>
    </div>

    {/* SAVE BUTTON (INSIDE SAME CONTAINER) */}
    <button
onClick={async () => {
  try {

    setSavingPricing(true);
    if (!selectedClient) return;

   

    toast.success("Pricing updated");

const updatedClient =
  await api.updatePricing(
    selectedClient._id,
    {
      rateCard,

  lineItems: lineItems
  .map((item) => item.trim())
  .filter(Boolean),
    }
  );

setSelectedClient(updatedClient);

setRateCard({
  CAD: updatedClient?.rateCard?.CAD || "",
  USD: updatedClient?.rateCard?.USD || "",
});

setLineItems(
  updatedClient?.lineItems?.map(
    (l: any) =>
      typeof l === "string"
        ? l
        : l.name
  ) || []
);

await loadClients();
setSavingPricing(false);
 } catch (err) {
  toast.error("Failed to update pricing");

  setSavingPricing(false);
}
}}
      disabled={savingPricing}
className="bg-bronze hover:opacity-90 transition text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {savingPricing
  ? "Saving..."
  : "Save Changes"}
    </button>
  </div>
)}
{editingClient && (
  <EditClientModal
    client={editingClient}
    onClose={() => setEditingClient(null)}
    onSaved={loadClients}
  />
)}
    </div>
  );
}