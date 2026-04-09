import { useEffect, useState } from "react";
import AppShell from "../components/AppShell.jsx";
import { useAppContext } from "../context/AppContext.jsx";

const profileCards = [
  { label: "Seeds", value: "28", detail: "Ideas planted across multiple spaces" },
  { label: "Reeds", value: "143", detail: "Thoughtful branch replies" },
  { label: "Growers", value: "128", detail: "People following your tree" },
  { label: "Themes", value: "6", detail: "Interest spaces you actively shape" },
];

const Profile = () => {
  const { user, selectedThemes, updateProfile } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    headline: "",
    bio: "",
    location: "",
    avatarUrl: "",
  });

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      headline: user?.headline || "",
      bio: user?.bio || "",
      location: user?.location || "",
      avatarUrl: user?.avatarUrl || "",
    });
  }, [user]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 512;
        const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");

        if (!context) {
          setFormData((current) => ({
            ...current,
            avatarUrl: result,
          }));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const optimized = canvas.toDataURL("image/jpeg", 0.82);

        setFormData((current) => ({
          ...current,
          avatarUrl: optimized,
        }));
      };

      image.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <main className="insight-shell profile-purple-shell">
        <section className="profile-page-grid">
          <section className="profile-main-column">
            <article className="panel profile-hero-card organized-profile-card">
              <div className="profile-hero-row">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt={user?.username} className="profile-avatar-image" />
                ) : (
                  <div className="avatar-circle large" />
                )}
                <div className="profile-hero-copy">
                  <p className="eyebrow">Profile</p>
                  <h1>{user?.username}'s tree identity.</h1>
                  <p>Keep your profile simple, editable, and ready for meaningful social discovery.</p>
                </div>
                <button type="button" className="ghost-button" onClick={() => setEditing((value) => !value)}>
                  {editing ? "Close Editor" : "Edit Profile"}
                </button>
              </div>
            </article>

            <section className="stats-grid profile-stats-grid">
              {profileCards.map((card) => (
                <article key={card.label} className="stats-card profile-stat-card">
                  <span>{card.label}</span>
                  <strong>{card.value}</strong>
                  <p>{card.detail}</p>
                </article>
              ))}
            </section>

            <section className="profile-grid profile-content-grid">
              <article className="panel organized-profile-card">
                <div className="panel-heading">
                  <h2>Public Snapshot</h2>
                  <span>What people see first</span>
                </div>
                <p className="profile-bio">
                  {user?.bio || "Use your profile to describe your curiosity, themes, and how you contribute to discussions."}
                </p>
                <p className="profile-bio">{user?.location || "No location added yet"}</p>
                <div className="selected-theme-pills">
                  {selectedThemes.map((theme) => (
                    <span key={theme._id} className="theme-pill-inline soft">
                      {theme.title}
                    </span>
                  ))}
                </div>
              </article>

              <article className="panel organized-profile-card">
                <div className="panel-heading">
                  <h2>Profile Editor</h2>
                  <span>Interactive and editable</span>
                </div>
                {editing ? (
                  <form className="panel-form profile-editor-form" onSubmit={handleSubmit}>
                    <div className="profile-form-grid">
                      <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
                      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                      <input name="headline" value={formData.headline} onChange={handleChange} placeholder="Headline" />
                      <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                    </div>
                    <div className="profile-upload-row">
                      <label className="upload-field profile-upload-field">
                        <span>{formData.avatarUrl ? "Change profile image" : "Upload profile image"}</span>
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} />
                      </label>
                      <span className="muted-copy">
                        {formData.avatarUrl ? "Image ready for save" : "PNG, JPG, or any square image works best"}
                      </span>
                    </div>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short bio" rows="5" />
                    {error ? <p className="form-error">{error}</p> : null}
                    <div className="inline-actions">
                      <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Profile"}
                      </button>
                      <button type="button" className="ghost-button" onClick={() => setEditing(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-links">
                    <span className="space-link static-chip">Username: {user?.username}</span>
                    <span className="space-link static-chip">Email: {user?.email}</span>
                    <span className="space-link static-chip">Headline: {user?.headline || "Not added"}</span>
                    <span className="space-link static-chip">Location: {user?.location || "Not added"}</span>
                  </div>
                )}
              </article>
            </section>
          </section>

          <aside className="profile-side-column">
            <article className="panel organized-profile-card">
              <div className="profile-summary-top">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt={user?.username} className="profile-avatar-image" />
                ) : (
                  <div className="avatar-circle large" />
                )}
                <div>
                  <strong>{user?.username}</strong>
                  <p>{user?.headline || "Add a headline to tell people what you grow."}</p>
                </div>
              </div>
              <div className="selected-theme-pills">
                {selectedThemes.map((theme) => (
                  <span key={theme._id} className="theme-pill-inline">
                    {theme.title}
                  </span>
                ))}
              </div>
            </article>

            <article className="panel organized-profile-card">
              <h2>Profile Guide</h2>
              <div className="space-links">
                <span className="space-link static-chip">Add a headline people remember</span>
                <span className="space-link static-chip">Keep your bio short and clear</span>
                <span className="space-link static-chip">Use themes to show your interests</span>
              </div>
            </article>
          </aside>
        </section>
      </main>
    </AppShell>
  );
};

export default Profile;
