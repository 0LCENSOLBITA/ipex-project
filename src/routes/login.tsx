import {
  createFileRoute,
  useNavigate,
  Link,
} from "@tanstack/react-router";

import {
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Button,
} from "@/components/ui/button";

export const Route =
  createFileRoute(
    "/login"
  )({
    component:
      LoginPage,
  });

function LoginPage() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");
const [
  showPassword,
  setShowPassword,
] = useState(false);
  const [
    showForgot,
    setShowForgot,
  ] = useState(false);

  const handleLogin =
    async () => {

      try {

        setLoading(true);

        setError("");

        const res =
          await fetch(

            "http://localhost:5000/api/auth/login",

            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                email,
                password,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          setError(
            data.error ||
            "Login failed"
          );

          return;
        }

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user
          )
        );

        navigate({
          to:
           "/admin/dashboard",
        });

      } catch (err) {

        console.error(err);

        setError(
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

 return (

  <div
    className="
    min-h-screen

    bg-[#F7F5F1]

    bg-[linear-gradient(to_right,#071B3B14_1px,transparent_1px),linear-gradient(to_bottom,#071B3B14_1px,transparent_1px)]

    bg-[size:56px_56px]

    flex
    items-center
    justify-center

    px-6
    py-16
    "
  >
<div className="w-full max-w-[720px]">

  <Link
    to="/"

    className="
    mb-6

    inline-flex
    items-center
    gap-2

    rounded-full

    border
    border-[#DDD6CB]

    bg-[#FCFBF8]

    px-5
    py-3

    text-[14px]
    font-medium

    text-[#425B84]

    shadow-[0_4px_14px_rgba(0,0,0,0.03)]

    transition-all
    duration-200

    hover:border-[#071B3B]
    hover:bg-[#071B3B]
    hover:text-white

    active:scale-[0.98]
    "
  >

    <ArrowLeft className="h-4 w-4" />

    Back

  </Link>

    <div
      className="
      w-full
      max-w-[720px]

      rounded-[28px]

      border
      border-[#E8E1D8]

      bg-[#FCFBF8]

      px-10
      py-12

      shadow-[0_20px_60px_rgba(0,0,0,0.08)]
      "
    >

      {/* TOP LABEL */}

      <p
        className="
        text-[12px]
        uppercase
        tracking-[0.28em]

        text-[#425B84]

        font-medium
        "
      >
        ADMIN CONSOLE
      </p>

      {/* TITLE */}

      <h1
        className="
        mt-5

        font-serif

        text-[58px]

        leading-[1]

        tracking-[-0.04em]

        text-[#071B3B]
        "
      >
        Sign in to your account
      </h1>

      {/* ERROR */}

      {error && (

        <div
          className="
          mt-8

          rounded-[18px]

          border
          border-red-200

          bg-red-50

          px-5
          py-4

          text-sm
          text-red-700
          "
        >
          {error}
        </div>

      )}

      {/* EMAIL */}

      <div className="mt-12">

        <label
          className="
          mb-3
          block

          text-[13px]

          font-semibold

          uppercase

          tracking-[0.22em]

          text-[#425B84]
          "
        >
          Email
        </label>

        <div className="relative">

          <input
            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            placeholder="you@company.com"

            className="
            h-[68px]
            w-full

            rounded-[16px]

            border
            border-[#DDD6CB]

            bg-[#FDFCF9]

            px-6

            text-[16px]

            text-[#071B3B]

            outline-none

            transition-all
            duration-200

            placeholder:text-[#9AA4B5]

            focus:border-[#071B3B]
            focus:ring-4
            focus:ring-[#071B3B]/10
            "
          />

        </div>

      </div>

      {/* PASSWORD */}

      <div className="mt-8">

        <div className="mb-3 flex items-center justify-between">

          <label
            className="
            text-[13px]

            font-semibold

            uppercase

            tracking-[0.22em]

            text-[#425B84]
            "
          >
            Password
          </label>

          <button
            type="button"

            onClick={() =>
              setShowForgot(
                !showForgot
              )
            }

            className="
            text-sm

            text-[#425B84]

            transition-colors
            duration-200

            hover:text-[#071B3B]
            "
          >
            Forgot password?
          </button>

        </div>

        <div className="relative">

      <input
  type={
    showPassword
      ? "text"
      : "password"
  }
            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            placeholder="••••••••••"

            className="
            h-[68px]
            w-full

            rounded-[16px]

            border
            border-[#DDD6CB]

            bg-[#FDFCF9]

            px-6
            pr-14

            text-[16px]

            text-[#071B3B]

            outline-none

            transition-all
            duration-200

            placeholder:text-[#9AA4B5]

            focus:border-[#071B3B]
            focus:ring-4
           focus:ring-[#071B3B]/10
            "
          />

       <button
  type="button"

  onClick={() =>
    setShowPassword(
      !showPassword
    )
  }

  className="
  absolute
  right-5
  top-1/2
  -translate-y-1/2

  text-[#7B8BA5]

  transition-colors

  hover:text-[#071B3B]
  "
>

 {
  showPassword
    ? <EyeOff className="h-5 w-5" />
    : <Eye className="h-5 w-5" />
}

</button>

        </div>

      </div>

      {/* SIGN IN */}

      <Button
        disabled={loading}

        onClick={handleLogin}

        className="
        mt-10

        h-[68px]
        w-full

        rounded-[16px]

        bg-[#071B3B]

        text-[18px]
        font-semibold
        text-white

        transition-all
        duration-200

        hover:bg-[#0B285A]

        active:scale-[0.99]
        "
      >

        <span
          className="
          inline-flex
          items-center
          gap-3
          "
        >

          {
            loading
              ? "Signing in..."
              : "Sign in"
          }

          {!loading && (
            <ArrowRight className="h-5 w-5" />
          )}

        </span>

      </Button>

      {/* FORGOT PANEL */}

      {showForgot && (

        <div
          className="
          mt-5

          rounded-[18px]

          border
          border-[#DDD6CB]

          bg-[#FDFCF9]

          px-5
          py-4

          text-sm
          leading-6

          text-[#5C6B85]

          animate-in
          fade-in
          slide-in-from-top-2
          duration-200
          "
        >
          Password reset is managed by your
          administrator. Please contact your
          system administrator for assistance.
        </div>

      )}

      {/* FOOTER */}

      <p
        className="
        mt-10

        text-center

        text-sm

        text-[#5C6B85]
        "
      >
        Contact an administrator to get an account
      </p>
    </div>

  </div>

</div>

);
}