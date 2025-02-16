import { db } from "../services/firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

export const acceptInvitation = async (
  userId: string | undefined,
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
