import { useEffect } from "react";
import { useChatStore } from "../Pages/store/useChatStore";

const Sidebar = () => {
  const {
    users,
    getUsers,
    selectedUser,
    setSelectedUser,
  } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="w-64 p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>

      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
            }}
            className={`p-3 rounded-lg cursor-pointer ${
              selectedUser?._id === user._id
                ? "bg-primary text-white"
                : "bg-base-200"
            }`}
          >
            {user.fullName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
