import {
  useEffect,
  useState,
} from "react";
import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { api } from "@/lib/api";
import {
  hasRole,
} from "../../lib/auth";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

interface BusinessUnit {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  assignedBusinessUnits: BusinessUnit[];
  createdAt: string;
}

function UsersPage() {
const navigate =
  useNavigate();

// useEffect(() => {

//   if (
//     !hasRole([
//       "admin",
//     ])
//   ) {

//     navigate({
//       to: "/admin",
//     });
//   }

// }, []);
  const [users, setUsers] =
    useState<User[]>([]);

  const [businessUnits, setBusinessUnits] =
    useState<BusinessUnit[]>([]);

  const [loading, setLoading] =
    useState(false);
const [pageLoading, setPageLoading] =
  useState(true);
  const [search, setSearch] =
  useState(
    localStorage.getItem(
      "users_search"
    ) || ""
  );
  const [currentPage, setCurrentPage] =
 
  useState(1);
const [sortField, setSortField] =
  useState<
    "name" |
    "email" |
    "role"
  >("name");

const [sortDirection, setSortDirection] =
  useState<
    "asc" |
    "desc"
  >("asc");
 const [roleFilter, setRoleFilter] =
  useState(
    localStorage.getItem(
      "users_role_filter"
    ) || "all"
  );

const [statusFilter, setStatusFilter] =
  useState(
    localStorage.getItem(
      "users_status_filter"
    ) || "all"
  );
  const [selectedUsers, setSelectedUsers] =
  useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] =
  useState(false);

const [selectedDeleteUser, setSelectedDeleteUser] =
  useState<User | null>(null);
const USERS_PER_PAGE = 10;
const filteredUsers =
  users.filter((user) => {

    const query =
      search.toLowerCase();

    const matchesSearch =

      user.name
        .toLowerCase()
        .includes(query)

      ||

      user.email
        .toLowerCase()
        .includes(query)

      ||

      user.role
        .toLowerCase()
        .includes(query);

    const matchesRole =

      roleFilter === "all"

      ||

      user.role ===
        roleFilter;

    const matchesStatus =

      statusFilter === "all"

      ||

      (
        statusFilter ===
          "active"

          ? user.isActive

          : !user.isActive
      );

    return (
      matchesSearch &&
      matchesRole &&
      matchesStatus
    );
  });


const sortedUsers =
  [...filteredUsers].sort(
    (a, b) => {

      const aValue =
        a[
          sortField
        ].toLowerCase();

      const bValue =
        b[
          sortField
        ].toLowerCase();

      if (
        sortDirection ===
        "asc"
      ) {

        return aValue.localeCompare(
          bValue
        );
      }

      return bValue.localeCompare(
        aValue
      );
    }
  );
  const totalPages =
  Math.ceil(
    filteredUsers.length /
    USERS_PER_PAGE
  );

const paginatedUsers =
  sortedUsers.slice(
    (currentPage - 1) *
      USERS_PER_PAGE,

    currentPage *
      USERS_PER_PAGE
  );
  const [open, setOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<User | null>(null);



  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "account_manager",
      assignedBusinessUnits: [] as string[],
      isActive: true,
    });
useEffect(() => {

  loadUsers();

}, []);

useEffect(() => {

  const loadBusinessUnits =
    async () => {

      try {

        const data =
          await api.getBusinessUnits();

        setBusinessUnits(data);

      } catch (err) {

        console.error(err);
      }
    };

  loadBusinessUnits();

}, []);
  // ================= LOAD =================

  const loadUsers = async () => {

  try {

    setPageLoading(true);

    const data =
      await api.getUsers();

    setUsers(data);

  } catch (err) {

    console.error(err);

  } finally {

    setPageLoading(false);
  }
};
  // ================= CREATE / UPDATE =================

  const handleSubmit =
    async () => {

      try {

        setLoading(true);

     if (editingUser) {

  const updatedUser =
    await api.updateUser(
      editingUser._id,
      form
    );

  setUsers((prev) =>
    prev.map((u) =>

      u._id ===
      editingUser._id

        ? updatedUser

        : u
    )
  );

} else {

  const newUser =
    await api.createUser(
      form
    );

  setUsers((prev) => [
    newUser,
    ...prev,
  ]);
}

        setOpen(false);

        setEditingUser(null);

        resetForm();

    
toast.success(
  editingUser
    ? "User updated"
    : "User created"
);
      } catch (err) {

        console.error(err);
toast.error(
  "Something went wrong"
);
      } finally {

        setLoading(false);
      }
    };

  // ================= DELETE =================

const handleDelete =
  async () => {

    try {

    

   if (!selectedDeleteUser) {
  return;
}

await api.deleteUser(
  selectedDeleteUser._id
);
setUsers((prev) =>
  prev.map((u) =>

    u._id ===
    selectedDeleteUser._id

      ? {
          ...u,
          isActive: false,
        }

      : u
  )
);
   
setDeleteDialogOpen(
  false
);

setSelectedDeleteUser(
  null
);
      toast.success(
        "User deactivated"
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to deactivate user"
      );
    }
  };
const handleBulkDeactivate =
  async () => {

    try {

      const confirmBulk =
        confirm(
          `Deactivate ${selectedUsers.length} users?`
        );

      if (!confirmBulk) {
        return;
      }

      await Promise.all(

        selectedUsers.map(
          (id) =>
            api.deleteUser(id)
        )
      );
setUsers((prev) =>

  prev.map((u) =>

    selectedUsers.includes(
      u._id
    )

      ? {
          ...u,
          isActive: false,
        }

      : u
  )
);
   

      setSelectedUsers([]);

      toast.success(
        "Users deactivated"
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Bulk action failed"
      );
    }
  };
  // ================= EDIT =================

  const handleEdit =
    (user: User) => {

      setEditingUser(user);

      setForm({
        name: user.name,

        email: user.email,

        password: "",

        role: user.role,

        assignedBusinessUnits:
          user.assignedBusinessUnits.map(
            (bu) => bu._id
          ),

        isActive:
          user.isActive,
      });

      setOpen(true);
    };

  // ================= RESET =================

  const resetForm = () => {

    setForm({
      name: "",
      email: "",
      password: "",
      role: "account_manager",
      assignedBusinessUnits: [],
      isActive: true,
    });
  };

  // ================= MULTISELECT =================

  const toggleBU =
    (id: string) => {

      const exists =
        form.assignedBusinessUnits.includes(
          id
        );

      if (exists) {

        setForm({
          ...form,

          assignedBusinessUnits:
            form.assignedBusinessUnits.filter(
              (x) => x !== id
            ),
        });

      } else {

        setForm({
          ...form,

          assignedBusinessUnits: [
            ...form.assignedBusinessUnits,
            id,
          ],
        });
      }
    };
    const toggleUserSelection =
  (id: string) => {

    const exists =
      selectedUsers.includes(id);

    if (exists) {

      setSelectedUsers(
        selectedUsers.filter(
          (x) => x !== id
        )
      );

    } else {

      setSelectedUsers([
        ...selectedUsers,
        id,
      ]);
    }
  };
const handleSort =
  (
    field:
      | "name"
      | "email"
      | "role"
  ) => {

    setCurrentPage(1);

    if (
      sortField === field
    ) {

      setSortDirection(
        sortDirection ===
          "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSortField(field);

      setSortDirection(
        "asc"
      );
    }
  };

  const getSortIndicator =
  (
    field:
      | "name"
      | "email"
      | "role"
  ) => {

    if (
      sortField !== field
    ) {
      return "";
    }

    return sortDirection ===
      "asc"

      ? " ↑"

      : " ↓";
  };
  return (
    <div className="p-8">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            User Management
          </h1>

          <p className="text-gray-500 mt-1">
            Create, edit, and manage
            portal users.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditingUser(null);
            setOpen(true);
          }}
       className={`
  bg-black
  text-white
  px-5
  py-2
  rounded-lg

`}
        >
          + New User
        </button>
      </div>


<div className="
  mb-6
  flex
  gap-4
">

  <input
    value={search}

    onChange={(e) => {

      setSearch(
        e.target.value
      );
localStorage.setItem(
  "users_search",
  e.target.value
);
      setCurrentPage(1);
    }}

    placeholder="Search users..."

    className="
      flex-1
      border
      rounded-xl
      px-4
      py-3
      outline-none
      focus:ring-2
      focus:ring-black
    "
  />

  <select
    value={roleFilter}

    onChange={(e) => {

      setRoleFilter(
        e.target.value
      );
localStorage.setItem(
  "users_role_filter",
  e.target.value
);
      setCurrentPage(1);
    }}

    className="
      border
      rounded-xl
      px-4
      py-3
    "
  >

    <option value="all">
      All Roles
    </option>

    <option value="admin">
      Admin
    </option>

    <option value="account_manager">
      Account Manager
    </option>

    <option value="leadership">
      Leadership
    </option>

  </select>

  <select
    value={statusFilter}

    onChange={(e) => {

      setStatusFilter(
        e.target.value
      );
localStorage.setItem(
  "users_status_filter",
  e.target.value
);
      setCurrentPage(1);
    }}

    className="
      border
      rounded-xl
      px-4
      py-3
    "
  >

    <option value="all">
      All Status
    </option>

    <option value="active">
      Active
    </option>

    <option value="inactive">
      Inactive
    </option>

  </select>

</div>
{selectedUsers.length > 0 && (

  <div className="
    mb-4
    flex
    items-center
    justify-between
    rounded-xl
    border
    bg-gray-50
    px-4
    py-3
  ">

    <div className="
      text-sm
    ">
      {
        selectedUsers.length
      } users selected
    </div>

    <button
      onClick={
        handleBulkDeactivate
      }
      className="
        rounded-lg
        bg-red-600
        px-4
        py-2
        text-white
      "
    >
      Deactivate Selected
    </button>

  </div>
)}
      {/* TABLE */}

      <div className="
        border
        rounded-xl
        overflow-hidden
        bg-white
      ">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
<th className="p-4">
  <input
    type="checkbox"

    checked={
      paginatedUsers.length > 0 &&

      selectedUsers.length ===
        paginatedUsers.length
    }

    onChange={() => {

      if (
        selectedUsers.length ===
        paginatedUsers.length
      ) {

        setSelectedUsers([]);

      } else {

        setSelectedUsers(
          paginatedUsers.map(
            (u) => u._id
          )
        );
      }
    }}
  />
</th>
           <th
  onClick={() =>
    handleSort("name")
  }
  className="
    p-4
    text-left
    cursor-pointer
    select-none
  "
>
    Name{
  getSortIndicator(
    "name"
  )
}
</th>

              <th
  onClick={() =>
    handleSort("email")
  }
  className="
    p-4
    text-left
    cursor-pointer
    select-none
  "
>
  Email{
  getSortIndicator(
    "email"
  )
}
</th>

              <th
  onClick={() =>
    handleSort("role")
  }
  className="
    p-4
    text-left
    cursor-pointer
    select-none
  "
>
 Role{
  getSortIndicator(
    "role"
  )
}
              </th>

              <th className="p-4 text-left">
                Assigned BUs
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

      {pageLoading &&

  Array.from({
    length: 5,
  }).map((_, i) => (

    <tr key={i}>

      <td
        colSpan={7}
        className="p-4"
      >

        <div className="
          h-10
          animate-pulse
          rounded-lg
          bg-gray-100
        " />

      </td>

    </tr>
  ))
}      
{!pageLoading &&
  paginatedUsers.map((user) => (
              <tr
                key={user._id}
                className="
                  border-t
                "
              >
<td className="p-4">

  <input
    type="checkbox"

    checked={
      selectedUsers.includes(
        user._id
      )
    }

    onChange={() =>
      toggleUserSelection(
        user._id
      )
    }
  />

</td>
                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

           <td className="p-4">

  <span
    className={`
      inline-flex
      items-center
      rounded-full
      border
      px-2.5
      py-1
      text-xs
      font-medium
      capitalize

      ${
        user.role === "admin"
          ? `
            border-red-200
            bg-red-50
            text-red-700
          `
          : user.role ===
            "leadership"
          ? `
            border-purple-200
            bg-purple-50
            text-purple-700
          `
          : `
            border-slate-200
            bg-slate-50
            text-slate-700
          `
      }
    `}
  >
    {user.role.replace(
      "_",
      " "
    )}
  </span>

</td>
                <td className="p-4">

                  <div className="
                    flex
                    flex-wrap
                    gap-2
                  ">

                    {user.assignedBusinessUnits?.map(
                      (bu) => (

                        <span
                          key={bu._id}
                          className="
                            text-xs
                            px-2
                            py-1
                            rounded-full
                            bg-blue-100
                          "
                        >
                          {bu.name}
                        </span>
                      )
                    )}

                  </div>

                </td>

                <td className="p-4">

               <span
  className={`
    inline-flex
    items-center
    rounded-full
    border
    px-2.5
    py-1
    text-xs
    font-medium

    ${
      user.isActive
        ? `
          border-emerald-200
          bg-emerald-50
          text-emerald-700
        `
        : `
          border-gray-200
          bg-gray-50
          text-gray-500
        `
    }
  `}
>
  {
    user.isActive
      ? "Active"
      : "Inactive"
  }
</span>

                </td>

            <td className="p-4">

  <div className="
    flex
    items-center
    gap-2
  ">

    <button
      onClick={() =>
        handleEdit(user)
      }

      className="
        rounded-lg
        border
        border-gray-200
        bg-white
        px-3
        py-1.5
        text-sm
        font-medium
        text-gray-700
        transition-colors
        hover:bg-gray-50
      "
    >
      Edit
    </button>

    <button
      onClick={() => {

        setSelectedDeleteUser(
          user
        );

        setDeleteDialogOpen(
          true
        );
      }}

      className="
        rounded-lg
        border
        border-red-100
        bg-red-50
        px-3
        py-1.5
        text-sm
        font-medium
        text-red-700
        transition-colors
        hover:bg-red-100
      "
    >
      Deactivate
    </button>

  </div>

</td>

              </tr>
            ))}
         {!pageLoading &&
  filteredUsers.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  className="
                    text-center
                    py-12
                    text-gray-500
                  "
                >
                  No users found.
                </td>

              </tr>

            )}
          </tbody>
        </table>
  <div className="
  flex
  items-center
  justify-between
  px-6
  py-4
  border-t
">

  <div className="
    text-sm
    text-gray-500
  ">
  Showing page {
  currentPage
} of {
  totalPages || 1
}
  </div>

  <div className="
    flex
    items-center
    gap-2
  ">

    <button
      disabled={
        currentPage === 1
      }

      onClick={() =>
        setCurrentPage(
          currentPage - 1
        )
      }

      className="
        border
        px-3
        py-1
        rounded-lg
        disabled:opacity-40
      "
    >
      Previous
    </button>

    <span className="
      text-sm
    ">
      Page {
        currentPage
      } of {
        totalPages || 1
      }
    </span>

    <button
      disabled={
        currentPage ===
        totalPages ||

        totalPages === 0
      }

      onClick={() =>
        setCurrentPage(
          currentPage + 1
        )
      }

      className="
        border
        px-3
        py-1
        rounded-lg
        disabled:opacity-40
      "
    >
      Next
    </button>

  </div>

</div>
      </div>

      {/* MODAL */}

   <Dialog
  open={open}
  onOpenChange={(value) => {

  setOpen(value);

  if (!value) {

    resetForm();

    setEditingUser(null);
  }
}}
>

  <DialogContent
    className="
      sm:max-w-2xl
    "
  >

    <DialogHeader>

      <DialogTitle>
        {
          editingUser
            ? "Edit User"
            : "Create User"
        }
      </DialogTitle>

    </DialogHeader>

    {/* NAME */}

    <div className="mb-4">

      <label className="
        text-sm
        font-medium
      ">
        Full Name
      </label>

      <input
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name:
              e.target.value,
          })
        }
        className="
          w-full
          border
          rounded-lg
          p-3
          mt-2
        "
      />
    </div>

    {/* EMAIL */}

    <div className="mb-4">

      <label className="
        text-sm
        font-medium
      ">
        Email
      </label>

      <input
        disabled={!!editingUser}
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email:
              e.target.value,
          })
        }
        className="
          w-full
          border
          rounded-lg
          p-3
          mt-2
        "
      />
    </div>

    {/* PASSWORD */}

    {!editingUser && (

      <div className="mb-4">

        <label className="
          text-sm
          font-medium
        ">
          Temporary Password
        </label>

        <input
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
          className="
            w-full
            border
            rounded-lg
            p-3
            mt-2
          "
        />

      </div>
    )}

    {/* ROLE */}

    <div className="mb-4">

      <label className="
        text-sm
        font-medium
      ">
        Role
      </label>

      <select
        value={form.role}
        onChange={(e) =>
          setForm({
            ...form,
            role:
              e.target.value,
          })
        }
        className="
          w-full
          border
          rounded-lg
          p-3
          mt-2
        "
      >

        <option value="admin">
          Admin
        </option>

        <option value="account_manager">
          Account Manager
        </option>

        <option value="leadership">
          Leadership
        </option>

      </select>

    </div>

    {/* BUSINESS UNITS */}

    <div className="mb-6">

      <label className="
        text-sm
        font-medium
      ">
        Assigned Business Units
      </label>

      <div className="
        border
        rounded-lg
        p-3
        mt-2
        max-h-[220px]
        overflow-y-auto
      ">

        {businessUnits.map(
          (bu) => {

            const checked =
              form.assignedBusinessUnits.includes(
                bu._id
              );

            return (

              <label
                key={bu._id}
                className="
                  flex
                  items-center
                  gap-3
                  py-2
                "
              >

                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    toggleBU(
                      bu._id
                    )
                  }
                />

                {bu.name}

              </label>
            );
          }
        )}

      </div>

    </div>

    {/* ACTIVE */}

    <div className="
      flex
      items-center
      gap-3
      mb-8
    ">

      <input
        type="checkbox"
        checked={form.isActive}
        onChange={(e) =>
          setForm({
            ...form,

            isActive:
              e.target.checked,
          })
        }
      />

      <span>
        Active User
      </span>

    </div>

    {/* ACTIONS */}

    <div className="
      flex
      justify-end
      gap-3
    ">

      <button
        onClick={() => {
          setOpen(false);
          setEditingUser(null);
        }}
        className="
          border
          px-5
          py-2
          rounded-lg
        "
      >
        Cancel
      </button>

      <button
        disabled={loading}
        onClick={handleSubmit}
      className={`
  bg-black
  text-white
  px-5
  py-2
  rounded-lg

  ${
    loading
      ? "opacity-50 cursor-not-allowed"
      : ""
  }
`}
      >
        {
          loading
            ? "Saving..."
            : editingUser
            ? "Save Changes"
            : "Create User"
        }
      </button>

    </div>

  </DialogContent>

</Dialog>

<AlertDialog
  open={deleteDialogOpen}
  onOpenChange={
    setDeleteDialogOpen
  }
>

  <AlertDialogContent>

    <AlertDialogHeader>

      <AlertDialogTitle>
        Deactivate User
      </AlertDialogTitle>

      <AlertDialogDescription>

        Are you sure you want to
        deactivate {

          selectedDeleteUser?.name
        }?

        This user will lose portal
        access but their history
        will remain preserved.

      </AlertDialogDescription>

    </AlertDialogHeader>

    <AlertDialogFooter>

      <AlertDialogCancel>
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={handleDelete}
      >
        Deactivate
      </AlertDialogAction>

    </AlertDialogFooter>

  </AlertDialogContent>

</AlertDialog>

    </div>
  );
}