import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
export default function CreateProjectTypeModal({
  onClose,
  onCreated,
}: any) {

  const [name, setName] =
    useState("");

  const [businessUnits, setBusinessUnits] =
    useState<any[]>([]);

  const [selectedBU, setSelectedBU] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    loadBusinessUnits();

  }, []);

  const loadBusinessUnits = async () => {

    try {

      const data =
        await api.getBusinessUnits();

      setBusinessUnits(data || []);

    } catch (err) {

      console.error(err);
    }
  };

const handleCreate = async () => {

  if (!name || !selectedBU) {

    toast.error(
      "Please complete required fields"
    );

    return;
  }

  try {

    setLoading(true);

    await api.createProjectType({
      name,
      businessUnit: selectedBU,
    });

    toast.success(
      "Project Type created"
    );

    setName("");
    setSelectedBU("");

    onCreated();

    onClose();

  } catch (err) {

    console.error(err);

    toast.error(
      "Failed to create Project Type"
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
                Create Project Type
              </h2>

              <p className="text-sm text-neutral-500 mt-2">
                Configure a reusable submission workflow type.
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

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Project Type Name"
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

          <select
            value={selectedBU}
            onChange={(e) =>
              setSelectedBU(
                e.target.value
              )
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
          >

            <option value="">
              Select Business Unit
            </option>

            {businessUnits.map((bu) => (

              <option
                key={bu._id}
                value={bu._id}
              >
                {bu.name}
              </option>

            ))}

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