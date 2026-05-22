import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";

import {
  useEffect,
  useState,
} from "react";

import {
  getToken,
  logout,
  hasRole,
} from "../lib/auth";

import {
  UserCircle,
  Users,
  Tags,
  ChevronRight,
  Layers,
  ClipboardList,
  Network,
  User,
  LogOut,
} from "lucide-react";

export const Route =
  createFileRoute("/admin")({
    head: () => ({
      meta: [
        {
          title:
            "Admin — STAAK Console",
        },
      ],
    }),

    component: Admin,
  });

function Admin() {
const [mounted, setMounted] =
  useState(false);

useEffect(() => {
  setMounted(true);
}, []);
  const navigate =
    useNavigate();

  useEffect(() => {

    const token =
      getToken();

    if (!token) {

      navigate({
        to: "/login",
      });
    }

  }, [navigate]);

  const handleLogout =
    () => {

      logout();

      navigate({
        to: "/login",
      });
    };

  return (

    <div className="flex min-h-screen w-full bg-background">

      {/* SIDEBAR */}
      <aside
        className="
        hidden
        lg:flex
        fixed
        left-0
        top-0
        h-screen
        w-64
        flex-col
        bg-sidebar
        text-sidebar-foreground
        border-r
        border-sidebar-border
        "
      >

        {/* LOGO */}
        <div
          className="
          flex
          h-16
          items-center
          gap-2
          border-b
          border-sidebar-border
          px-5
          "
        >

          <div
            className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-sm
            bg-bronze
            text-bronze-foreground
            font-display
            text-sm
            "
          >
            S
          </div>

          <div>

            <div
              className="
              font-display
              text-base
              text-primary-foreground
              "
            >
              STAAK
            </div>

            <div
              className="
              text-[10px]
              uppercase
              tracking-[0.16em]
              text-sidebar-foreground/60
              "
            >
              Console
            </div>

          </div>

        </div>

        {/* NAVIGATION */}
        <nav
          className="
          flex-1
          space-y-2
          px-4
          py-6
          text-[16px]
          font-medium
          "
        >

          <Link
            to="/admin/dashboard"
            className="
            flex
            items-center
            gap-3
            rounded-md
            px-3
            py-2
            hover:bg-sidebar-accent/60
            "
          >
            <ClipboardList className="h-5 w-5" />
            Projects
          </Link>

          <Link
            to="/admin/clients"
            className="
            flex
            items-center
            gap-3
            rounded-md
            px-3
            py-2
            hover:bg-sidebar-accent/60
            "
          >
            <Users className="h-5 w-5" />
            Clients
          </Link>

          <Link
            to="/admin/business-units"
            className="
            flex
            items-center
            gap-3
            rounded-md
            px-3
            py-2
            hover:bg-sidebar-accent/60
            "
          >
            <Network className="h-5 w-5" />
            Business Units
          </Link>

          <Link
            to="/admin/project-types"
            className="
            flex
            items-center
            gap-3
            rounded-md
            px-3
            py-2
            hover:bg-sidebar-accent/60
            "
          >
            <Layers className="h-5 w-5" />
            Project Types
          </Link>

       {/* BRANDS TEMPORARILY HIDDEN

<div
  className="
  flex
  items-center
  gap-3
  rounded-md
  px-3
  py-2
  text-sidebar-foreground/60
  "
>
  <Tags className="h-5 w-5" />
  Brands
</div>

*/}

          {/* USERS */}
          {mounted &&
hasRole(["admin"]) && (

            <Link
              to="/admin/users"
              className="
              flex
              items-center
              gap-3
              rounded-md
              px-3
              py-2
              hover:bg-sidebar-accent/60
              "
            >
              <UserCircle className="h-5 w-5" />
              Users
            </Link>

          )}

        </nav>

        {/* FOOTER */}
        <div
          className="
          mt-auto
          border-t
          border-sidebar-border
          p-4
          "
        >

          {/* PROFILE */}
          <Link
            to="/admin/profile"
            className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-4
            py-3
            text-[16px]
            font-medium
            text-sidebar-foreground/80
            transition
            hover:bg-sidebar-accent/60
            "
          >

            <User className="h-5 w-5" />

            User Profile

          </Link>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}

            className="
            mt-2
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-4
            py-3
            text-left
            text-[16px]
            font-medium
            text-red-400
            transition
            hover:bg-red-500/10
            "
          >

            <LogOut className="h-5 w-5" />

            Logout

          </button>

        </div>

      </aside>

      {/* MAIN */}
      <div
        className="
        ml-64
        flex
        min-h-screen
        flex-1
        flex-col
        "
      >

        {/* TOPBAR */}
        <header
          className="
          flex
          h-16
          items-center
          justify-between
          border-b
          border-border
          bg-card
          px-6
          "
        >

          <div
            className="
            flex
            items-center
            gap-2
            text-sm
            text-muted-foreground
            "
          >

            <span>Admin</span>

            <ChevronRight className="h-3.5 w-3.5" />

            <span className="font-medium text-foreground">
              Panel
            </span>

          </div>

          <div className="flex items-center gap-3">

            <Link
              to="/"

              className="
              text-sm
              font-medium
              text-foreground
              hover:text-bronze
              transition
              "
            >
              View client portal →
            </Link>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <main
          className="
          flex-1
          overflow-y-auto
          px-6
          py-8
          lg:px-10
          "
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
}