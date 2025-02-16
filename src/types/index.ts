import { Timestamp } from "firebase/firestore";

export interface PartnerData {
  id: string;
  firstName: string;
  lastName: string;
}

export interface UserData {
  createdAt: Timestamp;
  email: string;
  firstName: string;
  lastName: string;
  partnerId: string | null;
  role: "husband" | "wife";
  invitations: string[];
}

export interface Invitation {
  id: string;
  senderId: string;
  senderFirstName: string;
  senderLastName: string;
}
