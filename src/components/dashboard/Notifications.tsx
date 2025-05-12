import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { db } from "../../services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "../../index.css";

interface Notification {
  id: string;
  message: string;
  recipient: string;
  createdAt: string;
  read: boolean;
  type: string; // e.g., "task", "invitation"
  taskId?: string; // Optional for task notifications
  taskTitle?: string; // Optional for task notifications
  relatedId?: string; // Optional for other notification types (e.g., invitation ID)
}

export const Notifications = () => {
  const { userData, user } = useAuth();
  const { t } = useTranslation();
  const [taskNotifications, setTaskNotifications] = useState<Notification[]>(
    []
  );
  const [otherNotifications, setOtherNotifications] = useState<Notification[]>(
    []
  );
  const [taskDeletionNotification, setTaskDeletionNotification] = useState<
    Notification[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      console.log("No user ID available");
      return;
    }

    // Query 1: Task notifications (recipient == userData?.partnerId)
    const taskQuery = query(
      collection(db, "notifications"),
      where("recipient", "==", userData?.partnerId),
      where("type", "==", "task") // Ensure only task notifications
    );

    const taskUnsubscribe = onSnapshot(
      taskQuery,
      (snapshot) => {
        const fetchedNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];
        setTaskNotifications(fetchedNotifications);
      },
      (err) => {
        setError(t("failed_to_fetch_notifications") + err.message);
      }
    );

    // Query 2: invitation notifications (recipient == user?.uid)
    const otherQuery = query(
      collection(db, "notifications"),
      where("recipient", "==", user?.uid),
      where("type", "==", "invitation")
    );

    const otherUnsubscribe = onSnapshot(
      otherQuery,
      (snapshot) => {
        const fetchedNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];
        setOtherNotifications(fetchedNotifications);
      },
      (err) => {
        setError(t("failed_to_fetch_notifications") + err.message);
      }
    );
    // Query 3: task deletion notifications (recipient == user?.uid)
    const taskDeletion = query(
      collection(db, "notifications"),
      where("recipient", "==", user?.uid),
      where("type", "==", "task_deleted")
    );

    const taskDeletionUnsubscribe = onSnapshot(
      taskDeletion,
      (snapshot) => {
        const fetchedNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];
        setTaskDeletionNotification(fetchedNotifications);
      },
      (err) => {
        setError(t("failed_to_fetch_notifications") + err.message);
      }
    );

    return () => {
      taskUnsubscribe();
      otherUnsubscribe();
      taskDeletionUnsubscribe();
    };
  }, [user?.uid, userData?.partnerId, t]);

  const markAsRead = async (notificationId: string) => {
    try {
      console.log(
        "Attempting to mark as read notification with ID:",
        notificationId
      );
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, { read: true });
      console.log("Notification marked as read:", notificationId);
    } catch (err: any) {
      console.error("Mark as read error:", err);
      if (err.code !== "not-found" && err.code !== "permission-denied") {
        setError(t("failed_to_update_notification") + ": " + err.message);
      }
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      console.log("Attempting to delete notification with ID:", notificationId);
      if (!notificationId) {
        throw new Error("Invalid notification ID");
      }
      // Optimistically update UI
      setTaskNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
      setOtherNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
      const notificationRef = doc(db, "notifications", notificationId);
      await deleteDoc(notificationRef);
      console.log("Notification deleted successfully:", notificationId);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Stabilize Firestore
      setDeletePromptId(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(t("failed_to_delete_notification") + ": " + err.message);
      // Revert optimistic update if deletion fails
      setTaskNotifications((prev) => [...prev]);
      setOtherNotifications((prev) => [...prev]);
    }
  };

  // Combine and sort notifications by createdAt (newest first)
  const allNotifications = [
    ...taskNotifications,
    ...otherNotifications,
    ...taskDeletionNotification,
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Helper to render notification content based on type
  const renderNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case "task":
        return (
          <p>
            <span
              className={`${
                notification.read
                  ? "bg-calm-n-cool-4 text-calm-n-cool-1"
                  : "bg-calm-n-cool-1 text-calm-n-cool-4"
              } bg-calm-n-cool-1 p-1 px-2 rounded-tl-md rounded-r-xl `}
            >
              {notification.taskTitle || t("unknown_task")}
            </span>{" "}
            {t("task_notification")}
          </p>
        );
      case "invitation":
        return (
          <p>
            <span
              className={`${
                notification.read
                  ? "bg-calm-n-cool-4 text-calm-n-cool-1"
                  : "bg-calm-n-cool-1 text-calm-n-cool-4"
              } bg-calm-n-cool-1 p-1 px-2 rounded-tl-md rounded-r-xl `}
            >
              {t("invitation")}
            </span>{" "}
            {notification.message}
          </p>
        );
      default:
        return <p>{notification.message}</p>;
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-t from-calm-n-cool-5 to-calm-n-cool-1 p-1 sm:p-2 md:p-6 lg:px-0 max-h-[calc(100%-0px)] overflow-hidden">
      <h1 className="text-3xl text-calm-n-cool-6 text-center flex-1 mb-10 md:mt-7">
        <i className="fa-solid fa-bell"></i> {t("notifications")}
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {allNotifications.length === 0 ? (
        <p className="text-gray-500 text-center">{t("no_notifications")}</p>
      ) : (
        <ul className="space-y-2 max-w-[700px] mx-auto">
          {allNotifications.map((notification) => (
            <li
              key={notification.id}
              onClick={() => {
                if (!deletePromptId) {
                  markAsRead(notification.id);
                }
              }}
              className={`relative p-3 pr-[30px] rounded-md cursor-pointer transition-all duration-200 shadow-md ${
                notification.read
                  ? "bg-gray-100 text-calm-n-cool-4 hover:bg-gray-200"
                  : "bg-calm-n-cool-5 bg-opacity-50 text-calm-n-cool-1 hover:bg-opacity-70"
              }${deletePromptId ? "pointer-events-none opacity-100" : ""}`}
            >
              {renderNotificationContent(notification)}
              <p
                className={`text-sm mt-1 ${
                  notification.read
                    ? "text-calm-n-cool-4"
                    : "text-calm-n-cool-1"
                }`}
              >
                <i className="fa-solid fa-calendar-days"></i>{" "}
                {new Date(notification.createdAt).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                <i className="fa-solid fa-clock ml-2"></i>{" "}
                {new Date(notification.createdAt).toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletePromptId(notification.id);
                }}
                className={`text-red-500 hover:text-red-600 transition-colors absolute top-0 right-0 ${
                  notification.read
                    ? "bg-calm-n-cool-4 hover:bg-calm-n-cool-5"
                    : "bg-calm-n-cool-1 hover:bg-calm-n-cool-1-hover"
                } p-1 px-2 rounded-tr-md rounded-bl-md pointer-events-auto`}
                title={t("delete_notification")}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <div
                className={`w-[10px] h-[10px] absolute bottom-3.5 ${
                  userData?.language === "en" ? "right-[55px]" : "right-[63px]"
                } rounded-full ${notification.read ? "hidden" : ""}`}
              >
                {t("new")}
              </div>
              <div
                className={`w-[10px] h-[10px] absolute bottom-2 right-2 rounded-full ${
                  notification.read ? "bg-gray-400" : "bg-green-500 glow"
                }`}
              ></div>

              {/* DELETE PROMPT */}
              {deletePromptId === notification.id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="w-[400px] h-[200px] bg-white rounded-xl flex flex-col p-5 py-10 items-center justify-between">
                    <h3 className="text-calm-n-cool-5 text-xl">
                      {t("delete_notification")}
                    </h3>
                    <div className="flex w-full space-x-2">
                      <button
                        className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 active:bg-gray-700 transition-all duration-200"
                        onClick={() => setDeletePromptId(null)}
                      >
                        {t("cancel")}
                      </button>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:bg-red-700 transition-all duration-200"
                      >
                        {t("yes")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
