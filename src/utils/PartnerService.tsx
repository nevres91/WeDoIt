import { db } from "../services/firebase";
import {
  doc,
  updateDoc,
  arrayRemove,
  query,
  collection,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// --------------ACCEPT INVITATION--------------
export const acceptInvitation = async (
  userId: string | null,
  inviterId: string
) => {
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
};

// --------------REJECT INVITATION--------------
export const rejectInvitation = async (
  userId: string | undefined,
  inviterId: string
) => {
  if (!userId || !inviterId) {
    console.error("Error: Missing userId or inviterId");
    return;
  }
  await updateDoc(doc(db, "users", userId), {
    invitations: arrayRemove(inviterId),
  });
};
// --------------LEAVE PARTNER--------------
export const leavePartner = async (
  userId: string | undefined,
  partnerId: string | null
) => {
  if (!userId || !partnerId) return;

  try {
    const userTasksQuery = query(
      collection(db, "tasks"),
      where("creatorId", "==", userId)
    );
    const partnerTasksQuery = query(
      collection(db, "tasks"),
      where("creatorId", "==", partnerId)
    );

    const userNotificationsQuery = query(
      collection(db, "notifications"),
      where("recipient", "==", userId)
    );
    const partnerNotificationsQuery = query(
      collection(db, "notifications"),
      where("recipient", "==", partnerId)
    );

    const userTasksSnapshot = await getDocs(userTasksQuery);
    const partnerTasksSnapshot = await getDocs(partnerTasksQuery);
    const userNotificationsSnapshot = await getDocs(userNotificationsQuery);
    const partnerNotificationsSnapshot = await getDocs(
      partnerNotificationsQuery
    );

    const deletePromises = [
      ...userTasksSnapshot.docs.map((taskDoc) =>
        deleteDoc(doc(db, "tasks", taskDoc.id))
      ),
      ...partnerTasksSnapshot.docs.map((taskDoc) =>
        deleteDoc(doc(db, "tasks", taskDoc.id))
      ),
      ...userNotificationsSnapshot.docs.map((notificationDoc) =>
        deleteDoc(doc(db, "notifications", notificationDoc.id))
      ),
      ...partnerNotificationsSnapshot.docs.map((notificationDoc) =>
        deleteDoc(doc(db, "notifications", notificationDoc.id))
      ),
    ];
    const userRef = doc(db, "users", userId);
    const partnerRef = doc(db, "users", partnerId);
    deletePromises.push(
      updateDoc(userRef, { partnerId: "" }),
      updateDoc(partnerRef, { partnerId: "" })
    );
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error leaving partner:", error);
    throw error;
  }
};
