import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as z from "zod";
import tavernBg from "../assets/backgrounds/tavern-background.jpg";
import tavernLogo from "../assets/logo/tavern-logo.png";
import { LoginUsername } from "@/assets/icons/icons";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const [formErrors, setFormError] = useState<{
    username: any;
  } | null>();

  const formSchema = z.object({
    username: z.string().min(1, "Username/Email is required"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      username: username,
    };

    const parseResult = formSchema.safeParse(data);

    if (!parseResult.success) {
      const resultError = parseResult.error.format();
      setFormError({
        username: resultError.username?._errors[0] || "",
      });
      return;
    }

    // Placeholder for sending verification code
    console.log("Sending verification code to:", username);

    // You might want to navigate to a verification code entry page here
    // navigate("/verify-code");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Background Image */}
      <div className="hidden md:block w-1/2 overflow-hidden relative">
        <div
          className="absolute inset-0 bg-cover bg-center blur-[10px] scale-110"
          style={{ backgroundImage: `url(${tavernBg})` }}
        />
      </div>

      {/* Right - Form */}
      <div className="w-full md:w-1/2 bg-[#F5EFE6] flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Logo */}
          <img src={tavernLogo} alt="Tavern Logo" className="w-40 mb-8" />

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-1">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center">
            Enter your username or email to receive a verification code.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Username/Email */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold tracking-widest mb-1 uppercase">
                Username / Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-md bg-white px-3 py-2 gap-2">
                <span className="text-gray-400">
                  <LoginUsername className="w-4 h-4" />
                </span>
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
              {formErrors?.username && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.username}
                </p>
              )}
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

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed">
            Access is restricted to authorized Tavern Asia staff.
            <br />
            Contact{" "}
            <a href="mailto:admin@tavernasia.com" className="text-[#8B1A1A]">
              admin@tavernasia.com
            </a>{" "}
            for access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
