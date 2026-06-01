import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { API_URL } from "@/lib/config";

export default function CreateBUModal({
  onClose,
  onCreated,
}: any) {

  const [name, setName] =
    useState("");

  const [clients, setClients] =
    useState<any[]>([]);

  const [selectedClient, setSelectedClient] =
    useState("");

  const [loading, setLoading] =
    useState(false);
const [region, setRegion] =
  useState("");

const [currency, setCurrency] =
  useState("USD");

const [accountManagers, setAccountManagers] =
  useState<string[]>([]);

const [ccEmails, setCcEmails] =
  useState("");

const [users, setUsers] =
  useState<any[]>([]);
 useEffect(() => {

  loadClients();

  loadUsers();

}, []);

  const loadClients = async () => {

    try {

      const data =
        await api.getClients();

      setClients(data || []);

    } catch (err) {

      console.error(err);
    }
  };
const loadUsers = async () => {

  try {

    const res =
      await fetch(
        `${API_URL}/users`
      );

    const data =
      await res.json();

    setUsers(data || []);

  } catch (err) {

    console.error(err);
  }
};
 const handleCreate = async () => {

  try {
if (!name || !selectedClient) {

  toast.error(
    "Please complete required fields"
  );

  return;
}
    setLoading(true);

    await api.createBusinessUnit({
      name,
      client: selectedClient,

      region,

      currency,

      accountManagers,

      emails: {
        cc: ccEmails
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    });

    toast.success(
      "Business Unit created"
    );

    onCreated();

    onClose();

  } catch (err) {

    console.error(err);

    toast.error(
      "Failed to create BU"
    );

  } finally {

    setLoading(false);
  }
};
  return (

    <div
      className="
      fixed inset-0 z-50
      bg-black/50 backdrop-blur-[3px]
      flex items-center justify-center
      p-4
      "
    >

      <div
        className="
        w-full max-w-xl
        bg-white
        rounded-[30px]
        border border-neutral-200
        shadow-[0_20px_80px_rgba(0,0,0,0.15)]
        overflow-hidden
        animate-in fade-in zoom-in-95
        duration-200
        "
      >

        <div className="px-8 py-6 border-b border-neutral-200">

          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-[32px] leading-none font-semibold tracking-tight text-[#0B1B36]">
                Create Business Unit
              </h2>

              <p className="text-sm text-neutral-500 mt-2">
                Create and assign a business unit to a client.
              </p>

            </div>

            <button
              onClick={onClose}
              className="
              w-10 h-10 rounded-full
              flex items-center justify-center
              hover:bg-neutral-100
              transition
              text-neutral-500
              "
            >
              ✕
            </button>

          </div>

        </div>

    <div className="p-8 space-y-5">

  {/* NAME */}
  <input
    value={name}
    onChange={(e) =>
      setName(e.target.value)
    }
    placeholder="Business Unit Name"
    className="
    w-full h-12
    border border-neutral-200
    rounded-2xl
    px-4 text-sm
    "
  />

  {/* CLIENT */}
  <select
    value={selectedClient}
    onChange={(e) =>
      setSelectedClient(
        e.target.value
      )
    }
    className="
    w-full h-12
    border border-neutral-200
    rounded-2xl
    px-4 text-sm
    "
  >

    <option value="">
      Select Client
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

  {/* REGION */}
  <input
    value={region}
    onChange={(e) =>
      setRegion(e.target.value)
    }
    placeholder="Region / Location"
    className="
    w-full h-12
    border border-neutral-200
    rounded-2xl
    px-4 text-sm
    "
  />

  {/* ACCOUNT MANAGERS */}
  <select
    multiple
    value={accountManagers}
    onChange={(e) =>
      setAccountManagers(
        Array.from(
          e.target.selectedOptions,
          (o) => o.value
        )
      )
    }
    className="
    w-full h-40
    border border-neutral-200
    rounded-2xl
    px-4 text-sm
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

  {/* CC EMAILS */}
  <input
    value={ccEmails}
    onChange={(e) =>
      setCcEmails(e.target.value)
    }
    placeholder="CC Emails"
    className="
    w-full h-12
    border border-neutral-200
    rounded-2xl
    px-4 text-sm
    "
  />

  {/* CURRENCY */}
  <select
    value={currency}
    onChange={(e) =>
      setCurrency(e.target.value)
    }
    className="
    w-full h-12
    border border-neutral-200
    rounded-2xl
    px-4 text-sm
    "
  >

    <option value="USD">
      USD
    </option>

    <option value="CAD">
      CAD
    </option>

  </select>

</div>

        <div
          className="
          flex items-center justify-end gap-3
          px-8 pb-8 pt-2
          "
        >

          <button
            onClick={onClose}
            className="
            h-11 px-5
            border border-neutral-200
            rounded-2xl
            bg-white
            hover:bg-neutral-50
            transition
            "
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="
            h-11 px-5
            bg-[#0B1B36]
            text-white
            rounded-2xl
            hover:opacity-90
            transition
            disabled:opacity-50
            "
          >
            {loading
              ? "Creating..."
              : "Create"}
          </button>

        </div>

      </div>

    </div>
  );
}