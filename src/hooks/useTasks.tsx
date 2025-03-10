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

  const handleAddTask = (newTask: Task) => {
    // Prevent duplicates by checking if task already exists (based on Firestore ID)
    if (!tasks.some((task) => task.id === newTask.id)) {
      setTasks([...tasks, newTask]);
    }
  };

  // DELETE A TASK
  const handleDelete = async (taskId: string) => {
    try {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      console.log("Attempting to delete task with ID:", taskId);
      const taskRef = doc(db, "tasks", taskId);
      await deleteDoc(taskRef);
      console.log(`Task ${taskId} deleted from Firestore`);
      // Update local tasks state to remove the deleted task
      setTasks(tasks.filter((t) => t.id !== taskId));
      if (selectedTask?.id === taskId) {
        setSelectedTask(null); // Clear selectedTask if it matches the deleted task
      }
      setError(null);
    } catch (err: any) {
      setError("Failed to delete task: " + err.message);
      console.error("Delete error:", err);
    }
  };

  // DECLINE A TASK
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

      // Update local tasks state
      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, ...updatedTaskData } : t))
      );

      // Update selectedTask if it matches
      if (selectedTask?.id === taskId) {
        setSelectedTask({ ...selectedTask, ...updatedTaskData });
      }
      setError(null);
      return true; // Indicate success
    } catch (err: any) {
      setError("Failed to decline task: " + err.message);
      console.error("Decline error:", err);
      return false; // Indicate failure
    }
  };

  const toDoTasks = tasks.filter((task) => task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const doneTasks = tasks.filter((task) => task.status === "Done");

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
  };
};
