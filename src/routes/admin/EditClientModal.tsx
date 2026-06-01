import { useEffect, useState } from "react";
import { toast } from "sonner";
import { API_URL as BASE_URL } from "@/lib/config";

export default function EditClientModal({
  client,
  onClose,
  onSaved,
}: any) {
const [form, setForm] = useState({
  name: client.name || "",
  subdomain: client.subdomain || "",

  logo:
    client.branding?.logo || "",

  primary:
    client.branding?.colors?.primary || "",

  secondary:
    client.branding?.colors?.secondary || "",

  emailSender:
    client.emailSenderName || "",
});
  
const [showDeleteConfirm, setShowDeleteConfirm] =
  useState(false);

const save = async () => {
  try {
    await fetch(`${BASE_URL}/clients/${client._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
body: JSON.stringify({
  name: form.name,

  prefix: client.prefix,

  subdomain: form.subdomain,

  branding: {
    logo: form.logo,

    colors: {
      primary: form.primary,
      secondary: form.secondary,
    },
  },

  emailSenderName: form.emailSender,
}),
    });

    toast.success("Client updated");

    onSaved();
    onClose();

  } catch (err) {
    toast.error("Failed to update client");
  }
};

const [code, setCode] =
 useState(client.prefix || "");



const remove = async () => {
  try {
    await fetch(`${BASE_URL}/clients/${client._id}`, {
      method: "DELETE",
    });

    toast.success("Client deleted");

    onSaved();
    onClose();

  } catch (err) {
    toast.error("Failed to delete client");
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl space-y-4 shadow-2xl">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Edit Client
          </h2>

          <button
            onClick={onClose}
            className="text-sm text-muted-foreground"
          >
            Close
          </button>
        </div>

      <div className="space-y-2">

  <label className="text-sm font-medium text-[#0B1B36]">
    Client Name
  </label>

  <input
    value={form.name}
    onChange={(e) =>
      setForm({
        ...form,
        name: e.target.value,
      })
    }
    className="
    w-full h-12
    border border-neutral-200
    rounded-2xl
    px-4
    text-sm
    focus:outline-none
    focus:ring-2
    focus:ring-[#0B1B36]/10
    focus:border-[#0B1B36]
    transition
    "
  />

</div>


        <div className="space-y-2">

  <label className="text-sm font-medium text-[#0B1B36]">
    Client Subdomain
  </label>

  <input
    value={form.subdomain}
    onChange={(e) =>
      setForm({
        ...form,
        subdomain: e.target.value,
      })
    }
    className="
    w-full h-12
    border border-neutral-200
    rounded-2xl
    px-4
    text-sm
    focus:outline-none
    focus:ring-2
    focus:ring-[#0B1B36]/10
    focus:border-[#0B1B36]
    transition
    "
  />

</div>

        <input
          value={form.logo}
          onChange={(e) =>
            setForm({
              ...form,
              logo: e.target.value,
            })
          }
          placeholder="Logo URL"
          className="border p-2 rounded-md w-full"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            value={form.primary}
            onChange={(e) =>
              setForm({
                ...form,
                primary: e.target.value,
              })
            }
            placeholder="Primary Color"
            className="border p-2 rounded-md w-full"
          />

          <input
            value={form.secondary}
            onChange={(e) =>
              setForm({
                ...form,
                secondary: e.target.value,
              })
            }
            placeholder="Secondary Color"
            className="border p-2 rounded-md w-full"
          />
        </div>

        <input
          value={form.emailSender}
          onChange={(e) =>
            setForm({
              ...form,
              emailSender: e.target.value,
            })
          }
          placeholder="Email Sender"
          className="border p-2 rounded-md w-full"
        />

        <div className="flex justify-between pt-4">
      <button
  onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>

          <button
            onClick={save}
            className="bg-navy hover:opacity-90 transition text-white px-4 py-2 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h3 className="text-lg font-semibold mb-2">
        Delete Client
      </h3>

      <p className="text-sm text-muted-foreground mb-6">
        Are you sure you want to delete this client?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() =>
            setShowDeleteConfirm(false)
          }
          className="border px-4 py-2 rounded-md"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
  setShowDeleteConfirm(false);
  await remove();
}}
          className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}