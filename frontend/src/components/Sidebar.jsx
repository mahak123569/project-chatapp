const Sidebar = () => {
  return (
    <div className="w-72 border-r border-base-300 bg-base-100 p-4">
      <h2 className="text-xl font-bold mb-4">
        Chats
      </h2>

      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-base-200">
          User 1
        </div>

        <div className="p-3 rounded-lg bg-base-200">
          User 2
        </div>

        <div className="p-3 rounded-lg bg-base-200">
          User 3
        </div>
      </div>
    </div>
  );
};

export default Sidebar;