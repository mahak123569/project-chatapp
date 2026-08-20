import { useEffect, useMemo, useState } from "react";
import { Search, MessageCircle, Users, X } from "lucide-react";
import { useChatStore } from "../Pages/store/useChatStore";

const Sidebar = () => {
  const {
    users,
    getUsers,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const [search, setSearch] = useState("");

  // =========================
  // GET USERS
  // =========================

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // =========================
  // SEARCH USERS
  // =========================

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    return users.filter((user) =>
      user.fullName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  // =========================
  // AVATAR LETTER
  // =========================

  const getInitial = (user) => {
    return user.fullName?.charAt(0)?.toUpperCase() || "?";
  };

  return (
    <aside className="w-[300px] h-full flex flex-col bg-base-200 border-r border-base-300">
      
      {/* =========================
          SIDEBAR HEADER
      ========================= */}

      <div className="px-5 pt-6 pb-4">

        {/* Title */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            
            <div className="w-11 h-11 rounded-2xl bg-primary/15 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Messages
              </h2>

              <p className="text-xs text-base-content/50">
                Start a conversation
              </p>
            </div>

          </div>

          <div className="w-9 h-9 rounded-xl bg-base-300 flex items-center justify-center">
            <Users className="w-4 h-4 text-base-content/60" />
          </div>
        </div>

        {/* =========================
            SEARCH BOX
        ========================= */}

        <div className="relative">

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40"
          />

          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              h-11
              pl-10
              pr-10
              rounded-xl
              bg-base-300
              border
              border-transparent
              focus:border-primary/40
              focus:outline-none
              text-sm
              placeholder:text-base-content/35
              transition-all
            "
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-base-content/40
                hover:text-base-content
                transition
              "
            >
              <X className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>

      {/* =========================
          USERS
      ========================= */}

      <div className="flex-1 overflow-y-auto px-3 pb-4">

        {/* Loading */}
        {isUsersLoading ? (
          <div className="space-y-2">

            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-3 rounded-xl"
              >
                <div className="w-12 h-12 rounded-full bg-base-300 animate-pulse" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-base-300 rounded animate-pulse" />
                  <div className="h-2 w-16 bg-base-300 rounded animate-pulse" />
                </div>
              </div>
            ))}

          </div>
        ) : filteredUsers.length === 0 ? (

          /* =========================
             NO USERS
          ========================= */

          <div className="h-full flex flex-col items-center justify-center text-center px-5">

            <div className="w-16 h-16 rounded-2xl bg-base-300 flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-base-content/30" />
            </div>

            <h3 className="font-semibold text-base-content/70">
              No users found
            </h3>

            <p className="text-xs text-base-content/40 mt-1">
              {search
                ? "Try searching another name"
                : "No conversations available"}
            </p>

          </div>

        ) : (

          /* =========================
             USER LIST
          ========================= */

          <div className="space-y-1">

            {filteredUsers.map((user) => {

              const isSelected =
                selectedUser?._id === user._id;

              return (
                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`
                    group
                    w-full
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-xl
                    text-left
                    transition-all
                    duration-200
                    ${
                      isSelected
                        ? "bg-primary text-primary-content shadow-md shadow-primary/10"
                        : "hover:bg-base-300 text-base-content"
                    }
                  `}
                >

                  {/* =========================
                      AVATAR
                  ========================= */}

                  <div className="relative flex-shrink-0">

                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.fullName}
                        className="
                          w-12
                          h-12
                          rounded-full
                          object-cover
                          ring-2
                          ring-base-100
                        "
                      />
                    ) : (
                      <div
                        className={`
                          w-12
                          h-12
                          rounded-full
                          flex
                          items-center
                          justify-center
                          text-lg
                          font-bold
                          ${
                            isSelected
                              ? "bg-primary-content/20 text-primary-content"
                              : "bg-primary/15 text-primary"
                          }
                        `}
                      >
                        {getInitial(user)}
                      </div>
                    )}

                    {/* Online dot */}
                    <span
                      className={`
                        absolute
                        bottom-0
                        right-0
                        w-3
                        h-3
                        rounded-full
                        border-2
                        ${
                          isSelected
                            ? "bg-success border-primary"
                            : "bg-success border-base-200"
                        }
                      `}
                    />
                  </div>

                  {/* =========================
                      USER INFO
                  ========================= */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-2">

                      <h3 className="font-semibold text-sm truncate">
                        {user.fullName || "Unknown User"}
                      </h3>

                      <span
                        className={`
                          text-[10px]
                          flex-shrink-0
                          ${
                            isSelected
                              ? "text-primary-content/60"
                              : "text-base-content/30"
                          }
                        `}
                      >
                        {/* You can add time here later */}
                      </span>

                    </div>

                    <p
                      className={`
                        text-xs
                        truncate
                        mt-1
                        ${
                          isSelected
                            ? "text-primary-content/70"
                            : "text-base-content/40"
                        }
                      `}
                    >
                      {isSelected
                        ? "Active conversation"
                        : "Tap to start chatting"}
                    </p>

                  </div>

                </button>
              );
            })}

          </div>
        )}
      </div>

      {/* =========================
          BOTTOM INFO
      ========================= */}

      <div className="px-4 py-3 border-t border-base-300">

        <div className="flex items-center gap-2 text-xs text-base-content/40">

          <span className="w-2 h-2 rounded-full bg-success" />

          <span>
            {users.length}{" "}
            {users.length === 1 ? "user" : "users"} available
          </span>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;