import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import tavernBg from "../assets/backgrounds/tavern-background.jpg";
import tavernLogo from "../assets/logo/tavern-logo.png";
import { toast } from "sonner";
import { LoginPassword } from "@/assets/icons/icons";

const NewPasswordPage = () => {
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formSchema = z
    .object({
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordData.password || !passwordData.confirmPassword) {
      toast.error("Please fill in all required fields.", {
        style: {
          background: "#8B1A1A",
          color: "#fff",
          border: "1px solid #6e1414",
        },
      });
      return;
    }

    const parseResult = formSchema.safeParse(passwordData);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || "Invalid input";
      toast.error(errorMsg, {
        style: {
          background: "#8B1A1A",
          color: "#fff",
          border: "1px solid #6e1414",
        },
      });
      return;
    }

    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success logic
      toast.success("Password updated successfully!", {
        style: {
          background: "#009507",
          color: "#fff",
          border: "1px solid #007d06",
        },
      });

      // Redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-poppins">
      {/* Left - Background Image */}
      <div className="hidden md:block w-1/2 overflow-hidden relative">
        <div
          className="absolute inset-0 bg-cover bg-center blur-[3px] scale-110"
          style={{ backgroundImage: `url(${tavernBg})` }}
        />
      </div>

      {/* Right - Form */}
      <div className="w-full md:w-1/2 bg-[#F5EFE6]/90 relative flex items-center justify-center px-8 py-12 overflow-hidden">
        <div className="relative w-full max-w-md flex flex-col items-center">
          {/* Logo */}
          <img src={tavernLogo} alt="Tavern Logo" className="w-40" />

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-1">
            New Password
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center">
            Set your new administrator password below.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* New Password */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold tracking-widest mb-1">
                NEW PASSWORD
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-white px-3 py-3 gap-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold tracking-widest mb-1">
                CONFIRM PASSWORD
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-white px-3 py-3 gap-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "bg-gray-400" : "bg-[#AA3131] hover:bg-[#6e1414]"} text-white font-semibold py-3 rounded-md transition-colors text-sm tracking-wide uppercase flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordPage;
