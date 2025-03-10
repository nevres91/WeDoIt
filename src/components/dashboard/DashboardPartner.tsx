import React, { useState } from "react";
import TaskCard from "./TaskCard";
import TaskDetails from "./TaskDetails";
import { Task } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../hooks/useTasks";
import { createPartnerTask, NewTask } from "../../utils/taskOperations";

interface DashboardPartnerProps {
  onUpdateTask: (task: Task) => void;
}

const DashboardPartner: React.FC<DashboardPartnerProps> = ({
  onUpdateTask,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const { handleAddTask } = useTasks();
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    creator: "partner",
    dueDate: "",
    priority: "Medium",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { userData } = useAuth();
  const { toDoTasks, inProgressTasks, doneTasks, loading } = useTasks(
    userData?.partnerId
  );

  const handleCreateTask = async () => {
    const result = await createPartnerTask(newTask, handleAddTask);
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message || "",
    });

    if (result.success) {
      setNewTask({
        title: "",
        description: "",
        creator: "partner",
        dueDate: "",
        priority: "Medium",
      });
      setTimeout(() => setIsCreatingTask(false), 1000);
      console.log("new partner task created");
    }
  };

  const renderTaskColumn = (title: string, tasks: Task[], bgColor: string) => (
    <div
      className={`w-full md:w-1/3 ${bgColor} p-5 bg-opacity-40 rounded-lg overflow-auto max-h-[100%] scrollbar-transparent`}
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="py-2 overflow-y-auto space-y-3 pr-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => setSelectedTask(task)}
            onUpdateTask={onUpdateTask}
          />
        ))}
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-full w-full bg-gradient-to-t from-calm-n-cool-5 to-calm-n-cool-1 p-2 xl:p-6">
      <div className="relative flex justify-between items-center mb-6">
        <h1 className="text-3xl text-calm-n-cool-6 text-center flex-1">
          Partner's Task Board
        </h1>
        <button
          onClick={() => setIsCreatingTask(true)}
          className="absolute top-0 right-0 bg-calm-n-cool-4 text-white px-4 py-2 rounded hover:bg-calm-n-cool-5"
        >
          <i className="fa-solid fa-plus mr-2"></i> Create New Task
        </button>
      </div>

      <div className="relative flex flex-col md:flex-row space-x-1 xl:space-x-2 space-y-6 md:space-y-0 max-h-[calc(100%-43px)]">
        {renderTaskColumn("To Do", toDoTasks, "bg-yellow-100")}
        {renderTaskColumn("In Progress", inProgressTasks, "bg-cyan-100")}
        {renderTaskColumn("Done", doneTasks, "bg-green-100")}
      </div>

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={onUpdateTask}
        />
      )}

      {isCreatingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Create New Task
            </h3>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {successMessage && (
              <div className="text-green-500 mb-4">{successMessage}</div>
            )}
            <div className="space-y-4">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder="Task Title"
                className="w-full p-2 border rounded text-gray-700"
              />
              <textarea
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder="Task Description"
                className="w-full p-2 border rounded text-gray-700"
                rows={3}
              />
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="w-full p-2 border rounded text-gray-700"
                min={new Date().toISOString().split("T")[0]}
              />
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    priority: e.target.value as "Low" | "Medium" | "High",
                  })
                }
                className="w-full p-2 border rounded text-gray-700"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleCreateTask}
                className="flex-1 bg-calm-n-cool-4 text-white px-4 py-2 rounded hover:bg-calm-n-cool-5 active:bg-calm-n-cool-6 transition-all duration-200"
                disabled={!newTask.title.trim() || !newTask.dueDate}
              >
                Create
              </button>
              <button
                onClick={() => setIsCreatingTask(false)}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPartner;
