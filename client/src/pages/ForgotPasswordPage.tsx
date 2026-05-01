import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as z from "zod";
import tavernBg from "../assets/backgrounds/tavern-background.jpg";
import tavernLogo from "../assets/logo/tavern-logo.png";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const formSchema = z.object({
    username: z.string().min(1, "Email is required"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username) {
      toast.error("Please enter email address", {
        style: {
          background: "#8B1A1A",
          color: "#fff",
          border: "1px solid #8B1A1A",
        },
      });
      return;
    }

    const data = {
      username: username,
    };

    const parseResult = formSchema.safeParse(data);

    if (!parseResult.success) {
      toast.error("Invalid input. Please check your entries. ", {
        style: {
          background: "#8B1A1A",
          color: "#fff",
          border: "1px solid #6e1414",
        },
      });
      return;
    }

    if (username !== "tavernasia@gmail.com") {
      toast.error("Access requires an authorized company email.", {
        style: {
          background: "#8B1A1A",
          color: "#fff",
          border: "1px solid #8B1A1A",
        },
      });
      setUsername("");
      return;
    }

    toast.success("Verification code sent!");
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
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Forgot Password
          </h1>
          <p className="text-sm mb-8 text-center text-gray-600">
            Enter your admin email address and we'll send you a verification
            code to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Email */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold tracking-widest mb-1 uppercase">
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl  bg-white px-3 py-3 gap-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@account.com"
                  className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#AA3131] hover:bg-[#6e1414] text-white font-semibold py-3 rounded-md transition-colors text-sm tracking-wide uppercase"
            >
              Send Verification Code
            </button>
          </form>

          {/* Remember Password Link */}
          <p className="text-sm text-gray-600 mt-6">
            Remember your password?{" "}
            <Link
              to="/"
              className="text-[#AA3131] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
