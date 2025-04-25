import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { PartnerData } from "../types";

export const usePartnerData = () => {
  const { userData, loading: authLoading } = useAuth();
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartnerData = async () => {
    if (!userData) {
      return; // Wait for userData to load
    }

    if (!userData.partnerId) {
      setPartnerData(null);
      setError("No partner ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const partnerRef = doc(db, "users", userData.partnerId);
      const partnerSnap = await getDoc(partnerRef);
      if (partnerSnap.exists()) {
        const data = {
          id: partnerSnap.id,
          ...partnerSnap.data(),
        } as PartnerData;
        setPartnerData(data);
      } else {
        setPartnerData(null);
        setError("Partner not found");
      }
    } catch (err) {
      setError("Failed to fetch partner data");
      setPartnerData(null);
      console.error("Error fetching partner data:", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500); // Maintain 500ms delay for UI consistency
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchPartnerData();
    }
  }, [userData?.partnerId, authLoading]);

  return { partnerData, loading, error };
};
