import { useState } from "react";
import { toast } from "sonner";

const BASE_URL = "http://localhost:5000/api";

export default function EditProjectTypeModal({
  projectType,
  onClose,
  onSaved,
}: any) {

  const [name, setName] = useState(
    projectType.name || ""
  );

  const [fields, setFields] = useState(
    projectType.fields || []
  );

  const updateField = (
    i: number,
    key: string,
    value: any
  ) => {

    setFields((prev: any[]) => {

      const updated = [...prev];

      updated[i] = {
        ...updated[i],
        [key]: value,
      };

      return updated;
    });
  };

  const removeField = (i: number) => {

    setFields((prev: any[]) =>
      prev.filter((_, idx) => idx !== i)
    );
  };

  const addField = () => {

    setFields((prev: any[]) => [
      ...prev,
      {
        name: "",
        label: "",
        type: "text",
        required: false,
        options: [],
      },
    ]);
  };

  const updateOptions = (
    i: number,
    value: string
  ) => {

    const options =
      value
        .split(",")
        .map((s: string) => s.trim());

    updateField(i, "options", options);
  };

  const save = async () => {

    try {

      await fetch(
        `${BASE_URL}/project-types/${projectType._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            fields,
          }),
        }
      );

     toast.success(
  "Project type updated"
);

await onSaved();

onClose();

    } catch {

      toast.error(
        "Failed to update project type"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between rounded-t-3xl">

          <div>
            <h2 className="text-2xl font-semibold">
              Edit Project Type
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              {projectType.businessUnit?.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-black transition"
          >
            Close
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 space-y-8">

          {/* NAME */}
          <div>

            <div className="text-sm font-medium mb-2">
              Project Type Name
            </div>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="border rounded-xl p-3 w-full"
            />
          </div>

          {/* FIELDS */}
          <div className="space-y-5">

            <div className="flex items-center justify-between">

              <div className="text-lg font-semibold">
                Fields
              </div>

              <button
                onClick={addField}
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl text-sm"
              >
                Add Field
              </button>
            </div>

            {fields.map(
              (f: any, i: number) => (

                <div
                  key={i}
                  className="border rounded-2xl p-5 bg-neutral-50 space-y-4"
                >

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  <div className="space-y-2">

  <label className="text-sm font-medium text-[#0B1B36]">
    Field Name
  </label>

  <input
    placeholder="e.g. campaign_name"
    value={f.name}
    onChange={(e) =>
      updateField(
        i,
        "name",
        e.target.value
      )
    }
    className="
    border border-neutral-200
    rounded-2xl
    p-3
    w-full
    "
  />

  <p className="text-xs text-neutral-500">
    Internal system field name used for submissions.
  </p>

</div>
                <div className="space-y-2">

  <label className="text-sm font-medium text-[#0B1B36]">
    Field Label
  </label>

  <input
    placeholder="e.g. Campaign Name"
    value={f.label}
    onChange={(e) =>
      updateField(
        i,
        "label",
        e.target.value
      )
    }
    className="
    border border-neutral-200
    rounded-2xl
    p-3
    w-full
    "
  />

  <p className="text-xs text-neutral-500">
    This is what the client will see on the submission form.
  </p>

</div>

                   <div className="space-y-2">

  <label className="text-sm font-medium text-[#0B1B36]">
    Data Type
  </label>

  <select
    value={f.type}
    onChange={(e) =>
      updateField(
        i,
        "type",
        e.target.value
      )
    }
    className="
    border border-neutral-200
    rounded-2xl
    p-3
    w-full
    "
  >

    <option value="text">
      Text
    </option>

    <option value="textarea">
      Long Text
    </option>

    <option value="number">
      Number
    </option>

    <option value="select">
      Dropdown Select
    </option>

    <option value="date">
      Date
    </option>

    <option value="email">
      Email
    </option>

  </select>

  {/* EXAMPLES */}
  <div className="text-xs text-neutral-500 leading-relaxed">

    {f.type === "text" && (
      <div>
        Example: Spring Product Launch
      </div>
    )}

    {f.type === "textarea" && (
      <div>
        Example: Please provide campaign goals, deliverables, and timeline.
      </div>
    )}

    {f.type === "number" && (
      <div>
        Example: 5000
      </div>
    )}

    {f.type === "select" && (
      <div>
        Example: High, Medium, Low
      </div>
    )}

    {f.type === "date" && (
      <div>
        Example: 2026-05-07
      </div>
    )}

    {f.type === "email" && (
      <div>
        Example: client@company.com
      </div>
    )}

  </div>

</div>
                  </div>

                  {/* REQUIRED */}
                  <label className="flex items-center gap-2 text-sm">

                    <input
                      type="checkbox"
                      checked={f.required}
                      onChange={(e) =>
                        updateField(
                          i,
                          "required",
                          e.target.checked
                        )
                      }
                    />

                    Required field
                  </label>

                  {/* OPTIONS */}
                  {f.type === "select" && (

                    <input
                      placeholder="e.g. High, Medium, Low"
                      value={
                        (f.options || []).join(",")
                      }

                      onChange={(e) =>
                        updateOptions(
                          i,
                          e.target.value
                        )
                      }

                      className="border rounded-xl p-3 w-full"
                    />
                  )}
<p className="text-xs text-neutral-500 mt-2">
  Separate each dropdown option using commas.
</p>
                  {/* REMOVE */}
                  <button
                    onClick={() =>
                      removeField(i)
                    }
                    className="text-red-500 hover:text-red-600 transition text-sm"
                  >
                    Remove Field
                  </button>

                </div>
              )
            )}
          </div>

          {/* FOOTER */}
          <div className="border-t pt-6 flex items-center justify-end gap-3">

            <button
              onClick={onClose}
              className="border px-4 py-2 rounded-xl"
            >
              Cancel
            </button>

            <button
              onClick={save}
              className="bg-navy hover:opacity-90 transition text-white px-5 py-2 rounded-xl"
            >
              Save Changes
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}