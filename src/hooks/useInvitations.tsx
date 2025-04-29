import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { acceptInvitation, rejectInvitation } from "../utils/PartnerService";
import { useAuth } from "../context/AuthContext";
import { Invitation } from "../types";
import { sendNotification } from "../utils/sendNotification";
import { useTranslation } from "react-i18next";

export const useInvitations = () => {
  const { user, userData } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationsMessage, setInvitationsMessage] = useState<string | null>(
    null
  );

  const { t } = useTranslation();
  useEffect(() => {
    const fetchInvitations = async () => {
      if (!user?.uid || !userData?.invitations?.length) {
        setInvitations([]); // Clear invitations if none exist
        return;
      }

      try {
        const validInvitations: Invitation[] = [];
        const updatedInvitations = [...userData.invitations]; // Clone array for potential updates

        for (const inviterId of userData.invitations) {
          const inviterDoc = await getDoc(doc(db, "users", inviterId));
          if (!inviterDoc.exists()) continue;

          const inviterData = inviterDoc.data();

          // If inviter has a partner, remove them from Firestore and local state
          if (inviterData?.partnerId) {
            setInvitationsMessage(
              `The invitation from ${inviterData.firstName} was removed because they already have a partner.`
            );
            setTimeout(() => {
              setInvitationsMessage(null);
            }, 5000);
            // Remove inviter from local `updatedInvitations`
            const index = updatedInvitations.indexOf(inviterId);
            if (index !== -1) updatedInvitations.splice(index, 1);

            // Update Firestore to remove the inviter ID from the current user's invitations
            await updateDoc(doc(db, "users", user.uid), {
              invitations: updatedInvitations,
            });

            continue; // Skip adding this invitation to state
          }

          validInvitations.push({
            id: inviterId,
            senderId: inviterId,
            senderFirstName: inviterData.firstName,
            senderLastName: inviterData.lastName,
          });
        }

        setInvitations(validInvitations); // Update state with only valid invitations
      } catch (error) {
        console.error("Error fetching invitations:", error);
      }
    };

    fetchInvitations();
  }, [userData, user?.uid]); // Re-run when userData or user ID changes

  // -------------ACCEPT PARTNERSHIP INVITATION-------------
  const handleAccept = async (inviterId: string) => {
    if (!user?.uid) return;
    try {
      // Fetch the inviter's document from Firestore
      const inviterDoc = await getDoc(doc(db, "users", inviterId));
      if (!inviterDoc.exists()) {
        console.error("Inviter not found.");
        return;
      }
      await acceptInvitation(user.uid, inviterId);
      // Remove the invitation from the list
      setInvitations((prevInvitations) =>
        prevInvitations.filter((inviter) => inviter.senderId !== inviterId)
      );
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };
  // -------------REJECT PARTNERSHIP INVITATION-------------
  const handleReject = async (inviterId: string) => {
    if (!user?.uid) return;
    try {
      await rejectInvitation(user.uid, inviterId);
      const message =
        userData.role === "wife"
          ? t("invitation_rejected_message_female", {
              name: userData.firstName,
            })
          : t("invitation_rejected_message_male", {
              name: userData.firstName,
            });
      await sendNotification(inviterId, message, "invitation");
      console.log("inviter id", inviterId);
      setInvitations((prevInvitations) =>
        prevInvitations.filter((inviter) => inviter.senderId !== inviterId)
      );
    } catch (error) {
      console.error("Error rejecting invitation:", error);
    }
  };

  return { invitations, handleAccept, handleReject, invitationsMessage };
};
