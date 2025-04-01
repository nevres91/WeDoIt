import { useState } from "react";
import { Task } from "../../types";
import { db } from "../../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useTasks } from "../../hooks/useTasks";
import { useDashboard } from "../../context/DashboardContext";
import { getRemainingTime } from "../../utils/helperFunctions";

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
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate);
  const [error, setError] = useState<string | null>(null);
  const { handleDelete, handleDecline } = useTasks();
  const { activeTab } = useDashboard();
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [newDueDate, setNewDueDate] = useState("");

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
      setShowDeclineConfirm(false); // Close modal on success
      onClose(); // Optionally close the task details after declining
    } else {
      setError("Failed to decline task");
      setShowDeclineConfirm(false); // Close modal on failure
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedTask = {
        ...taskState,
        title: editedTitle,
        description: editedDescription,
        dueDate: editedDueDate,
        edited: true,
      };
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        title: editedTitle,
        description: editedDescription,
        dueDate: editedDueDate,
        edited: true,
      });
      setTaskState(updatedTask);
      if (onUpdateTask) {
        onUpdateTask(updatedTask);
      }
      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      setError("Failed to save edits: " + err.message);
    }
  };
  const handleStatusChange = async (
    newStatus: Task["status"],
    dueDate?: string
  ) => {
    try {
      const updatedTask = {
        ...taskState,
        status: newStatus,
        ...(dueDate && { dueDate }),
      };
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        status: newStatus,
        ...(dueDate && { dueDate }),
      });
      setTaskState(updatedTask);
      if (onUpdateTask) onUpdateTask(updatedTask);
      setError(null);
      if (newStatus === "To Do" && dueDate) setShowRestartConfirm(false);
      onClose();
    } catch (err: any) {
      setError("Failed to update status: " + err.message);
    }
  };

  const remainingTime = task.dueDate ? getRemainingTime(task.dueDate) : null;
  const isHiddenFull =
    activeTab === "partner" || remainingTime?.text === "Expired";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
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
            <input
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="w-full p-2 mb-2 border rounded text-gray-700"
              min={new Date().toISOString().split("T")[0]}
            />
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {taskState.title}
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Description:</span>{" "}
                <span className="block bg-gray-200 p-2">
                  {taskState.description}
                </span>
              </p>
              <p>
                <span className="font-semibold">Priority:</span>{" "}
                {taskState.priority}
              </p>
              <p>
                <span className="font-semibold">Creator:</span>{" "}
                {taskState.creator === "partner" ? "Partner" : "Self"}
              </p>
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(taskState.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Due:</span>{" "}
                {new Date(taskState.dueDate).toLocaleDateString()}
              </p>
              {taskState.declined && (
                <div>
                  <p className="font-semibold">
                    Status:{" "}
                    <span className="text-red-600 font-semibold">Declined</span>
                  </p>
                  <p
                    className="bg-red-100 p-2 w-full text-wrap max-h-44 overflow-y-auto scrollbar-thin scrollable_content"
                    id="scrollable-content"
                  >
                    <span className="font-semibold">Reason:</span>{" "}
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
                className={`flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 active:bg-yellow-700 transition-all duration-200 ${
                  activeTab === "partner" ||
                  task.declined ||
                  remainingTime?.text === "Expired"
                    ? "hidden"
                    : ""
                }`}
              >
                Start
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
                Finish
              </button>
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
                Restart
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
                    Decline
                  </button>
                </div>
                <textarea
                  value={declineMessage}
                  onChange={(e) => setDeclineMessage(e.target.value)}
                  placeholder="Reason for declining..."
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
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition-all duration-200"
                >
                  Save
                </button>
              </>
            ) : (activeTab === "home" && task.creator === "self") ||
              (activeTab === "partner" && task.creator === "partner") ? (
              <button
                onClick={() => setIsEditing(true)}
                className={`flex-1 bg-yellow-500 text-white mr-1 px-4 py-2 rounded hover:bg-yellow-600 active:bg-yellow-700 transition-all duration-200 ${
                  task.status === "Done" ? "hidden" : ""
                }`}
              >
                Edit
              </button>
            ) : null}
            <button
              onClick={() => {
                setShowDeleteConfirm(true);
              }}
              className={`flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 active:bg-red-800 transition-all duration-200 ${
                (activeTab === "partner" && task.creator === "self") ||
                isEditing
                  ? "hidden"
                  : ""
              }`}
            >
              Delete
            </button>
            {onReactivate && (
              <button
                onClick={() => onReactivate(task.id)}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Reactivate Task
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
          >
            Close
          </button>
        </div>
        {showDeclineConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <p className="text-gray-800 mb-4">
                The task will be moved to your partner's Declined Tasks section,
                and you won't be able to see it anymore. Do you want to proceed?
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={onDecline}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:bg-red-700 transition-all duration-200"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeclineConfirm(false)}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <p className="text-gray-800 mb-4">
                Are you sure that you want to delete selected task?
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    handleDelete(task.id);
                    onClose();
                  }}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:bg-red-700 transition-all duration-200"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        {showRestartConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <p className="text-gray-800 mb-4">
                Please enter a new due date to restart the task:
              </p>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-gray-700"
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (newDueDate) {
                      handleStatusChange("To Do", newDueDate); // Pass new dueDate
                    } else {
                      setError("Please select a due date");
                    }
                  }}
                  disabled={!newDueDate}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 active:bg-green-700 transition-all duration-200 disabled:bg-gray-300"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setShowRestartConfirm(false);
                    setNewDueDate(""); // Reset due date on cancel
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
                >
                  Cancel
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
