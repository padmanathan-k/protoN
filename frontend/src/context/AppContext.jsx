import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../api/client";

const AppContext = createContext(null);

const getStoredAuth = () => {
  const rawAuth = localStorage.getItem("proton-auth");

  if (!rawAuth) {
    return { token: "", user: null };
  }

  try {
    return JSON.parse(rawAuth);
  } catch (error) {
    return { token: "", user: null };
  }
};

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredAuth().token);
  const [user, setUser] = useState(getStoredAuth().user);
  const [colorMode, setColorMode] = useState(localStorage.getItem("proton-color-mode") || "light");
  const [themes, setThemes] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [seeds, setSeeds] = useState([]);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [seedTree, setSeedTree] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthToken(token);
    localStorage.setItem("proton-auth", JSON.stringify({ token, user }));
  }, [token, user]);

  useEffect(() => {
    localStorage.setItem("proton-color-mode", colorMode);
    document.documentElement.dataset.colorMode = colorMode;
  }, [colorMode]);

  const authSubmit = async (mode, payload) => {
    const response = await api.post(`/auth/${mode}`, payload);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const updateProfile = async (payload) => {
    const response = await api.put("/auth/me", payload);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setThemes([]);
    setSelectedThemes([]);
    setSeeds([]);
    setSelectedSeed(null);
    setSeedTree(null);
    localStorage.removeItem("proton-auth");
    setAuthToken("");
  };

  const loadThemes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/themes");
      setThemes(response.data);

      if (selectedThemes.length === 0 && response.data.length > 0) {
        setSelectedThemes([response.data[0]]);
      }
    } finally {
      setLoading(false);
    }
  };

  const createTheme = async (payload) => {
    const response = await api.post("/themes", payload);
    setThemes((current) => [response.data, ...current]);
    setSelectedThemes((current) => [response.data, ...current]);
    return response.data;
  };

  const clearThemeSelection = () => {
    setSelectedThemes([]);
    setSeeds([]);
    setSelectedSeed(null);
    setSeedTree(null);
  };

  const toggleColorMode = () => {
    setColorMode((current) => (current === "light" ? "dark" : "light"));
  };

  const toggleThemeSelection = (theme) => {
    setSelectedThemes((current) => {
      const exists = current.some((item) => item._id === theme._id);

      if (exists) {
        const next = current.filter((item) => item._id !== theme._id);
        return next.length ? next : [theme];
      }

      return [...current, theme];
    });
  };

  const loadSeeds = async (themeIds) => {
    if (!themeIds?.length) {
      setSeeds([]);
      return;
    }

    setLoading(true);
    try {
      const responses = await Promise.all(themeIds.map((themeId) => api.get(`/seeds/theme/${themeId}`)));
      const mergedSeeds = responses
        .flatMap((response) => response.data)
        .filter(
          (seed, index, array) => array.findIndex((candidate) => candidate._id === seed._id) === index
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setSeeds(mergedSeeds);

      if (mergedSeeds.length > 0) {
        setSelectedSeed((current) => {
          const stillExists = current && mergedSeeds.find((seed) => seed._id === current._id);
          return stillExists || mergedSeeds[0];
        });
      } else {
        setSelectedSeed(null);
        setSeedTree(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const createSeed = async (payload) => {
    const response = await api.post("/seeds", payload);
    const createdSeed = response.data;

    setSeeds((current) => {
      const exists = current.some((seed) => seed._id === createdSeed._id);
      return exists ? current : [createdSeed, ...current];
    });
    setSelectedSeed(response.data);

    const createdTheme = themes.find((theme) => theme._id === payload.themeId);

    if (createdTheme) {
      setSelectedThemes((current) => {
        const alreadySelected = current.some((theme) => theme._id === createdTheme._id);
        return alreadySelected ? current : [createdTheme, ...current];
      });
    }

    return createdSeed;
  };

  const loadSeedTree = async (seedId) => {
    if (!seedId) {
      setSeedTree(null);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/seeds/${seedId}/tree`);
      setSeedTree(response.data);
    } finally {
      setLoading(false);
    }
  };

  const createReed = async (payload) => {
    await api.post("/reeds", payload);
    await loadSeedTree(payload.seedId);
  };

  const toggleSeedUpvote = async (seedId) => {
    await api.post(`/seeds/${seedId}/upvote`);
    if (selectedThemes.length) {
      await loadSeeds(selectedThemes.map((theme) => theme._id));
    }
    await loadSeedTree(seedId);
  };

  const toggleReedUpvote = async (reedId) => {
    await api.post(`/reeds/${reedId}/upvote`);
    if (selectedSeed?._id) {
      await loadSeedTree(selectedSeed._id);
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      colorMode,
      themes,
      selectedThemes,
      seeds,
      selectedSeed,
      seedTree,
      loading,
      toggleThemeSelection,
      clearThemeSelection,
      toggleColorMode,
      setSelectedThemes,
      setSelectedSeed,
      authSubmit,
      updateProfile,
      logout,
      loadThemes,
      createTheme,
      loadSeeds,
      createSeed,
      loadSeedTree,
      createReed,
      toggleSeedUpvote,
      toggleReedUpvote,
    }),
    [token, user, colorMode, themes, selectedThemes, seeds, selectedSeed, seedTree, loading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
