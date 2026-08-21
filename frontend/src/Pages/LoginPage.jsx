import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, MessageSquare } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    await login(formData);
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Main Content */}
      <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">
                Welcome Back
              </h1>

              <p className="mt-2 text-base-content/60">
                Login to continue chatting
              </p>
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Email
                  </span>
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Password
                  </span>
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="input input-bordered w-full pr-12"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-base-content/50
                      hover:text-primary
                      transition
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="btn btn-primary w-full"
              >
                {isLoggingIn ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="text-center mt-6 text-sm">
              <span className="text-base-content/60">
                Don't have an account?{" "}
              </span>

              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="hidden lg:flex items-center justify-center bg-base-300/20 px-12">
          <div className="max-w-md text-center">

            {/* Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold mb-3">
              Welcome to Chat App
            </h2>

            {/* Description */}
            <p className="text-base-content/60 text-lg">
              Connect with your friends and start
              chatting in real time.
            </p>

            {/* Features */}
            <div className="mt-8 flex justify-center gap-3 text-sm text-base-content/50">
              <span>💬 Real-time chat</span>
              <span>•</span>
              <span>🔐 Secure</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;