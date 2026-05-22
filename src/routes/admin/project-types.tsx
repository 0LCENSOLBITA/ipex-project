import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ProjectTypeDetailsModal from "@/routes/admin/ProjectTypeDetailsModal";
import EditProjectTypeModal from "@/routes/admin/EditProjectTypeModal";
export const Route = createFileRoute("/admin/project-types")({
  component: AdminProjectTypes,
});

type Field = {
  name: string;
  label: string;
  type:
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "date"
  | "email";
  required: boolean;
  options?: string[];
};

function AdminProjectTypes() {
  const [bus, setBus] = useState<any[]>([]);
  const [selectedBU, setSelectedBU] = useState("");
  const [name, setName] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
const [projectTypes, setProjectTypes] = useState<any[]>([]);
const [search, setSearch] = useState("");
const [page, setPage] =
  useState(1);

const ITEMS_PER_PAGE = 10;
const [creating, setCreating] =

  useState(false);
  const [
  showCreateModal,
  setShowCreateModal,
] = useState(false);
useEffect(() => {

  loadData();

}, []);
const [
  selectedProjectType,
  setSelectedProjectType,
] = useState<any | null>(null);
const [
  editingProjectType,
  setEditingProjectType,
] = useState<any | null>(null);
const loadData = async () => {

  const buData =
    await api.getBusinessUnits();

  setBus(buData);

 const data =
  await api.getProjectTypes();

setProjectTypes(data);
};
  // 🔥 ADD FIELD
  const addField = () => {
    setFields((prev) => [
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

  // 🔥 UPDATE FIELD
  const updateField = (i: number, key: keyof Field, value: any) => {
    setFields((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], [key]: value };
      return updated;
    });
  };

  // 🔥 REMOVE FIELD
  const removeField = (i: number) => {
    setFields((prev) => prev.filter((_, idx) => idx !== i));
  };

  // 🔥 UPDATE SELECT OPTIONS
  const updateOptions = (i: number, value: string) => {
    const options = value.split(",").map((o) => o.trim());
    updateField(i, "options", options);
  };

  // 🔥 CREATE
 const create = async () => {

  if (!name || !selectedBU) {

    toast.error(
      "Missing required fields"
    );

    return;
  }

  try {

    setCreating(true);

 await api.createProjectType({
  name,
  businessUnit: selectedBU,

  fields: fields.filter(
    (f: any) =>
      f.name?.trim() &&
      f.label?.trim()
  ),
});

    toast.success(
      "Project type created"
    );

    setName("");
    setFields([]);

    loadData();

  } catch (err) {

    toast.error(
      "Failed to create project type"
    );

  } finally {

    setCreating(false);
  }
};
const filteredProjectTypes =
  projectTypes.filter((p) =>
    p.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages =
  Math.ceil(
    filteredProjectTypes.length /
    ITEMS_PER_PAGE
  );

const paginatedProjectTypes =
  filteredProjectTypes.slice(
    (page - 1) *
      ITEMS_PER_PAGE,

    page *
      ITEMS_PER_PAGE
  );
  return (
 <div className="p-10">
  <div className="space-y-6">

  

       <div className="space-y-6">
<div className="space-y-2">

 <div className="
flex items-center
justify-between
">

  <div className="font-medium text-lg">
    Existing Project Types
  </div>

  <button
    onClick={() =>
      setShowCreateModal(true)
    }
    className="
    bg-navy text-white
    px-4 py-2
    rounded-xl text-sm
    hover:opacity-90
    transition
    "
  >
    + Create Project Type
  </button>

</div>

  <input
    placeholder="Search project types..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="border p-2 rounded-md w-full"
  />

  <div className="
border rounded-2xl
overflow-hidden
bg-white
">
{!filteredProjectTypes.length && (

  <div className="border rounded-2xl p-10 text-center bg-white">

    <div className="text-lg font-medium">
      No project types yet
    </div>

    <div className="text-sm text-muted-foreground mt-2">
      Create your first project type configuration.
    </div>

  </div>
)}
  <table className="w-full">

  <thead className="bg-neutral-50 border-b">

    <tr className="text-left">

      <th className="p-4 text-sm font-medium">
        Name
      </th>

      <th className="p-4 text-sm font-medium">
        Business Unit
      </th>

      <th className="p-4 text-sm font-medium">
        Fields
      </th>

      <th className="p-4 text-sm font-medium text-right">
        Actions
      </th>

    </tr>

  </thead>

  <tbody>

    {paginatedProjectTypes.map((pt) => (

      <tr
        key={pt._id}
        className="
        border-b last:border-0
        hover:bg-neutral-50
        transition
        "
      >

        <td className="p-4 font-medium">
          {pt.name}
        </td>

        <td className="
        p-4 text-sm
        text-muted-foreground
        ">
          {pt.businessUnit?.name}
        </td>

        <td className="p-4">
          {pt.fields?.length || 0}
        </td>

        <td className="p-4 text-right">

          <div className="
          flex items-center
          justify-end gap-2
          ">

            <button
              onClick={() =>
                setSelectedProjectType(pt)
              }
              className="
              border rounded-lg
              px-3 py-1.5 text-sm
              hover:bg-neutral-100
              transition
              "
            >
              View
            </button>

            <button
              onClick={() =>
                setEditingProjectType(pt)
              }
              className="
              bg-navy text-white
              rounded-lg
              px-3 py-1.5 text-sm
              hover:opacity-90
              transition
              "
            >
              Edit
            </button>

          </div>

        </td>

      </tr>

    ))}

  </tbody>

</table>
<div
  className="
  flex items-center
  justify-between
  border-t
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
    w-full max-w-3xl
    p-8 space-y-6
    ">

      <div className="
      flex items-center
      justify-between
      ">

        <h2 className="
        text-2xl font-semibold
        ">
          Create Project Type
        </h2>

     <button
  onClick={() => {

    setFields([]);
    setName("");
    setSelectedBU("");

    setShowCreateModal(false);
  }}
  className="
  text-sm text-muted-foreground
  "
>
  Close
</button>

      </div>

      <select
        value={selectedBU}
        onChange={(e) =>
          setSelectedBU(e.target.value)
        }
        className="
        border p-3 w-full
        rounded-xl
        "
      >
        <option value="">
          Select Business Unit
        </option>

        {bus.map((b) => (
          <option
            key={b._id}
            value={b._id}
          >
            {b.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Project Type Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        className="
        border p-3 w-full
        rounded-xl
        "
      />

   <div className="space-y-4">

  <div className="
  flex items-center
  justify-between
  ">

    <div className="font-medium">
      Fields
    </div>

    <button
      type="button"
      onClick={addField}
      className="
      text-sm text-blue-600
      hover:underline
      "
    >
      + Add Field
    </button>

  </div>

  {!fields.length && (

    <div className="
    border border-dashed
    rounded-2xl
    p-8 text-center
    text-sm text-muted-foreground
    ">
      No fields added yet.
    </div>

  )}

  {fields.map((f, i) => (

    <div
      key={i}
      className="
      border rounded-2xl
      p-4 space-y-4
      "
    >

<div className="grid grid-cols-1 md:grid-cols-3 gap-5">

  {/* FIELD NAME */}
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

    <p className="text-xs text-neutral-500">
      Internal system field name used for submissions.
    </p>

  </div>

  {/* LABEL */}
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

    <p className="text-xs text-neutral-500">
      This is what clients will see on the submission form.
    </p>

  </div>

  {/* DATA TYPE */}
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
      bg-white
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

    <div className="text-xs text-neutral-500 leading-relaxed">

      {f.type === "text" && (
        <div>
          Example: Spring Product Launch
        </div>
      )}

      {f.type === "textarea" && (
        <div>
          Example: Please provide campaign goals and deliverables.
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

    </div>

  </div>

</div>

      <label className="
      flex items-center
      gap-2 text-sm
      ">

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

      {f.type === "select" && (

    <div className="space-y-2">

  <label className="text-sm font-medium text-[#0B1B36]">
    Dropdown Options
  </label>

  <input
    placeholder="e.g. High, Medium, Low"
    value={
      (f.options || []).join(", ")
    }
    onChange={(e) =>
      updateOptions(
        i,
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
  />

  <p className="text-xs text-neutral-500">
    Separate each dropdown option using commas.
  </p>

</div>

      )}

      <button
        type="button"
        onClick={() =>
          removeField(i)
        }
        className="
        text-red-500 text-sm
        hover:underline
        "
      >
        Remove field
      </button>

    </div>

  ))}

</div>

      <div className="
      flex justify-end
      gap-3
      ">

     <button
  onClick={() => {

    setFields([]);
    setName("");
    setSelectedBU("");

    setShowCreateModal(false);
  }}
  className="
  border rounded-xl
  px-5 py-2.5
  "
>
  Cancel
</button>

        <button
          onClick={async () => {

       await create();

setFields([]);
setName("");
setSelectedBU("");

setShowCreateModal(false);
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
  {selectedProjectType && (
  <ProjectTypeDetailsModal
    projectType={selectedProjectType}
    onClose={() =>
      setSelectedProjectType(null)
    }
    onDeleted={loadData}
    onEdit={(pt: any) => {
  setSelectedProjectType(null);
  setEditingProjectType(pt);
}}
  />
)}
{editingProjectType && (
  <EditProjectTypeModal
    projectType={editingProjectType}
    onClose={() =>
      setEditingProjectType(null)
    }
    onSaved={loadData}
  />
)}
</div>
  );
}