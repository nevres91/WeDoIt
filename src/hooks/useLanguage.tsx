// src/hooks/useLanguage.ts
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { loadUserLanguage } from "../i18n/config";

export const useLanguage = () => {
  const { userData } = useAuth();

  useEffect(() => {
    if (userData) {
      loadUserLanguage(userData); // Call when userData changes
    }
  }, [userData]); // Dependency on userData
};
