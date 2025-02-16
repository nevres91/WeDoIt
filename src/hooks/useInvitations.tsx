import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { acceptInvitation, rejectInvitation } from "../utils/PartnerService";
import { useAuth } from "../context/AuthContext";
import { Invitation } from "../types";

export const useInvitations = () => {
  const { user, userData } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      if (!userData?.invitations?.length) {
        setInvitations([]); // Clear invitations when there are none
        return;
      }

      try {
        const inviterDetails = await Promise.all(
          userData.invitations.map(async (inviterId: string) => {
            const inviterDoc = await getDoc(doc(db, "users", inviterId));
            if (inviterDoc.exists()) {
              const inviterData = inviterDoc.data();
              return {
                id: inviterId, // Ensure each invitation has an ID
                senderId: inviterId,
                senderFirstName: inviterData.firstName,
                senderLastName: inviterData.lastName,
              };
            }
            return null; // Filter out invalid inviter data
          })
        );

        // Filter out null results and set the state
        setInvitations(inviterDetails.filter(Boolean) as Invitation[]);
      } catch (error) {
        console.error("Error fetching invitations:", error);
      }
    };

    fetchInvitations();
  }, [userData]); // Dependency array includes only userData to prevent unnecessary re-fetching

  const handleAccept = async (inviterId: string) => {
    if (!user?.uid) return;
    try {
      await acceptInvitation(user.uid, inviterId);
      setInvitations((prevInvitations) =>
        prevInvitations.filter((inviter) => inviter.senderId !== inviterId)
      );
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  const handleReject = async (inviterId: string) => {
    if (!user?.uid) return;
    try {
      await rejectInvitation(user.uid, inviterId);
      setInvitations((prevInvitations) =>
        prevInvitations.filter((inviter) => inviter.senderId !== inviterId)
      );
    } catch (error) {
      console.error("Error rejecting invitation:", error);
    }
  };

  return { invitations, handleAccept, handleReject };
};
