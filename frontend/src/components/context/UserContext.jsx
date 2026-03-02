import React, { createContext, useContext, useState, useEffect } from "react";
import { userData as mockUserData } from "../../data/mockData";
import { useAvatarUpload } from "../../hooks/useAvatarUpload";
import API from "../../api/axios";

const UserContext = createContext();

function mergeUserWithMock(user) {
  if (!user) return null;
  return {
    ...mockUserData,
    ...user,
    stats: { ...mockUserData.stats, ...(user.stats || {}) },
  };
}

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUserRaw] = useState(null);

  // Listen for force-logout event from axios interceptor
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
    };
    window.addEventListener("force-logout", handleForceLogout);
    return () => window.removeEventListener("force-logout", handleForceLogout);
  }, []);

  // This is your setUser function
  const setUser = (u) => {
    const merged = mergeUserWithMock(u);
    setUserRaw(merged);
    if (merged) {
      localStorage.setItem("user", JSON.stringify(merged));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Initial load from localStorage and verify with server (ONLY ON MOUNT)
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Check if user was explicitly logged out
        const isLoggedOut = sessionStorage.getItem("loggedOut");
        if (isLoggedOut === "true") {
          // User explicitly logged out, don't restore session
          sessionStorage.removeItem("loggedOut");
          setUserRaw(null);
          localStorage.removeItem("user");
          setLoading(false);
          return;
        }

        // Try to load from localStorage
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUserRaw(mergeUserWithMock(parsedUser));

          // Verify with server (if API is available)
          try {
            const res = await API.get("/users/me");
            setUser(res.data); // update with fresh user from server
          } catch (err) {
            // If server check fails with 401, clear session
            if (err.response?.status === 401) {
              setUser(null);
              localStorage.removeItem("user");
            }
            // Otherwise keep the cached user for offline support
          }
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
    // eslint-disable-next-line
  }, []); // Run ONLY once on mount

  const uploadAvatar = useAvatarUpload();

  const updateAvatar = async (file) => {
    try {
      const updatedData = await uploadAvatar(file);
      if (!updatedData) throw new Error("No data from avatar upload");
      setUser(updatedData);
    } catch (error) {
      console.error("Error updating avatar:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateAvatar, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
