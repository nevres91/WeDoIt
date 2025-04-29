import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

const useUnreadNotifications = () => {
  const { user, userData } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    // Track counts separately to avoid race conditions
    let userUnreadCount = 0;
    let taskUnreadCount = 0;

    // Query 1: Unread notifications for current user (recipient == user.uid)
    const userQuery = query(
      collection(db, "notifications"),
      where("recipient", "==", user.uid),
      where("read", "==", false),
      where("type", "in", ["invitation", "task_deleted"])
    );

    const userUnsubscribe = onSnapshot(
      userQuery,
      (snapshot) => {
        userUnreadCount = snapshot.size;
        setUnreadCount(userUnreadCount + taskUnreadCount);
      },
      (err) => {
        console.error("User notifications error:", err);
        setError(`Failed to fetch user notifications: ${err.message}`);
      }
    );

    // Query 2: Unread task notifications (recipient == userData?.partnerId)
    let taskUnsubscribe: (() => void) | undefined;
    if (userData?.partnerId) {
      const taskQuery = query(
        collection(db, "notifications"),
        where("recipient", "==", userData.partnerId),
        where("read", "==", false),
        where("type", "==", "task")
      );

      taskUnsubscribe = onSnapshot(
        taskQuery,
        (snapshot) => {
          taskUnreadCount = snapshot.size;
          setUnreadCount(userUnreadCount + taskUnreadCount);
        },
        (err) => {
          console.error("Task notifications error:", err);
          setError(`Failed to fetch task notifications: ${err.message}`);
        }
      );
    } else {
      taskUnreadCount = 0;
      setUnreadCount(userUnreadCount);
    }

    return () => {
      userUnsubscribe();
      if (taskUnsubscribe) taskUnsubscribe();
    };
  }, [user?.uid, userData]);

  return { unreadCount, error };
};

export default useUnreadNotifications;
