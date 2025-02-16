import { db } from "../services/firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

// --------------ACCEPT INVITATION--------------
export const acceptInvitation = async (
  userId: string | null,
  inviterId: string
) => {
  console.log("Accepting invitation: ", { userId, inviterId }); // Debug log

  if (!userId || !inviterId) {
    console.error("Error: Missing userId or inviterId");
    return;
  }

  await updateDoc(doc(db, "users", userId), {
    partnerId: inviterId,
    invitations: arrayRemove(inviterId),
  });

  await updateDoc(doc(db, "users", inviterId), {
    partnerId: userId,
  });

  console.log("Invitation accepted successfully!");
};

// --------------REJECT INVITATION--------------
export const rejectInvitation = async (
  userId: string | undefined,
  inviterId: string
) => {
  console.log("Rejecting invitation: ", { userId, inviterId }); // Debug log

  if (!userId || !inviterId) {
    console.error("Error: Missing userId or inviterId");
    return;
  }

  await updateDoc(doc(db, "users", userId), {
    invitations: arrayRemove(inviterId),
  });

  console.log("Invitation rejected successfully!");
};

// --------------LEAVE PARTNER--------------
export const leavePartner = async (
  userId: string | undefined,
  partnerId: string | null,
  onSuccess: () => void // Callback function to update UI
) => {
  if (!userId || !partnerId) {
    console.error("Error: Missing userId or partnerId");
    return;
  }

  try {
    const userRef = doc(db, "users", userId);
    const partnerRef = doc(db, "users", partnerId);

    await updateDoc(userRef, { partnerId: "" });
    await updateDoc(partnerRef, { partnerId: "" });

    console.log("Partner successfully removed!");

    onSuccess(); // Trigger UI update after successful Firestore update
  } catch (error) {
    console.error("Error leaving partner:", error);
  }
};
