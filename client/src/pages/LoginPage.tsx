import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import tavernBg from "../assets/backgrounds/tavern-background.jpg";

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

  const [formErrors, setFormError] = useState<{
    username: any;
    password: any;
  } | null>();

  const formSchema = z.object({
    username: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    const parseResult = formSchema.safeParse(data);

    if (!parseResult.success) {
      const resultError = parseResult.error.format();
      setFormError({
        username: resultError.username?._errors[0] || "",
        password: resultError.password?._errors[0] || "",
      });
      return;
    }

    const ADMIN = import.meta.env.VITE_ADMIN;
    const PASSWORD = import.meta.env.VITE_PASSWORD;

    if (data.username !== ADMIN || data.password !== PASSWORD) {
      setFormError({
        username: data.username !== ADMIN ? "Invalid email" : "",
        password: data.password !== PASSWORD ? "Invalid password" : "",
      });
      setLoginData({ username: "", password: "" });
      return;
    }

    setFormError({ username: "", password: "" });
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Background Image */}
      <div className=" w-1/2" style={{ backgroundImage: `url(${tavernBg})` }} />

      {/* Right - Form */}
      <div className="w-full md:w-1/2 bg-[#F5EFE6] flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Logo */}
          <div className="border-2 border-[#8B1A1A] px-4 py-2 text-center mb-6">
            <p className="font-playfair text-[#8B1A1A] text-2xl leading-tight font-bold">
              T<br />A<br />V
            </p>
            <p className="text-[9px] text-[#8B1A1A] tracking-widest mt-1">
              EST 2008
            </p>
          </div>

          {/* Title */}
          <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-1">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center">
            Welcome back. Sign in to manage your establishment.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Email */}
            <div className="flex flex-col">
              <label className="text-[11px] font-semibold tracking-widest text-gray-600 mb-1">
                EMAIL
              </label>
              <div className="flex items-center border border-gray-300 rounded-md bg-white px-3 py-2 gap-2">
                <span className="text-gray-400 text-sm">👤</span>
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
              {formErrors?.username && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-[11px] font-semibold tracking-widest text-gray-600 mb-1">
                PASSWORD
              </label>
              <div className="flex items-center border border-gray-300 rounded-md bg-white px-3 py-2 gap-2">
                <span className="text-gray-400 text-sm">🔒</span>
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
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 text-sm"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {formErrors?.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-[#8B1A1A] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#8B1A1A] hover:bg-[#6e1414] text-white font-semibold py-3 rounded-md transition-colors text-sm tracking-wide"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
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

export default LoginPage;
