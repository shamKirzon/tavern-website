import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });

  const [formErrors, setFormError] = useState<{
    username: any;
    password: any;
  } | null>();

  const formSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    // Step 1: Zod validation
    const parseResult = formSchema.safeParse(data);

    if (!parseResult.success) {
      const resultError = parseResult.error.format();
      setFormError({
        username: resultError.username?._errors[0] || "",
        password: resultError.password?._errors[0] || "",
      });
      return;
    }

    // Step 2: ENV validation
    const ADMIN = import.meta.env.VITE_ADMIN;
    const PASSWORD = import.meta.env.VITE_PASSWORD;

    if (data.username !== ADMIN || data.password !== PASSWORD) {
      setFormError({
        username: data.username !== ADMIN ? "Invalid username" : "",
        password: data.password !== PASSWORD ? "Invalid password" : "",
      });

      setLoginData({ username: "", password: "" });
      return;
    }

    setFormError({ username: "", password: "" });
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md h-120 border border-black flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 font-poppins">
          Welcome! Tavern Admin
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="mb-1 font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              value={loginData.username}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, username: e.target.value }))
              }
              type="text"
              name="username"
              placeholder="Enter your username"
              className="border border-black rounded-md p-2 "
            />
            {formErrors?.username && (
              <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label
              htmlFor="password"
              className="mb-1 font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, password: e.target.value }))
              }
              type="password"
              name="password"
              placeholder="Enter your password"
              className="border border-black rounded-md p-2    pr-10"
            />

            {formErrors?.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#EFD974] mt-7 text-black font-semibold py-4 rounded-md hover:bg-[#D4B845] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
