import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();

    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left Side - Login Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">

              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-6 text-primary" />
              </div>

              <h1 className="text-2xl font-bold mt-2">
                Welcome Back
              </h1>

              <p className="text-base-content/60">
                Login to your account
              </p>

            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex items-center justify-center bg-base-200">
        <div className="text-center p-8">

          <h2 className="text-3xl font-bold">
            Welcome Back!
          </h2>

          <p className="mt-2 text-base-content/60">
            Login and start chatting with your friends.
          </p>

        </div>
      </div>

    </div>
  );
};

export default LoginPage;