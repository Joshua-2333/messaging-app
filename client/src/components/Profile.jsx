// client/src/components/Profile.jsx
import React, { useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [displayName, setDisplayName] = useState(user.display_name || "");
  const [bio, setBio] = useState(user.bio || "");

  const updateProfile = async () => {
    try {
      const res = await API.patch("/users/me", {
        display_name: displayName,
        bio,
      });

      setUser(res.data);
      alert("Profile updated");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div>
      <h1>Profile</h1>

      <p>Username: {user.username}</p>

      <input
        placeholder="Display name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

      <input
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <button onClick={updateProfile}>Save</button>
    </div>
  );
}
