import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { Task } from "../../types";
import { getRemainingTime } from "../../utils/helperFunctions";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useTranslation } from "react-i18next";

const TaskCard: React.FC<{
  task: Task;
  onClick: () => void;
  onUpdateTask?: (task: Task) => void;
  hideActions?: boolean;
}> = ({ task, onClick, hideActions, onUpdateTask }) => {
  const { t } = useTranslation(); // Add translation hook
  const priorityColor = {
    Low: "bg-gray-200 text-gray-800",
    Medium: "bg-yellow-200 text-yellow-800",
    High: "bg-red-200 text-red-800",
  };
  const [taskState, setTaskState] = useState(task);
  const [error, setError] = useState<string | null>(null);
  const { userData } = useAuth();
  const { activeTab } = useDashboard();

  const remainingTime = task.dueDate ? getRemainingTime(task.dueDate) : null;

  // Function to send a notification to the partner
  const sendNotificationToPartner = async (
    taskId: string,
    message: string,
    taskTitle: string
  ) => {
    try {
      if (!taskState.partnerId) {
        throw new Error("Partner ID is missing; cannot send notification.");
      }

      const notification = {
        taskId,
        taskTitle,
        message,
        recipient: taskState.partnerId,
        createdAt: new Date().toISOString(),
        read: false,
      };
      await addDoc(collection(db, "notifications"), notification);

      // Update partner's user data with pending approvals
      const partnerRef = doc(db, "users", taskState.partnerId); // TypeScript now knows partnerId is string
      await updateDoc(partnerRef, {
        pendingTaskApprovals: arrayUnion(taskId),
      });
    } catch (err: any) {
      setError(t("failed_to_send_notification") + err.message);
      console.log(err.message);
    }
  };

  const handleStatusChange = async (
    newStatus: Task["status"],
    dueDate?: string
  ) => {
    try {
      let updatedTask = {
        ...taskState,
        status: newStatus,
        ...(dueDate && { dueDate }),
      };

      if (
        taskState.creator === "partner" &&
        newStatus === "Done" &&
        activeTab !== "partner"
      ) {
        updatedTask.status = "Pending Approval";
        await sendNotificationToPartner(
          task.id,
          t("task_pending_approval_message", { title: task.title }),
          task.title
        );
      }

      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        status: updatedTask.status,
        ...(dueDate && { dueDate }),
      });

      setTaskState(updatedTask);
      if (onUpdateTask) onUpdateTask(updatedTask);
      setError(null);
    } catch (err: any) {
      setError(t("failed_to_update_status") + err.message);
    }
  };

  return (
    <div
      className={`flex relative overflow-hidden justify-between w-full xs:w-[45%] lg:w-full min-w-[200px] rounded-lg shadow-md hover:shadow-lg transition-all duration-100 h-[110px] ${
        remainingTime?.text === "Expired" &&
        task.status !== "Done" &&
        task.declined !== true
          ? "bg-gray-300 border-l-4 border-gray-500 hover:bg-gray-200"
          : activeTab === "declined" && userData?.role === "husband"
          ? "bg-blue-50 border-l-4 border-blue-400 hover:bg-blue-100"
          : activeTab === "declined" && userData?.role === "wife"
          ? "bg-pink-50 border-l-4 border-pink-400 hover:bg-pink-100"
          : activeTab === "partner" && task.creator === "self"
          ? userData?.role === "wife"
            ? "bg-blue-50 border-l-4 border-blue-400 hover:bg-blue-100"
            : "bg-pink-50 border-l-4 border-pink-400 hover:bg-pink-100"
          : activeTab === "partner" && task.creator === "partner"
          ? userData?.role === "wife"
            ? "bg-pink-50 border-l-4 border-pink-400 hover:bg-pink-100"
            : "bg-blue-50 border-l-4 border-blue-400 hover:bg-blue-100"
          : activeTab === "home" && task.creator === "self"
          ? userData?.role === "wife"
            ? "bg-pink-50 border-l-4 border-pink-400 hover:bg-pink-100"
            : "bg-blue-50 border-l-4 border-blue-400 hover:bg-blue-100"
          : userData?.role === "wife"
          ? "bg-blue-50 border-l-4 border-blue-400 hover:bg-blue-100"
          : "bg-pink-50 border-l-4 border-pink-400 hover:bg-pink-100"
      }`}
    >
      <div //Expired overlay
        className={`w-full h-full bg-red-200 absolute top-0 left-0 bg-opacity-30 flex items-center justify-center cursor-pointer ${
          task.declined ||
          (remainingTime?.text === "Expired" && task.status !== "Done")
            ? ""
            : "hidden"
        }`}
        onClick={onClick}
      >
        <p className="font-bold text-2xl text-red-600 z-10 opacity-70 absolute bottom-1 right-3">
          {task.declined ? t("declined") : t("expired")}
        </p>
      </div>
      <div
        onClick={onClick}
        className={`flex flex-col cursor-pointer rounded-lg p-2 h-full ${
          remainingTime?.text === "Expired" || task.status === "Done"
            ? "w-full"
            : "w-[81%]"
        }`}
      >
        <div className="flex justify-between items-start">
          <p
            className={`text-sm font-semibold mr-2 ${
              remainingTime?.text === "Expired" &&
              task.status !== "Done" &&
              task.declined !== true
                ? "text-gray-900"
                : activeTab === "declined" && userData?.role === "husband"
                ? "text-blue-900"
                : activeTab === "declined" && userData?.role === "wife"
                ? "text-pink-800"
                : activeTab === "partner" && task.creator === "self"
                ? userData?.role === "wife"
                  ? "text-blue-900"
                  : "text-pink-800"
                : activeTab === "partner" && task.creator === "partner"
                ? userData?.role === "wife"
                  ? "text-pink-800"
                  : "text-blue-900"
                : activeTab === "home" && task.creator === "self"
                ? userData?.role === "wife"
                  ? "text-pink-800"
                  : "text-blue-900"
                : userData?.role === "wife"
                ? "text-blue-900"
                : "text-pink-800"
            }`}
          >
            {task.title}
          </p>
        </div>
        <div className="w-full h-[55%] overflow-hidden text-xs">
          <p
            className="line-clamp-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {task.description}
          </p>
        </div>
        <div className="flex items-center space-x-2 absolute bottom-1 left-1">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              priorityColor[task.priority]
            }`}
          >
            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
            {t(task.priority.toLowerCase())}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full 
              ${
                activeTab === "declined" && userData?.role === "husband"
                  ? "bg-blue-200 text-blue-800"
                  : activeTab === "declined" && userData?.role === "wife"
                  ? "bg-pink-200 text-pink-800"
                  : activeTab === "partner" && task.creator === "self"
                  ? userData?.role === "wife"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-pink-200 text-pink-800"
                  : activeTab === "partner" && task.creator === "partner"
                  ? userData?.role === "wife"
                    ? "bg-pink-200 text-pink-800"
                    : "bg-blue-200 text-blue-800"
                  : activeTab === "home" && task.creator === "self"
                  ? userData?.role === "wife"
                    ? "bg-pink-200 text-pink-800"
                    : "bg-blue-200 text-blue-800"
                  : userData?.role === "wife"
                  ? "bg-blue-200 text-blue-800"
                  : "bg-pink-200 text-pink-800"
              }`}
          >
            {activeTab === "declined" ? (
              <div>
                <i className="fa-solid fa-mars"></i> {t("from_you")}
              </div>
            ) : activeTab === "partner" && task.creator === "self" ? (
              userData?.role === "wife" ? (
                <div>
                  <i className="fa-solid fa-mars"></i> {t("from_husband")}
                </div>
              ) : (
                <div>
                  <i className="fa-solid fa-venus"></i> {t("from_wife")}
                </div>
              )
            ) : activeTab === "partner" && task.creator === "partner" ? (
              userData?.role === "wife" ? (
                <div>
                  <i className="fa-solid fa-mars"></i> {t("from_you")}
                </div>
              ) : (
                <div>
                  <i className="fa-solid fa-mars"></i> {t("from_husband")}
                </div>
              )
            ) : task.creator === "self" ? (
              <div>
                <i className="fa-solid fa-mars"></i> {t("from_you")}
              </div>
            ) : userData?.role === "wife" ? (
              <div>
                <i className="fa-solid fa-mars"></i> {t("from_husband")}
              </div>
            ) : (
              <div>
                <i className="fa-solid fa-venus"></i> {t("from_wife")}
              </div>
            )}
          </span>
          {remainingTime && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                remainingTime.color
              } ${task.status === "Done" ? "hidden" : ""}`}
            >
              <i className="fa-solid fa-hourglass-start"></i>{" "}
              {remainingTime.text}{" "}
              {/* Note: This might need separate handling */}
            </span>
          )}
          {task.edited && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full bg-gray-200 text-gray-700`}
            >
              <i className="fa-solid fa-file-pen"></i> {t("edited")}
            </span>
          )}
        </div>
      </div>
      <div //Buttons
        className={`w-[19%] max-w-[85px] h-full rounded-lg p-2 font-normal min-w-[75px] ${
          remainingTime?.text === "Expired" || task.status === "Done"
            ? "hidden w-0"
            : ""
        }`}
      >
        <button
          onClick={() => {
            const nextStatus =
              task.status === "To Do"
                ? "In Progress"
                : task.status === "In Progress"
                ? "Done"
                : "To Do";
            handleStatusChange(nextStatus);
          }}
          className={`w-full text-xs px-2 py-1 rounded-full bg-green-200 text-green-700 my-1 hover:bg-green-400 hover:text-white transition-all duration-100 ${
            hideActions ? "hidden" : ""
          }`}
        >
          {task.status === "To Do"
            ? t("accept")
            : task.status === "In Progress"
            ? t("finish")
            : t("restart")}
        </button>
        <button
          className={`w-full text-xs px-2 py-1 rounded-full bg-red-200 text-red-700 my-1 hover:bg-red-400 hover:text-white transition-all duration-100 ${
            hideActions ? "hidden" : ""
          }`}
        >
          {t("reject")}
        </button>
        <button
          className={`w-full text-xs px-2 py-1 rounded-full bg-red-400 text-white my-1 hover:bg-red-500 hover:text-white transition-all duration-100 ${
            hideActions ? "hidden" : ""
          }`}
        >
          {t("delete")}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
