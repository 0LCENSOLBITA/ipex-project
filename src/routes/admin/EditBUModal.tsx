import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

const BASE_URL = "http://localhost:5000/api";

export default function EditBUModal({
  bu,
  onClose,
  onSaved,
}: any) {

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);
const [users, setUsers] =
  useState<any[]>([]);
  useEffect(() => {

  loadUsers();

}, []);

const loadUsers =
  async () => {

    try {

      const res =
        await fetch(
          `${BASE_URL}/users`
        );

      const data =
        await res.json();

      setUsers(data);

    } catch (err) {

      console.error(err);
    }
  };
  const [form, setForm] = useState({
    name: bu.name || "",
    region: bu.region || "",
    currency: bu.currency || "USD",

 accountManagers:
  bu.accountManagers?.map(
    (m: any) =>
      typeof m === "object"
        ? m._id
        : m
  ) || [],

    ccEmails:
      bu.emails?.cc?.join(", ") || "",
  });

  const save = async () => {
    try {

      await fetch(
        `${BASE_URL}/business-units/${bu._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: form.name,
            region: form.region,
            currency: form.currency,

          accountManagers:
  form.accountManagers,
                  
            emails: {
              cc: form.ccEmails
                .split(",")
               .map((s: string) => s.trim())
                .filter(Boolean),
            },
          }),
        }
      );

      toast.success("BU updated");

      onSaved();
      onClose();

    } catch {
      toast.error("Failed to update BU");
    }
  };

  const remove = async () => {
    try {

      await fetch(
        `${BASE_URL}/business-units/${bu._id}`,
        {
          method: "DELETE",
        }
      );

      toast.success("BU deleted");

      onSaved();
      onClose();

    } catch {
      toast.error("Failed to delete BU");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

      <div className="bg-white rounded-2xl p-6 w-full max-w-xl space-y-4 shadow-2xl">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Edit Business Unit
          </h2>

          <button
            onClick={onClose}
            className="text-sm text-muted-foreground"
          >
            Close
          </button>
        </div>

        <input
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          placeholder="BU Name"
          className="border p-2 rounded-md w-full"
        />

        <input
          value={form.region}
          onChange={(e) =>
            setForm({
              ...form,
              region: e.target.value,
            })
          }
          placeholder="Region"
          className="border p-2 rounded-md w-full"
        />

   <select
  multiple

  value={
    form.accountManagers
  }

  onChange={(e) => {

    const values =
      Array.from(
        e.target.selectedOptions
      ).map(
        (o: any) =>
          o.value
      );

    setForm({
      ...form,
      accountManagers:
        values,
    });
  }}

  className="
  border p-2
  rounded-md
  w-full
  h-32
  "
>

  {users

    .filter(
      (u) =>
        u.role ===
        "account_manager"
    )

    .map((u) => (

      <option
        key={u._id}
        value={u._id}
      >
        {u.name}
      </option>

    ))}

</select>

        <input
          value={form.ccEmails}
          onChange={(e) =>
            setForm({
              ...form,
              ccEmails: e.target.value,
            })
          }
          placeholder="CC Emails"
          className="border p-2 rounded-md w-full"
        />

        <select
          value={form.currency}
          onChange={(e) =>
            setForm({
              ...form,
              currency: e.target.value,
            })
          }
          className="border p-2 rounded-md w-full"
        >
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
        </select>

        <div className="flex justify-between pt-4">

          <button
            onClick={() =>
              setShowDeleteConfirm(true)
            }
            className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md"
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
              Delete Business Unit
            </h3>

            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this BU?
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