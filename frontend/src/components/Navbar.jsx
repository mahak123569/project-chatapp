import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../Pages/store/useAuthStore";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <header className="border-b border-base-300 bg-base-100/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <MessageSquare className="size-6 text-primary" />
          <span>Chat App</span>
        </Link>

        {authUser ? (
          <div className="flex items-center gap-2">
            <Link to="/profile" className="btn btn-ghost btn-sm gap-2">
              <User className="size-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <Link to="/settings" className="btn btn-ghost btn-sm gap-2">
              <Settings className="size-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            <button type="button" onClick={logout} className="btn btn-ghost btn-sm gap-2">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
