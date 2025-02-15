import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { acceptInvitation, rejectInvitation } from "../utils/PartnerService";
import { useAuth } from "../context/AuthContext";

export const useInvitations = () => {
  const { user, userData, setUserData } = useAuth();
  const [invitations, setInvitations] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);

  useEffect(() => {
    if (userData?.invitations?.length) {
      const fetchInviters = async () => {
        const inviterDetails = await Promise.all(
          userData.invitations.map(async (inviterId: string) => {
            const inviterDoc = await getDoc(doc(db, "users", inviterId));
            if (inviterDoc.exists()) {
              return { id: inviterId, ...inviterDoc.data() };
            }
            return null;
          })
        );

        // Filter out null results
        setInvitations(inviterDetails.filter(Boolean) as any);
      };

      fetchInviters();
    }
  }, [userData]);
  const handleAccept = async (inviterId: string) => {
    if (!user?.uid) return;
    await acceptInvitation(user.uid, inviterId);
    setInvitations((prevInvitations) =>
      prevInvitations.filter((inviter) => inviter.id !== inviterId)
    );
  };

  const handleReject = async (inviterId: string) => {
    if (!user?.uid) return;
    await rejectInvitation(user.uid, inviterId);
    setInvitations((prevInvitations) =>
      prevInvitations.filter((inviter) => inviter.id !== inviterId)
    );
  };
  return { invitations, handleAccept, handleReject };
};
