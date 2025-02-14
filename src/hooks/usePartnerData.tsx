import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export const usePartnerData = () => {
  const { userData } = useAuth();
  const [partnerData, setPartnerData] = useState<any>(null);

  useEffect(() => {
    const fetchPartner = async () => {
      if (userData?.partnerId) {
        const partnerDoc = await getDoc(doc(db, "users", userData.partnerId));
        setPartnerData(partnerDoc.exists() ? partnerDoc.data() : null);
      }
    };

    fetchPartner();
  }, [userData]);

  return { partnerData }; // Always returning an object, even if partnerData is null
};
