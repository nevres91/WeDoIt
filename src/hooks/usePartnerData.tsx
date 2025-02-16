import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { PartnerData } from "../types";

export const usePartnerData = () => {
  const { userData } = useAuth();
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPartnerData = async () => {
    setLoading(true);
    if (userData?.partnerId) {
      const partnerRef = doc(db, "users", userData.partnerId);
      const partnerSnap = await getDoc(partnerRef);
      if (partnerSnap.exists()) {
        setPartnerData(partnerSnap.data() as PartnerData);
      } else {
        setPartnerData(null);
      }
    } else {
      setPartnerData(null);
    }
    // Prevent showing any image before partnerData is fetched
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchPartnerData();
  }, [userData?.partnerId]);

  return { partnerData, loading };
};
