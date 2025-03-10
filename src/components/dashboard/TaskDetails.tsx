import { useState } from "react";
import { Task } from "../../types";
import { db } from "../../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useTasks } from "../../hooks/useTasks";

const TaskDetails: React.FC<{
  task: Task;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
}> = ({ task, onClose, onUpdateTask }) => {
  const [declineMessage, setDeclineMessage] = useState(
    task.declineMessage || ""
  );
  const [taskState, setTaskState] = useState(task);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [error, setError] = useState<string | null>(null);
  const { handleDelete, handleDecline } = useTasks();

  console.log("TaskDetails received task with ID:", task.id);

  const onDecline = async () => {
    const success = await handleDecline(task.id, declineMessage);
    if (success) {
      const updatedTask = {
        ...taskState,
        declined: true,
        declineMessage,
      };
      setTaskState(updatedTask);
      onUpdateTask(updatedTask);
      setError(null);
    } else {
      setError("Failed to decline task"); // Error is already set in useTasks, but you can customize this
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedTask = {
        ...taskState,
        title: editedTitle,
        description: editedDescription,
      };
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        title: editedTitle,
        description: editedDescription,
      });
      setTaskState(updatedTask);
      onUpdateTask(updatedTask);
      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      setError("Failed to save edits: " + err.message);
    }
  };
  const handleStatusChange = async (newStatus: Task["status"]) => {
    try {
      const updatedTask = { ...taskState, status: newStatus };
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { status: newStatus });
      setTaskState(updatedTask);
      onUpdateTask(updatedTask);
      setError(null);
    } catch (err: any) {
      setError("Failed to update status: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {taskState.title}
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Description:</span>{" "}
                <span className="block whitespace-pre-wrap">
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
                  <p className="text-red-600 font-semibold">Status: Declined</p>
                  <p>
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
            {taskState.status === "To Do" && (
              <button
                onClick={() => handleStatusChange("In Progress")}
                className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 active:bg-yellow-700 transition-all duration-200"
              >
                Start
              </button>
            )}
            {taskState.status === "In Progress" && (
              <button
                onClick={() => handleStatusChange("Done")}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 active:bg-green-700 transition-all duration-200"
              >
                Finish
              </button>
            )}
            {taskState.status === "Done" && (
              <button
                onClick={() => handleStatusChange("To Do")}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 active:bg-gray-700 transition-all duration-200"
              >
                Restart
              </button>
            )}
          </div>
          {!isEditing && !taskState.declined && task.creator === "partner" && (
            <div className="flex space-x-2">
              <button
                onClick={onDecline}
                disabled={!declineMessage.trim()}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:bg-red-700 disabled:bg-red-300 transition-all duration-200"
              >
                Decline
              </button>
            </div>
          )}
          {!isEditing && task.creator === "partner" && !taskState.declined && (
            <textarea
              value={declineMessage}
              onChange={(e) => setDeclineMessage(e.target.value)}
              placeholder="Reason for declining..."
              className="w-full p-2 border rounded text-gray-700"
              rows={2}
            />
          )}
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition-all duration-200"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              taskState.creator === "self" && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 active:bg-yellow-700 transition-all duration-200"
                >
                  Edit
                </button>
              )
            )}
            <button
              onClick={() => handleDelete(task.id)}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 active:bg-red-800 transition-all duration-200"
            >
              Delete
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
