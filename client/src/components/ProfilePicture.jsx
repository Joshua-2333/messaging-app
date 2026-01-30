// client/src/components/ProfilePicture.jsx
import { useState } from "react";

export default function ProfilePicture() {
  const [avatar, setAvatar] = useState("/Aqua.png");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  return (
    <div className="profile-avatar-section">
      <img
        src={avatar}
        className="profile-avatar"
        alt="Profile"
      />

      <label className="upload-btn">
        Change picture
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
