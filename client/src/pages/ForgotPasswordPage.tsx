import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as z from "zod";
import tavernBg from "../assets/backgrounds/tavern-background.jpg";
import tavernLogo from "../assets/logo/tavern-logo.png";
import { toast } from "sonner";
import { authApi } from "@/api/auth.api";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [username, setUsername] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  return (
    <div className="flex min-h-screen font-poppins">
      {/* Left - Background Image */}
      <div className="hidden md:block w-1/2 overflow-hidden relative">
        <div
          className="absolute inset-0 bg-cover bg-center blur-[3px] scale-110"
          style={{ backgroundImage: `url(${tavernBg})` }}
        />
      </div>

      {/* Right - Form Container */}
      <div className="w-full md:w-1/2 bg-[#F5EFE6]/90 relative flex items-center justify-center px-8 py-12 overflow-hidden">
        <div className="relative w-full max-w-md flex flex-col items-center">
          {/* Logo */}
          <img src={tavernLogo} alt="Tavern Logo" className="w-40" />

          {step === "email" ? (
            <ForgotPasswordForm
              username={username}
              setUsername={setUsername}
              onSuccess={(otp) => {
                setGeneratedOtp(otp);
                setStep("otp");
              }}
            />
          ) : (
            <EnterOtpForm
              onBack={() => setStep("email")}
              expectedOtp={generatedOtp}
            />
          )}

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

const ForgotPasswordForm = ({
  username,
  setUsername,
  onSuccess,
}: {
  username: string;
  setUsername: (val: string) => void;
  onSuccess: (otp: string) => void;
}) => {
  const formSchema = z.object({
    username: z.string().min(1, "Email is required"),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const data = { username };
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

    try {
      const response = await authApi.sendOtp();
      if (response && response.otp) {
        toast.success("Verification code sent!");
        onSuccess(response.otp);
      } else {
        toast.error("Failed to generate code. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">
        Forgot Password
      </h1>
      <p className="text-sm mb-8 text-center text-gray-600">
        Enter your admin email address and we'll send you a verification code to
        reset your password.
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="flex flex-col">
          <label className="text-[11px] font-bold tracking-widest mb-1 uppercase">
            Email
          </label>
          <div className="flex items-center border border-gray-300 rounded-xl bg-white px-3 py-3 gap-2">
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

        <button
          type="submit"
          className="w-full bg-[#AA3131] hover:bg-[#6e1414] text-white font-semibold py-3 rounded-md transition-colors text-sm tracking-wide uppercase"
        >
          Send Verification Code
        </button>
      </form>
    </>
  );
};

const EnterOtpForm = ({
  onBack,
  expectedOtp,
}: {
  onBack: () => void;
  expectedOtp: string;
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 4) {
      toast.error("Please enter the full 4-digit code.", {
        style: {
          background: "#8B1A1A",
          color: "#fff",
          border: "1px solid #8B1A1A",
        },
      });
      return;
    }

    if (code !== expectedOtp) {
      toast.error("incorrect otp, try again.", {
        style: {
          background: "#8B1A1A",
          color: "#fff",
          border: "1px solid #8B1A1A",
        },
      });
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
      return;
    }

    toast.success("Code verified!");
    // Proceed to next step (e.g., Reset Password)
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">
        Enter Code
      </h1>
      <p className="text-sm mb-8 text-center text-gray-600">
        We've sent a 4-digit verification code to your email. Enter it below to
        verify your identity.
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="flex justify-center gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-xl bg-white outline-none focus:border-[#AA3131] transition-colors"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-[#AA3131] hover:bg-[#6e1414] text-white font-semibold py-3 rounded-md transition-colors text-sm tracking-wide uppercase"
        >
          Verify Code
        </button>
      </form>

      <button
        onClick={onBack}
        className="text-xs text-[#AA3131] font-semibold hover:underline mt-4"
      >
        Change Email Address
      </button>
    </>
  );
};

export default ForgotPasswordPage;
