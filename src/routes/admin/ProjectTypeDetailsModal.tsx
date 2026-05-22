import { toast } from "sonner";

const BASE_URL = "http://localhost:5000/api";

export default function ProjectTypeDetailsModal({
  projectType,
  onClose,
  onDeleted,
onEdit,
}: any) {

  if (!projectType) return null;

  const remove = async () => {
    try {

      await fetch(
        `${BASE_URL}/project-types/${projectType._id}`,
        {
          method: "DELETE",
        }
      );

      toast.success(
        "Project type deleted"
      );

      onDeleted();
      onClose();

    } catch {

      toast.error(
        "Failed to delete project type"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between rounded-t-3xl">

          <div>

            <h2 className="text-2xl font-semibold">
              {projectType.name}
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

          {/* META */}
          <div className="grid grid-cols-2 gap-4">

            <div className="border rounded-2xl p-5">
              <div className="text-xs text-muted-foreground mb-2">
                Total Fields
              </div>

              <div className="text-2xl font-semibold">
                {projectType.fields?.length || 0}
              </div>
            </div>

            <div className="border rounded-2xl p-5">
              <div className="text-xs text-muted-foreground mb-2">
                Created
              </div>

              <div className="font-medium">
                {new Date(
                  projectType.createdAt
                ).toLocaleDateString()}
              </div>
            </div>

          </div>

          {/* FIELDS */}
          <div>

            <div className="text-lg font-semibold mb-4">
              Configured Fields
            </div>

            <div className="space-y-4">

              {projectType.fields?.map(
                (field: any, i: number) => (

                  <div
                    key={i}
                    className="border rounded-2xl p-5 bg-neutral-50"
                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <div className="font-medium">
                          {field.label}
                        </div>

                        <div className="text-sm text-muted-foreground mt-1">
                          {field.name}
                        </div>

                      </div>

                      <div className="flex items-center gap-2">

                        <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                          {field.type}
                        </div>

                        {field.required && (
                          <div className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">
                            Required
                          </div>
                        )}
                      </div>

                    </div>

                    {!!field.options?.length && (

                      <div className="mt-4 flex flex-wrap gap-2">

                        {field.options.map(
                          (
                            opt: string,
                            idx: number
                          ) => (

                            <div
                              key={idx}
                              className="px-2 py-1 rounded-full bg-neutral-200 text-xs"
                            >
                              {opt}
                            </div>
                          )
                        )}
                      </div>
                    )}

                  </div>
                )
              )}
            </div>
          </div>

          {/* FOOTER */}
       <div className="
border-t pt-6
flex items-center
justify-between
">

  <div className="
  text-xs text-muted-foreground
  ">
    Updated{" "}
    {new Date(
      projectType.updatedAt
    ).toLocaleString()}
  </div>

  <div className="
  flex items-center
  gap-2
  ">

    <button
      onClick={() =>
        onEdit(projectType)
      }
      className="
      bg-navy text-white
      px-4 py-2 rounded-xl
      hover:opacity-90
      transition
      "
    >
      Edit Project Type
    </button>

    <button
      onClick={remove}
      className="
      bg-red-500 text-white
      px-4 py-2 rounded-xl
      hover:bg-red-600
      transition
      "
    >
      Delete Project Type
    </button>

  </div>

</div>
        </div>
      </div>
    </div>
  );
}