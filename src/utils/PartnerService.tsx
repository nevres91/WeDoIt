import { useAuth } from "../context/AuthContext";
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

//WORKS BUT ITS NOT A SOLUTION BECAUSE IT ONLY FORCES A REFRESH
// export const acceptInvitation = async (
//   userId: string | undefined,
//   inviterId: string,
//   setUserData: any,
//   getDoc: any
// ) => {
//   console.log("Accepting invitation: ", { userId, inviterId }); // Debug log

//   if (!userId || !inviterId) {
//     console.error("Error: Missing userId or inviterId");
//     return;
//   }

//   await updateDoc(doc(db, "users", userId), {
//     partnerId: inviterId,
//     invitations: arrayRemove(inviterId),
//   });

//   await updateDoc(doc(db, "users", inviterId), {
//     partnerId: userId,
//   });

//   console.log("Invitation accepted successfully!");

//   // Force refresh userData manually (temporary fix)
//   const userRef = doc(db, "users", userId);
//   const docSnap = await getDoc(userRef);
//   if (docSnap.exists()) {
//     console.log("Manually refreshing user data after invitation acceptance");
//     setUserData(docSnap.data());
//   }
// };

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
