import { useRef, useState } from "react";
import { Camera, User } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [preview, setPreview] = useState(authUser?.profilePic || "");
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!preview || preview === authUser?.profilePic) return;
    await updateProfile({ profilePic: preview });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200 px-4 py-10">
      <form onSubmit={handleSubmit} className="card mx-auto w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-2xl">Profile</h1>
          <p className="text-sm text-base-content/60">Update your profile picture.</p>

          <div className="relative mt-5">
            {preview ? (
              <img src={preview} alt="Profile preview" className="size-28 rounded-full object-cover" />
            ) : (
              <div className="flex size-28 items-center justify-center rounded-full bg-primary/15 text-primary">
                <User className="size-12" />
              </div>
            )}
            <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-primary btn-circle btn-sm absolute bottom-0 right-0" aria-label="Choose profile picture">
              <Camera className="size-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          <div className="mt-5 w-full rounded-box bg-base-200 p-4 text-left text-sm">
            <p><span className="font-medium">Name:</span> {authUser?.fullName}</p>
            <p className="mt-2"><span className="font-medium">Email:</span> {authUser?.email}</p>
          </div>

          <button type="submit" disabled={isUpdatingProfile || !preview || preview === authUser?.profilePic} className="btn btn-primary mt-5 w-full">
            {isUpdatingProfile ? "Saving..." : "Save profile picture"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default ProfilePage;
