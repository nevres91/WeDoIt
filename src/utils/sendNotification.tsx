import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebase";

export const sendNotification = async (
  recipientId: string,
  message: string,
  type: string,
  relatedId?: string // Optional: for taskId or invitationId
) => {
  try {
    const notification = {
      recipient: recipientId,
      message,
      type, // e.g., "task", "invitation"
      relatedId: relatedId || null,
      createdAt: new Date().toISOString(),
      read: false,
    };
    await addDoc(collection(db, "notifications"), notification);
    console.log("notification was sent successfuly:", notification);
  } catch (error: any) {
    console.error("Error sending notification:", error.message);
    throw new Error("Failed to send notification: " + error.message);
  }
};
