import { Timestamp } from "firebase/firestore";

export interface PartnerData {
  id: string;
  firstName: string;
  lastName: string;
}

export interface UserData {
  photoURL?: string;
  createdAt: Timestamp;
  email: string;
  firstName: string;
  lastName: string;
  partnerId: string | null;
  role: "husband" | "wife";
  invitations: string[];
  job?: string;
  height?: string;
  weight?: string;
  birthday?: string;
  [key: string]: any; // Allows additional fields
}

export interface Invitation {
  id: string;
  senderId: string;
  senderFirstName: string;
  senderLastName: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done" | "Pending Approval";
  creator: "self" | "partner";
  partnerId?: string;
  creatorId?: string;
  createdAt: string; // ISO date string, e.g., '2025-02-23'
  dueDate: string; // ISO date string, e.g., '2025-02-25'
  priority: "Low" | "Medium" | "High";
  declined?: boolean;
  declineMessage?: string;
  userId: string;
  edited?: boolean;
}
