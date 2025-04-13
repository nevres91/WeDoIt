import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { Task } from "../types";
import { auth, db } from "../services/firebase";

// Define the NewTask interface for task creation input
export interface NewTask {
  title: string;
  description: string;
  creator: "self" | "partner";
  dueDate: string;
  priority: "Low" | "Medium" | "High";
}

// Shared validation and base task creation
const validateNewTask = (
  newTask: NewTask
): { success: boolean; message?: string } => {
  if (!newTask.title.trim() || !newTask.dueDate) {
    return { success: false, message: "Title and due date are required" };
  }
  return { success: true };
};

const createTaskBase = (newTask: NewTask): Omit<Task, "id" | "userId"> => ({
  title: newTask.title,
  description: newTask.description,
  status: "To Do",
  creator: newTask.creator,
  createdAt: new Date().toISOString(),
  dueDate: newTask.dueDate,
  priority: newTask.priority,
});

// ------------------------------CREATE TASK FOR PARTNER ONLY------------------------------
export const createPartnerTask = async (
  newTask: NewTask,
  onAddTask: (task: Task) => void
): Promise<{ success: boolean; message?: string }> => {
  const validation = validateNewTask(newTask);
  if (!validation.success) return validation;

  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not authenticated");

    const taskBase = createTaskBase(newTask);
    const tasksCollection = collection(db, "tasks");

    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw new Error("User document not found");

    const partnerId = userDoc.data()?.partnerId;
    if (!partnerId) {
      return {
        success: false,
        message: "No partner linked. Please link a partner first.",
      };
    }

    const task = {
      ...taskBase,
      userId: partnerId, // The partner who will work on the task
      partnerId: partnerId, // Explicitly store partnerId for approval workflow
      creatorId: currentUser.uid, // Track who created the task (optional but useful)
      creator: "partner" as const, // Assuming this indicates a partner-related task
    };
    const docRef = await addDoc(tasksCollection, task);
    onAddTask({ ...task, id: docRef.id });
    return { success: true, message: "Task created for your partner!" };
  } catch (err: any) {
    console.error("Error creating partner task:", err.message);
    return { success: false, message: err.message || "Failed to create task" };
  }
};
// ------------------------------CREATE TASK FOR SELF OR PARTNER------------------------------
export const createTask = async (
  newTask: NewTask,
  onAddTask: (task: Task) => void
): Promise<{ success: boolean; message?: string }> => {
  const validation = validateNewTask(newTask);
  if (!validation.success) return validation;

  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not authenticated");

    const taskBase = createTaskBase(newTask);
    const tasksCollection = collection(db, "tasks");

    if (newTask.creator === "self") {
      const task = { ...taskBase, userId: currentUser.uid };
      const docRef = await addDoc(tasksCollection, task);
      onAddTask({ ...task, id: docRef.id });
      return { success: true, message: "Task created successfully!" };
    } else {
      // For partner
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) throw new Error("User document not found");

      const partnerId = userDoc.data()?.partnerId;
      if (!partnerId) {
        return {
          success: false,
          message: "No partner linked. Please link a partner first.",
        };
      }

      const task = { ...taskBase, userId: partnerId };
      const docRef = await addDoc(tasksCollection, task);
      onAddTask({ ...task, id: docRef.id });
      return { success: true, message: "Task created for your partner!" };
    }
  } catch (err: any) {
    console.error("Error creating task:", err.message);
    return { success: false, message: err.message || "Failed to create task" };
  }
};
