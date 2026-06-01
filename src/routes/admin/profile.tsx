import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";
import { API_URL } from "@/lib/config";

export const Route =
  createFileRoute("/admin/profile")({
    component: ProfilePage,
  });

function ProfilePage() {

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [toast, setToast] =
    useState<{
      type: "success" | "error";
      text: string;
    } | null>(null);

  useEffect(() => {

    if (!toast) return;

    const timer =
      setTimeout(() => {

        setToast(null);

      }, 3000);

    return () =>
      clearTimeout(timer);

  }, [toast]);

  const handlePasswordUpdate =
    async () => {

      if (
        newPassword !== confirmPassword
      ) {

        setToast({
          type: "error",
          text:
            "Passwords do not match",
        });

        return;
      }

      try {

        setLoading(true);

        const token =
          localStorage.getItem("token");

        const res =
          await fetch(
            `${API_URL}/auth/change-password`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                currentPassword,
                newPassword,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          setToast({
            type: "error",
            text:
              data.error ||
              "Failed to update password",
          });

          return;
        }

        setToast({
          type: "success",
          text:
            "Password updated successfully",
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

      } catch (err) {

        console.error(err);

        setToast({
          type: "error",
          text:
            "Something went wrong",
        });

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="p-10">

      {/* HEADER */}
      <div className="mb-10">

        <h1
          className="
          text-5xl
          font-display
          text-navy
          "
        >
          My Profile
        </h1>

        <p className="text-muted-foreground mt-3">
          Manage your account settings and password.
        </p>

      </div>

      {/* GRID */}
      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
        "
      >

        {/* PROFILE CARD */}
        <div
          className="
          border
          rounded-3xl
          bg-card
          p-8
          shadow-sm
          "
        >

          <h2 className="text-2xl font-semibold">
            Profile Information
          </h2>

          <p className="text-sm text-muted-foreground mt-2">
            Your personal account details.
          </p>

          <div className="mt-10 space-y-8">

            {/* ACCOUNT NAME */}
            <div>

              <div
                className="
                text-sm
                uppercase
                tracking-wide
                text-muted-foreground
                "
              >
                Account Name
              </div>

              <div className="text-xl font-medium mt-2">
                {user.name}
              </div>

            </div>

            {/* EMAIL */}
            <div>

              <div
                className="
                text-sm
                uppercase
                tracking-wide
                text-muted-foreground
                "
              >
                Email
              </div>

              <div className="text-xl font-medium mt-2">
                {user.email}
              </div>

              {/* ROLE BADGE */}
              <div
                className="
                mt-4
                inline-flex
                items-center
                rounded-full
                bg-[#C47A3A]/10
                border
                border-[#C47A3A]/20
                px-4 py-1.5
                text-sm
                font-medium
                text-[#C47A3A]
                capitalize
                "
              >
                {user.role || "Admin"}
              </div>

            </div>

            {/* MEMBER SINCE */}
            <div>

              <div
                className="
                text-sm
                uppercase
                tracking-wide
                text-muted-foreground
                "
              >
                Member Since
              </div>

              <div className="text-xl font-medium mt-2">

                {
                  user.createdAt

                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )

                    : "—"
                }

              </div>

            </div>

          </div>

        </div>

        {/* PASSWORD CARD */}
        <div
          className="
          border
          rounded-3xl
          bg-card
          p-8
          shadow-sm
          "
        >

          <h2 className="text-2xl font-semibold">
            Change Password
          </h2>

          <p className="text-sm text-muted-foreground mt-2">
            Update the password for your account.
          </p>

          <div className="mt-8 space-y-5">

            {/* CURRENT PASSWORD */}
            <div className="relative">

              <input
                type={
                  showCurrent
                    ? "text"
                    : "password"
                }

                placeholder="Current Password"

                value={currentPassword}

                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }

                className="
                w-full
                rounded-2xl
                border
                px-4 py-4
                pr-14
                "
              />

              <button
                type="button"

                onClick={() =>
                  setShowCurrent(
                    !showCurrent
                  )
                }

                className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-neutral-500
                "
              >

                {
                  showCurrent

                    ? <EyeOff size={18} />

                    : <Eye size={18} />
                }

              </button>

            </div>

            {/* NEW PASSWORD */}
            <div className="relative">

              <input
                type={
                  showNew
                    ? "text"
                    : "password"
                }

                placeholder="New Password"

                value={newPassword}

                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }

                className="
                w-full
                rounded-2xl
                border
                px-4 py-4
                pr-14
                "
              />

              <button
                type="button"

                onClick={() =>
                  setShowNew(
                    !showNew
                  )
                }

                className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-neutral-500
                "
              >

                {
                  showNew

                    ? <EyeOff size={18} />

                    : <Eye size={18} />
                }

              </button>

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }

                placeholder="Confirm New Password"

                value={confirmPassword}

                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }

                className="
                w-full
                rounded-2xl
                border
                px-4 py-4
                pr-14
                "
              />

              <button
                type="button"

                onClick={() =>
                  setShowConfirm(
                    !showConfirm
                  )
                }

                className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-neutral-500
                "
              >

                {
                  showConfirm

                    ? <EyeOff size={18} />

                    : <Eye size={18} />
                }

              </button>

            </div>

            {/* BUTTON */}
            <button
              onClick={handlePasswordUpdate}

              disabled={loading}

              className="
              bg-black
              text-white
              px-6 py-4
              rounded-2xl
              hover:opacity-90
              transition
              "
            >

              {
                loading
                  ? "Updating..."
                  : "Update Password"
              }

            </button>

          </div>

        </div>

      </div>

      {/* TOAST */}
      {toast && (

        <div
          className={`
            fixed
            bottom-6
            right-6
            z-50
            rounded-2xl
            px-5 py-4
            shadow-xl
            text-white
            animate-in
            fade-in
            slide-in-from-bottom-3
            duration-300
            ${
              toast.type === "success"
                ? "bg-green-600"
                : "bg-red-500"
            }
          `}
        >
          {toast.text}
        </div>
      )}

    </div>
  );
}