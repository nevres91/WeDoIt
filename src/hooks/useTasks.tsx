import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Task } from "../types";
import { db } from "../services/firebase";

export const useTasks = (userId?: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // -------------------------------FETCH TASKS-------------------------------
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, "tasks"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedTasks = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Task)
        );
        setTasks(fetchedTasks);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
        console.error("Error fetching tasks:", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // -------------------------------ADD TASK-------------------------------
  const handleAddTask = (newTask: Task) => {
    if (
      newTask.userId === userId &&
      !tasks.some((task) => task.id === newTask.id)
    ) {
      setTasks([...tasks, newTask]);
    }
  };

  // -------------------------------DELETE TASK-------------------------------
  const handleDelete = async (taskId: string) => {
    try {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }
      const taskRef = doc(db, "tasks", taskId);
      await deleteDoc(taskRef);
      setTasks(tasks.filter((t) => t.id !== taskId));
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
      setError(null);
    } catch (err: any) {
      setError("Failed to delete task: " + err.message);
      console.error("Delete error:", err);
    }
  };

  // -------------------------------DECLINE TASK-------------------------------
  const handleDecline = async (taskId: string, declineMessage: string) => {
    try {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }
      if (!declineMessage.trim()) {
        throw new Error("Decline message is required");
      }

      const taskRef = doc(db, "tasks", taskId);
      const updatedTaskData = {
        declined: true,
        declineMessage,
      };
      await updateDoc(taskRef, updatedTaskData);

      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, ...updatedTaskData } : t))
      );

      if (selectedTask?.id === taskId) {
        setSelectedTask({ ...selectedTask, ...updatedTaskData });
      }
      setError(null);
      return true;
    } catch (err: any) {
      setError("Failed to decline task: " + err.message);
      console.error("Decline error:", err);
      return false;
    }
  };

  // -------------------------------REACTIVATE TASK-------------------------------
  const reactivateTask = async (taskId: string) => {
    try {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const taskRef = doc(db, "tasks", taskId);
      const updatedTaskData = {
        declined: false,
        declineMessage: "",
        status: "To Do" as const,
        dueDate: tomorrow.toISOString(),
      };

      await updateDoc(taskRef, updatedTaskData);

      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, ...updatedTaskData } : t))
      );

      if (selectedTask?.id === taskId) {
        setSelectedTask({ ...selectedTask, ...updatedTaskData });
      }
      setError(null);
      return true;
    } catch (err: any) {
      setError("Failed to reactivate task: " + err.message);
      console.error("Reactivate error:", err);
      return false;
    }
  };

  // -------------------------------FILTERING TASKS-------------------------------

  const toDoTasks = tasks.filter(
    (task) => task.status === "To Do" && task.declined !== true
  );
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress" && task.declined !== true
  );
  const pendingApprovalTasks = tasks.filter(
    (task) => task.status === "Pending Approval" && task.declined !== true
  );
  const doneTasks = tasks.filter(
    (task) => task.status === "Done" && task.declined !== true
  );
  const declinedTasks = tasks.filter((task) => task.declined === true);

  const expiredTasks = tasks.filter((task) => {
    if (!task.dueDate || task.declined === true || task.status === "Done") {
      return false;
    }
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate < now;
  });

  return {
    tasks,
    toDoTasks,
    inProgressTasks,
    doneTasks,
    loading,
    error,
    setTasks,
    handleAddTask,
    handleDelete,
    selectedTask,
    setSelectedTask,
    handleDecline,
    declinedTasks,
    expiredTasks,
    reactivateTask,
    pendingApprovalTasks,
  };
};
