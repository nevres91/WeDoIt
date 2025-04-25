import { useState } from "react";
import { Task } from "../../types";
import { db } from "../../services/firebase";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useTasks } from "../../hooks/useTasks";
import { useDashboard } from "../../context/DashboardContext";
import { getRemainingTime } from "../../utils/helperFunctions";
import { useTranslation } from "react-i18next";
import ReactLinkify from "react-linkify";

const TaskDetails: React.FC<{
  task: Task;
  onClose: () => void;
  onUpdateTask?: (task: Task) => void;
  onReactivate?: (taskId: string) => void;
}> = ({ task, onClose, onUpdateTask, onReactivate }) => {
  const [declineMessage, setDeclineMessage] = useState(
    task.declineMessage || ""
  );
  const [taskState, setTaskState] = useState(task);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || "");
  const [hasDueDate, setHasDueDate] = useState(!!task.dueDate);
  const [error, setError] = useState<string | null>(null);
  const { handleDelete, handleDecline } = useTasks();
  const { activeTab } = useDashboard();
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [newDueDate, setNewDueDate] = useState("");
  const [hasRestartDueDate, setHasRestartDueDate] = useState(true);

  const { t } = useTranslation();

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
      const partnerRef = doc(db, "users", taskState.partnerId);
      await updateDoc(partnerRef, {
        pendingTaskApprovals: arrayUnion(taskId),
      });
    } catch (err: any) {
      setError(t("failed_to_send_notification") + err.message);
      console.log(err.message);
    }
  };

  const onDecline = async () => {
    const success = await handleDecline(task.id, declineMessage);
    if (success) {
      const updatedTask = {
        ...taskState,
        declined: true,
        declineMessage,
      };
      setTaskState(updatedTask);
      if (onUpdateTask) {
        onUpdateTask(updatedTask);
      }
      setError(null);
      setShowDeclineConfirm(false);
      onClose();
    } else {
      setError(t("failed_to_decline_task"));
      setShowDeclineConfirm(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedTask = {
        ...taskState,
        title: editedTitle,
        description: editedDescription,
        dueDate: hasDueDate ? editedDueDate : null,
        edited: true,
      };
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        title: editedTitle,
        description: editedDescription,
        dueDate: hasDueDate ? editedDueDate : null,
        edited: true,
      });
      setTaskState(updatedTask);
      if (onUpdateTask) {
        onUpdateTask(updatedTask);
      }
      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      setError(t("failed_to_save_edits") + err.message);
    }
  };
  const handleStatusChange = async (
    newStatus: Task["status"],
    dueDate?: string | null
  ) => {
    try {
      let updatedTask = {
        ...taskState,
        status: newStatus,
        ...(dueDate !== undefined && { dueDate }),
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
        ...(dueDate !== undefined && { dueDate }),
      });

      setTaskState(updatedTask);
      if (onUpdateTask) onUpdateTask(updatedTask);
      setError(null);
      if (newStatus === "To Do" && dueDate !== undefined)
        setShowRestartConfirm(false);
      onClose();
    } catch (err: any) {
      setError(t("failed_to_update_status") + err.message);
    }
  };

  const handlePartnerApproval = async (approved: boolean) => {
    try {
      if (!taskState.partnerId) {
        throw new Error("Partner ID is missing; cannot process approval.");
      }

      const newStatus: Task["status"] = approved ? "Done" : "In Progress";
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { status: newStatus });

      const updatedTask: Task = { ...taskState, status: newStatus };
      setTaskState(updatedTask);
      if (onUpdateTask) onUpdateTask(updatedTask);

      const partnerRef = doc(db, "users", taskState.partnerId);
      await updateDoc(partnerRef, {
        pendingTaskApprovals: arrayRemove(task.id),
      });

      setError(null);
      onClose();
    } catch (err: any) {
      setError(t("failed_to_approve_task") + err.message);
    }
  };

  const remainingTime = task.dueDate ? getRemainingTime(task.dueDate) : null;
  const isHiddenFull =
    activeTab === "partner" || remainingTime?.text === "Expired";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-full shadow-lg overflow-auto">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {isEditing ? (
          <>
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-2 mb-2 border rounded text-gray-700 text-xl font-bold"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-2 border rounded text-gray-700"
              rows={4}
            />
            <div className="mt-3 flex items-center">
              <input
                type="checkbox"
                checked={hasDueDate}
                onChange={(e) => {
                  setHasDueDate(e.target.checked);
                  if (!e.target.checked) {
                    setEditedDueDate("");
                  }
                }}
                className="mr-2"
              />
              <label className="text-gray-700">{t("set_due_date")}</label>
            </div>
            {hasDueDate && (
              <input
                type="date"
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
                className="w-full p-2 mb-2 border rounded text-gray-700"
                min={new Date().toISOString().split("T")[0]}
              />
            )}
          </>
        ) : (
          <>
            <h2
              className={`text-2xl font-bold text-calm-n-cool-5 mb-4 ${
                task.status !== "Pending Approval" ? "hidden" : ""
              }`}
            >
              Task Finished <i className="fa-solid fa-check-double"></i>
            </h2>
            <h3 className="bg-calm-n-cool-5 p-1 px-2  rounded-tl-lg rounded-r-3xl text-xl font-bold text-calm-n-cool-1 mb-4">
              {taskState.title}
            </h3>
            <div className="space-y-3 text-calm-n-cool-5">
              <p>
                <span className="font-semibold">{t("description")}</span>{" "}
                <span className="block bg-gray-200 p-2 max-h-[200px] overflow-auto rounded-md">
                  <ReactLinkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a
                        href={decoratedHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                        key={key}
                      >
                        {decoratedText}
                      </a>
                    )}
                  >
                    {taskState.description}
                  </ReactLinkify>
                </span>
              </p>
              <p>
                <span className="font-semibold">{t("priority")}</span>{" "}
                {taskState.priority === "High"
                  ? t("high")
                  : taskState.priority === "Medium"
                  ? t("medium")
                  : t("low")}
              </p>
              <p>
                <span className="font-semibold">{t("creator")}</span>{" "}
                {taskState.creator === "partner" ? t("partner") : t("self")}
              </p>
              <p>
                <span className="font-semibold">{t("created")}</span>{" "}
                {new Date(taskState.createdAt).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p>
                <span className="font-semibold">{t("due")}</span>{" "}
                {taskState.dueDate
                  ? new Date(taskState.dueDate).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : t("no_due_date")}
              </p>
              {taskState.declined && (
                <div>
                  <p className="font-semibold">
                    {t("status")}{" "}
                    <span className="text-red-600 font-semibold">
                      {t("declined")}
                    </span>
                  </p>
                  <p
                    className="bg-red-100 p-2 w-full text-wrap max-h-44 overflow-y-auto scrollbar-thin scrollable_content"
                    id="scrollable-content"
                  >
                    <span className="font-semibold">{t("reason")}</span>{" "}
                    {taskState.declineMessage}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
        <div className="mt-4 space-y-3">
          <div className="flex space-x-2">
            {!isEditing && taskState.status === "To Do" && (
              <button
                onClick={() => {
                  handleStatusChange("In Progress");
                  onClose();
                }}
                className={`flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 active:bg-yellow-700 transition-all duration-200 ${
                  activeTab === "partner" ||
                  task.declined ||
                  remainingTime?.text === "Expired"
                    ? "hidden"
                    : ""
                }`}
              >
                {t("start")}
              </button>
            )}
            {!isEditing && taskState.status === "In Progress" && (
              <button
                onClick={() => {
                  handleStatusChange("Done");
                  onClose();
                }}
                className={`flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 active:bg-green-700 transition-all duration-200 ${
                  activeTab === "partner" ||
                  task.declined ||
                  remainingTime?.text === "Expired"
                    ? "hidden"
                    : ""
                }`}
              >
                {t("finish")}
              </button>
            )}
            {!isEditing &&
              taskState.status === "Pending Approval" &&
              activeTab === "partner" && (
                <>
                  <button
                    onClick={() => handlePartnerApproval(true)}
                    className="relative flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 active:bg-green-700 transition-all duration-200"
                  >
                    <i className="fa-solid fa-thumbs-up  fa-xl absolute top-5 left-2"></i>{" "}
                    {t("approve")}
                  </button>
                  <button
                    onClick={() => handlePartnerApproval(false)}
                    className="relative flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:bg-red-700 disabled:bg-red-300 transition-all duration-200"
                  >
                    <i className="fa-solid fa-thumbs-down fa-xl absolute top-5 left-2"></i>{" "}
                    {t("reject")}
                  </button>
                </>
              )}
            {!isEditing && taskState.status === "Done" && (
              <button
                onClick={() => setShowRestartConfirm(true)}
                className={`flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 active:bg-gray-700 transition-all duration-200 ${
                  activeTab === "partner" ||
                  task.declined ||
                  task.creator === "partner"
                    ? "hidden"
                    : ""
                }`}
              >
                {t("restart")}
              </button>
            )}
          </div>
          {!isEditing &&
            activeTab !== "partner" &&
            task.creator === "partner" &&
            task.status !== "Done" &&
            !taskState.declined &&
            remainingTime?.text !== "Expired" && (
              <>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowDeclineConfirm(true)}
                    disabled={!declineMessage.trim()}
                    className={`flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:bg-red-700 disabled:bg-red-300 transition-all duration-200 ${
                      isHiddenFull ? "hidden" : ""
                    }`}
                  >
                    {t("decline")}
                  </button>
                </div>
                <textarea
                  value={declineMessage}
                  onChange={(e) => setDeclineMessage(e.target.value)}
                  placeholder={t("reason_for_declining")}
                  className={`w-full p-2 border rounded text-gray-700`}
                  rows={2}
                />
              </>
            )}
          <div
            className={`flex  ${
              (remainingTime?.text === "Expired" && activeTab !== "declined") ||
              task.status === "Done"
                ? "space-x-0"
                : "space-x-2"
            } `}
          >
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition-all duration-200"
                  disabled={!editedTitle.trim()}
                >
                  {t("save")}
                </button>
              </>
            ) : (activeTab === "home" && task.creator === "self") ||
              (activeTab === "partner" && task.creator === "partner") ? (
              <button
                onClick={() => setIsEditing(true)}
                className={`flex-1 bg-yellow-500 text-white mr-1 px-4 py-2 rounded hover:bg-yellow-600 active:bg-yellow-700 transition-all duration-200 ${
                  task.status === "Done" || task.status === "Pending Approval"
                    ? "hidden"
                    : ""
                }`}
              >
                {t("edit")}
              </button>
            ) : null}
            <button
              onClick={() => {
                setShowDeleteConfirm(true);
              }}
              className={`flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 active:bg-red-800 transition-all duration-200 ${
                (activeTab === "partner" && task.creator === "self") ||
                (activeTab === "partner" && task.status === "Done") ||
                isEditing ||
                task.status === "Pending Approval"
                  ? "hidden"
                  : ""
              }`}
            >
              {t("delete")}
            </button>
            {onReactivate && (
              <button
                onClick={() => onReactivate(task.id)}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {t("reactivate_task")}
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
          >
            {t("close")}
          </button>
        </div>
        {showDeclineConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <p className="text-gray-800 mb-4">
                {t("decline_confirm_message")}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={onDecline}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:bg-red-700 transition-all duration-200"
                >
                  {t("yes")}
                </button>
                <button
                  onClick={() => setShowDeclineConfirm(false)}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
                >
                  {t("no")}
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <p className="text-gray-800 mb-4">
                {t("delete_confirm_message")}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    handleDelete(task.id);
                    onClose();
                  }}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:bg-red-700 transition-all duration-200"
                >
                  {t("yes")}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
                >
                  {t("no")}
                </button>
              </div>
            </div>
          </div>
        )}
        {showRestartConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <p className="text-gray-800 mb-4">
                {t("restart_confirm_message")}
              </p>
              <div className="mt-3 flex items-center">
                <input
                  type="checkbox"
                  checked={hasRestartDueDate}
                  onChange={(e) => {
                    setHasRestartDueDate(e.target.checked);
                    if (!e.target.checked) {
                      setNewDueDate("");
                    }
                  }}
                  className="mr-2"
                />
                <label className="text-gray-700">{t("set_due_date")}</label>
              </div>
              {hasRestartDueDate && (
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full p-2 mb-4 border rounded text-gray-700"
                  min={new Date().toISOString().split("T")[0]}
                />
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    handleStatusChange(
                      "To Do",
                      hasRestartDueDate ? newDueDate : null
                    );
                    setShowRestartConfirm(false);
                    setNewDueDate("");
                  }}
                  disabled={hasRestartDueDate && !newDueDate}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 active:bg-green-700 transition-all duration-200 disabled:bg-gray-300"
                >
                  {t("confirm")}
                </button>
                <button
                  onClick={() => {
                    setShowRestartConfirm(false);
                    setNewDueDate("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
