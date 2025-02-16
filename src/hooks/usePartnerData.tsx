import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export const usePartnerData = () => {
  const { userData } = useAuth();
  const [partnerData, setPartnerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPartner = async () => {
      if (userData?.partnerId) {
        const partnerDoc = await getDoc(doc(db, "users", userData.partnerId));
        setPartnerData(partnerDoc.exists() ? partnerDoc.data() : null);
        setLoading(false);
      } else {
        setTimeout(() => {
          //Prevent wrong image to appear before partnerData is fetched
          setLoading(false);
        }, 500);
      }
    };

    fetchPartner();
  }, [userData]);

  return { partnerData, loading }; // Always returning an object, even if partnerData is null
};
