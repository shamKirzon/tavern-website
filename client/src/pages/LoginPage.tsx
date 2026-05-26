import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import tavernBg from "../assets/backgrounds/tavern-background.jpg";
import tavernLogo from "../assets/logo/tavern-logo.png";
import { toast } from "sonner";
import { authApi } from "@/api/auth.api";
import { supabase } from "@/lib/supabase-client";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z.object({
    username: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    if (!data.username || !data.password) {
      toast.error("Please fill in all required fields.", {
        style: {
          background: "#8B1A1A",
          color: "#fff",
          border: "1px solid #6e1414",
        },
      });
      return;
    }

    const parseResult = formSchema.safeParse(data);

    if (!parseResult.success) {
      toast.error("Invalid email or password. Please check your entries. ", {
        style: {
          background: "#8B1A1A",
          color: "#fff",
          border: "1px solid #6e1414",
        },
      });
      return;
    }

    try {
      const response = await authApi.login(data);

      if (!response || !response.result) {
        setLoginData({ username: "", password: "" });
        toast.error("Invalid email or password.", {
          style: {
            background: "#8B1A1A",
            color: "#fff",
            border: "1px solid #6e1414",
          },
        });
        return;
      }

      // supabase login session:
      const { error: supabaseError } = await supabase.auth.signInWithPassword({
        email: data.username,
        password: data.password,
      });

      if (supabaseError) {
        toast.error("Authentication failed. Please try again.", {
          style: {
            background: "#8B1A1A",
            color: "#fff",
            border: "1px solid #6e1414",
          },
        });
        return;
      }

      navigate("/dashboard");
    } catch (error: any) {
      setLoginData({ username: "", password: "" });
      toast.error("Invalid email or password. Please check your entries. ", {
        style: {
          background: "#8B1A1A",
          color: "#fff",
          border: "1px solid #6e1414",
        },
      });
    }
  };

  return (
    <div className="flex min-h-screen font-poppins">
      {/* Left - Background Image */}
      <div className="hidden md:block w-1/2 overflow-hidden relative">
        <div
          className="absolute inset-0 bg-cover blur-[3px] scale-110"
          style={{
            backgroundImage: `url(${tavernBg})`,
            backgroundPosition: "center 90%",
          }}
        />
      </div>

      {/* Right - Form */}
      <div className="w-full md:w-1/2 bg-[#F5EFE6]/90 relative flex items-center justify-center px-8 py-12 overflow-hidden">
        <div className="relative w-full max-w-md flex flex-col items-center">
          {/* Logo */}
          <img src={tavernLogo} alt="Tavern Logo" className="w-40" />

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-1">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center">
            Welcome back. Sign in to manage your establishment.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Email */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold tracking-widest mb-1">
                USERNAME
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-white px-3 py-3 gap-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="admin@account.com"
                  className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold tracking-widest mb-1">
                PASSWORD
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-white px-3 py-3 gap-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-[#8B1A1A] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#AA3131] hover:bg-[#6e1414] text-white font-semibold py-3 rounded-md transition-colors text-sm tracking-wide"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-center mt-6 leading-relaxed">
            Access is restricted to authorized Tavern Asia staff.
            <br />
            Contact{" "}
            <a href="mailto:admin@tavernasia.com" className="text-[#A6902A]">
              admin@tavernasia.com
            </a>{" "}
            for access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
