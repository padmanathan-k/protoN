import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import { useAppContext } from "../context/AppContext.jsx";

const themeVisuals = [
  "theme-visual-tech",
  "theme-visual-environment",
  "theme-visual-health",
  "theme-visual-arts",
  "theme-visual-space",
];

const themeMoodMap = [
  { match: ["tech", "ai", "code", "digital"], icon: "◈", accent: "aurora", label: "Signal" },
  { match: ["health", "well", "care", "medical"], icon: "+", accent: "berry", label: "Care" },
  { match: ["environ", "climate", "nature", "green"], icon: "◐", accent: "forest", label: "Earth" },
  { match: ["art", "design", "music", "film", "entertain"], icon: "✦", accent: "sunrise", label: "Create" },
];

const getThemeMood = (themeTitle = "", fallbackIndex = 0) => {
  const lower = themeTitle.toLowerCase();
  const match = themeMoodMap.find((item) => item.match.some((keyword) => lower.includes(keyword)));

  if (match) return match;

  return {
    icon: "◎",
    accent: ["sunrise", "aurora", "berry"][fallbackIndex % 3],
    label: "Story",
  };
};

const getSeedHighlights = (seed) => {
  const baseText = `${seed.title}. ${seed.content}`.trim();
  const parts = baseText
    .split(/[.!?]/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length >= 2 ? parts.slice(0, 2) : [seed.title, seed.content.slice(0, 70)];
};

const ModalWindow = ({ title, subtitle, children, onClose }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-window minimal-window" onClick={(event) => event.stopPropagation()}>
      <div className="modal-header">
        <div>
          <p className="auth-kicker">{title}</p>
          <h2>{subtitle}</h2>
        </div>
        <button type="button" className="ghost-button" onClick={onClose}>
          Close
        </button>
      </div>
      {children}
    </div>
  </div>
);

const ThemeModal = ({ onClose }) => {
  const { createTheme } = useAppContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [themeType, setThemeType] = useState("custom");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    await createTheme({ title, description, themeType });
    onClose();
  };

  return (
    <ModalWindow title="Workspace" subtitle="Create Theme" onClose={onClose}>
      <form className="panel-form" onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Theme name" />
        <div className="composer-format-row">
          {[
            { id: "custom", label: "Custom" },
            { id: "hybrid", label: "Hybrid" },
            { id: "hierarchy", label: "Hierarchy" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              className={themeType === option.id ? "format-chip active" : "format-chip"}
              onClick={() => setThemeType(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What kind of discussion belongs here?"
          rows="4"
        />
        <button type="submit">Create Theme</button>
      </form>
    </ModalWindow>
  );
};

const DiveMode = ({ themes, selectedThemes, toggleThemeSelection, onClose }) => (
  <ModalWindow title="Explore" subtitle="Dive Mode" onClose={onClose}>
    <div className="dive-mode-grid">
      {themes.map((theme, index) => (
        <button
          key={theme._id}
          type="button"
          className={`dive-theme-card ${themeVisuals[index % themeVisuals.length]} ${
            selectedThemes.some((item) => item._id === theme._id) ? "active" : ""
          }`}
          onClick={() => toggleThemeSelection(theme)}
        >
          <span className="theme-tile-overlay" />
          <strong>{theme.title}</strong>
          <span>{theme.themeType || "standard"}</span>
        </button>
      ))}
    </div>
  </ModalWindow>
);

const SeedModal = ({ onClose, presetMediaType = "image" }) => {
  const { themes, selectedThemes, createSeed } = useAppContext();
  const [themeId, setThemeId] = useState(selectedThemes[0]?._id || themes[0]?._id || "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState(presetMediaType);
  const [mediaData, setMediaData] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setMediaData(result);
      setMediaName(file.name);
      setMediaPreview(result);
      if (file.type.startsWith("video/")) {
        setMediaType("video");
      } else if (file.type.startsWith("audio/")) {
        setMediaType("audio");
      } else {
        setMediaType("image");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!themeId || !title.trim() || !content.trim()) {
      setError("Choose a theme, add a title, and write a seed before publishing.");
      return;
    }

    if (mediaType !== "none" && !mediaData) {
      setError(`Upload a ${mediaType} file or switch to Text only.`);
      return;
    }

    setSubmitting(true);

    try {
      await createSeed({ themeId, title, content, mediaType, mediaUrl: mediaData });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to publish seed right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWindow title="Composer" subtitle="Plant Seed" onClose={onClose}>
      <form className="panel-form" onSubmit={handleSubmit}>
        <select className="theme-select" value={themeId} onChange={(e) => setThemeId(e.target.value)}>
          <option value="">Choose theme</option>
          {themes.map((theme) => (
            <option key={theme._id} value={theme._id}>
              {theme.title}
            </option>
          ))}
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What are you seeding?" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share context, an idea, or a conversation starter"
          rows="5"
        />
        <div className="composer-format-row">
          <button
            type="button"
            className={mediaType === "image" ? "format-chip active" : "format-chip"}
            onClick={() => setMediaType("image")}
          >
            Add image
          </button>
          <button
            type="button"
            className={mediaType === "video" ? "format-chip active" : "format-chip"}
            onClick={() => setMediaType("video")}
          >
            Add video
          </button>
          <button
            type="button"
            className={mediaType === "audio" ? "format-chip active" : "format-chip"}
            onClick={() => setMediaType("audio")}
          >
            Add audio
          </button>
          <button
            type="button"
            className={mediaType === "none" ? "format-chip active" : "format-chip"}
            onClick={() => {
              setMediaType("none");
              setMediaData("");
              setMediaName("");
              setMediaPreview("");
            }}
          >
            Text only
          </button>
        </div>
        {mediaType !== "none" ? (
          <>
            <label className="upload-field">
              <span>{mediaName || `Upload ${mediaType} file`}</span>
              <input
                type="file"
                accept={
                  mediaType === "audio"
                    ? "audio/*"
                    : mediaType === "video"
                      ? "video/*"
                      : "image/*"
                }
                onChange={handleFileChange}
              />
            </label>
            {mediaPreview ? (
              mediaType === "video" ? (
                <div className="composer-preview video-surface">
                  <div className="video-placeholder">
                    <span className="play-badge">▶</span>
                    <strong>Video preview ready</strong>
                  </div>
                </div>
              ) : mediaType === "audio" ? (
                <div className="composer-preview audio-preview-card">
                  <div className="audio-preview-head">
                    <span className="play-badge">♪</span>
                    <div>
                      <strong>Audio seed ready</strong>
                      <span>{mediaName || "Uploaded audio"}</span>
                    </div>
                  </div>
                  <audio controls src={mediaPreview} className="audio-player" />
                </div>
              ) : (
                <div className="composer-preview">
                  <img src={mediaPreview} alt="Seed preview" className="seed-media-image" />
                </div>
              )
            ) : null}
          </>
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" disabled={submitting}>
          {submitting ? "Publishing..." : "Publish Seed"}
        </button>
      </form>
    </ModalWindow>
  );
};

const ReedComposer = ({ seedId, parentReedId = null, onClose }) => {
  const { createReed } = useAppContext();
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    await createReed({ seedId, parentReedId, content });
    setContent("");
    onClose();
  };

  return (
    <form className="reed-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Write a reed..."
        rows="3"
      />
      <div className="inline-actions">
        <button type="submit">Send</button>
        <button type="button" className="ghost-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const ReedNode = ({ reed, seedId }) => {
  const { toggleReedUpvote } = useAppContext();
  const [showReply, setShowReply] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="reed-node">
      <div className="reed-card">
        <div className="reed-meta">
          <span>@{reed.author?.username || "unknown"}</span>
          <span>{new Date(reed.createdAt).toLocaleDateString()}</span>
        </div>
        <p>{reed.content}</p>
        <div className="inline-actions">
          <button type="button" onClick={() => toggleReedUpvote(reed._id)}>
            Like ({reed.upvoteCount ?? reed.upvotes?.length ?? 0})
          </button>
          <button type="button" className="ghost-button" onClick={() => setShowReply((value) => !value)}>
            {showReply ? "Close" : "Reply"}
          </button>
          {reed.children?.length ? (
            <button type="button" className="ghost-button" onClick={() => setCollapsed((value) => !value)}>
              {collapsed ? "Expand" : "Collapse"}
            </button>
          ) : null}
        </div>
      </div>

      {showReply ? <ReedComposer seedId={seedId} parentReedId={reed._id} onClose={() => setShowReply(false)} /> : null}

      {!collapsed && reed.children?.length ? (
        <div className="reed-children">
          {reed.children.map((child) => (
            <ReedNode key={child._id} reed={child} seedId={seedId} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const SeedCard = ({ seed, selected, onSelect, accentIndex }) => {
  const themeMood = getThemeMood(seed.theme?.title, accentIndex);
  const highlights = getSeedHighlights(seed);
  const hasImage = seed.mediaUrl && seed.mediaType === "image";
  const hasVideo = seed.mediaUrl && seed.mediaType === "video";
  const hasAudio = seed.mediaUrl && seed.mediaType === "audio";

  return (
    <article className={`minimal-seed-card ${selected ? "active" : ""}`} onClick={() => onSelect(seed)}>
      {hasImage ? (
        <div className="minimal-media-frame">
          <img src={seed.mediaUrl} alt={seed.title} className="seed-media-image" />
        </div>
      ) : hasVideo ? (
        <div className="minimal-media-frame video-surface">
          <div className="video-placeholder">
            <span className="play-badge">▶</span>
            <strong>Video seed</strong>
          </div>
        </div>
      ) : hasAudio ? (
        <div className="minimal-media-frame audio-preview-card">
          <div className="audio-preview-head">
            <span className="play-badge">♪</span>
            <div>
              <strong>Audio seed</strong>
              <span>{seed.theme?.title}</span>
            </div>
          </div>
          <audio controls src={seed.mediaUrl} className="audio-player" />
        </div>
      ) : (
        <div className={`minimal-idea-card ${themeMood.accent}`}>
          <span className="theme-glyph">{themeMood.icon}</span>
          <strong>{highlights[0]}</strong>
          <span>{highlights[1]}</span>
        </div>
      )}

      <div className="minimal-seed-body">
        <div className="minimal-seed-meta">
          <div className="author-row">
            <div className="mini-avatar" />
            <div>
              <strong>@{seed.author?.username}</strong>
              <span>{seed.theme?.title}</span>
            </div>
          </div>
          <span>{new Date(seed.createdAt).toLocaleDateString()}</span>
        </div>
        <h3>{seed.title}</h3>
        <p>{seed.content}</p>
        <div className="minimal-seed-footer">
          <span>{seed.upvoteCount || 0} likes</span>
          <span>Open tree</span>
        </div>
      </div>
    </article>
  );
};

const Home = () => {
  const {
    user,
    themes,
    selectedThemes,
    toggleThemeSelection,
    clearThemeSelection,
    seeds,
    selectedSeed,
    setSelectedSeed,
    seedTree,
    loadThemes,
    loadSeeds,
    loadSeedTree,
    toggleSeedUpvote,
    loading,
  } = useAppContext();
  const [showSeedReply, setShowSeedReply] = useState(false);
  const [openModal, setOpenModal] = useState("");
  const [seedPreset, setSeedPreset] = useState("image");
  const [expandedThemes, setExpandedThemes] = useState(false);

  useEffect(() => {
    loadThemes();
  }, []);

  useEffect(() => {
    if (selectedThemes.length) {
      loadSeeds(selectedThemes.map((theme) => theme._id));
    }
  }, [selectedThemes]);

  useEffect(() => {
    if (selectedSeed?._id) {
      loadSeedTree(selectedSeed._id);
    }
  }, [selectedSeed?._id]);

  const topSeeds = useMemo(
    () => [...seeds].sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0)).slice(0, 4),
    [seeds]
  );

  const openSeedComposer = (preset = "image") => {
    setSeedPreset(preset);
    setOpenModal("seed");
  };

  return (
    <AppShell>
      <main className="minimal-home-shell">
        <aside className="minimal-sidebar">
          <section className="panel minimal-panel">
            <div className="sidebar-title-row">
              <div className="theme-title-group">
                <button
                  type="button"
                  className="theme-plain-toggle"
                  onClick={() => setOpenModal("dive")}
                  title="Open Dive Mode"
                >
                  {"<>"}
                </button>
                <h2>My Need</h2>
              </div>
              <div className="theme-toolbar">
                <span className="selection-count">{selectedThemes.length} active</span>
                <button type="button" className="tiny-action" onClick={clearThemeSelection}>
                  Deselect
                </button>
              </div>
            </div>
            <div className="theme-board-shell">
              <div className="theme-board minimal-theme-board">
              {(expandedThemes ? themes : themes.slice(0, 4)).map((theme, index) => (
                <button
                  key={theme._id}
                  type="button"
                  className={`theme-tile image-theme-tile ${
                    selectedThemes.some((item) => item._id === theme._id) ? "active" : ""
                  } ${themeVisuals[index % themeVisuals.length]}`}
                  onClick={() => toggleThemeSelection(theme)}
                >
                  <span className="theme-tile-overlay" />
                  <strong>{theme.title}</strong>
                </button>
              ))}
              </div>
              <button
                type="button"
                className="theme-tile theme-expand-tile"
                onClick={() => setExpandedThemes((value) => !value)}
                title="Expand themes"
              >
                <span className="theme-expand-icon">{expandedThemes ? "−" : "+"}</span>
              </button>
            </div>
          </section>

          <section className="panel minimal-panel">
            <h2>Quick Access</h2>
            <div className="space-links">
              <button type="button" className="space-link window-trigger" onClick={() => setOpenModal("theme")}>
                Create theme
              </button>
              <Link className="space-link" to="/profile">Profile</Link>
              <Link className="space-link" to="/growth">My Growth</Link>
              <Link className="space-link" to="/nest">Nest</Link>
            </div>
          </section>
        </aside>

        <section className="minimal-feed-column">
          <section className="panel minimal-panel composer-panel">
            <div className="composer-top-row">
              <div className="author-row">
                <div className="avatar-circle composer-avatar" />
                <button type="button" className="start-seed-button" onClick={() => openSeedComposer("image")}>
                  Start a seed, {user?.username}
                </button>
              </div>
            </div>
            <div className="composer-actions">
              <button type="button" className="composer-action-chip" onClick={() => openSeedComposer("image")}>
                Photo seed
              </button>
              <button type="button" className="composer-action-chip" onClick={() => openSeedComposer("video")}>
                Video seed
              </button>
              <button type="button" className="composer-action-chip" onClick={() => openSeedComposer("audio")}>
                Audio seed
              </button>
              <button type="button" className="composer-action-chip" onClick={() => openSeedComposer("none")}>
                Thought seed
              </button>
            </div>
          </section>

          {seeds.length ? (
            seeds.map((seed, index) => (
              <section key={seed._id} className="feed-block">
                <SeedCard
                  seed={seed}
                  selected={selectedSeed?._id === seed._id}
                  onSelect={setSelectedSeed}
                  accentIndex={index}
                />

                {selectedSeed?._id === seed._id ? (
                  <div className="panel minimal-panel thread-panel">
                    <div className="panel-heading">
                      <h3>Thread</h3>
                      <div className="inline-actions">
                        <button type="button" onClick={() => toggleSeedUpvote(seed._id)}>
                          Like ({seedTree?.upvoteCount ?? seed.upvoteCount ?? 0})
                        </button>
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() => setShowSeedReply((value) => !value)}
                        >
                          {showSeedReply ? "Close" : "Add reed"}
                        </button>
                      </div>
                    </div>

                    {showSeedReply ? <ReedComposer seedId={seed._id} onClose={() => setShowSeedReply(false)} /> : null}
                    {loading && !seedTree ? <p className="muted-copy">Loading thread...</p> : null}
                    {seedTree?.reeds?.length ? (
                      seedTree.reeds.map((reed) => <ReedNode key={reed._id} reed={reed} seedId={seed._id} />)
                    ) : (
                      <p className="muted-copy">No reeds yet. Start the first branch.</p>
                    )}
                  </div>
                ) : null}
              </section>
            ))
          ) : (
            <div className="panel minimal-panel home-empty">
              <h2>Nothing planted yet</h2>
              <p>Select themes and start your first seed.</p>
            </div>
          )}
        </section>

        <aside className="minimal-right-rail">
          <section className="panel minimal-panel">
            <h2>Top Seeds</h2>
            <div className="top-seed-list minimal-top-list">
              {topSeeds.map((seed, index) => (
                <button
                  key={seed._id}
                  type="button"
                  className="minimal-top-card"
                  onClick={() => setSelectedSeed(seed)}
                >
                  <span className="rank-number">{index + 1}</span>
                  <strong>{seed.title}</strong>
                  <span>{seed.theme?.title}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel minimal-panel">
            <h2>Feed Guide</h2>
            <div className="space-links">
              <span className="space-link static-chip">Select multiple themes</span>
              <span className="space-link static-chip">Open any card to explore the thread</span>
              <span className="space-link static-chip">Use Add reed to keep context</span>
            </div>
          </section>
        </aside>
      </main>

      {openModal === "theme" ? <ThemeModal onClose={() => setOpenModal("")} /> : null}
      {openModal === "seed" ? <SeedModal onClose={() => setOpenModal("")} presetMediaType={seedPreset} /> : null}
      {openModal === "dive" ? (
        <DiveMode
          themes={themes}
          selectedThemes={selectedThemes}
          toggleThemeSelection={toggleThemeSelection}
          onClose={() => setOpenModal("")}
        />
      ) : null}
    </AppShell>
  );
};

export default Home;
