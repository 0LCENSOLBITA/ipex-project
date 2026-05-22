import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function CreateClientModal({
  onClose,
  onCreated,
}: any) {

  const [name, setName] =
    useState("");

  const [subdomain, setSubdomain] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const generatedCode =
    name
      ?.replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 8);

  const handleCreate = async () => {

    try {

      setLoading(true);

      setError("");

     await api.createClient({
  name,
  prefix: generatedCode,
  subdomain,
});
      toast.success(
        "Client created successfully"
      );

      onCreated();

      onClose();

    } catch (err: any) {

    console.error(err);

toast.error(
  err?.response?.data?.error ||
  "Failed to create client"
);

      if (
        err?.response?.data?.error
          ?.includes("exists")
      ) {

        setError(
          `Client name "${name}" already exists.`
        );

        toast.error(
          "Client already exists"
        );

      } else {

        toast.error(
          "Failed to create client"
        );
      }

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
                Create Client
              </h2>

              <p className="text-sm text-neutral-500 mt-2">
                Create a new client workspace and configuration.
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

          <div>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Client Name"
              className={`
              w-full h-12
              border
              rounded-2xl
              px-4
              text-sm
              focus:outline-none
              focus:ring-2
              transition
              ${
                error
                  ? "border-red-500 ring-red-100 animate-shake"
                  : "border-neutral-200 focus:ring-[#0B1B36]/10 focus:border-[#0B1B36]"
              }
              `}
            />

            {error && (

              <div className="text-sm text-red-500 mt-2">
                {error}
              </div>

            )}

          </div>

         

          <input
            value={subdomain}
            onChange={(e) =>
              setSubdomain(e.target.value)
            }
            placeholder="Client Subdomain"
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