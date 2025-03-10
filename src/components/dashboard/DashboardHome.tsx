import React, { useState } from "react";
import TaskCard from "./TaskCard";
import TaskDetails from "./TaskDetails";
import { Task } from "../../types";
import { auth, db } from "../../services/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useTasks } from "../../hooks/useTasks";

interface DashboardHomeProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({
  tasks,
  onUpdateTask,
}) => {
  const { selectedTask, setSelectedTask, handleAddTask } = useTasks();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    creator: "self" as "self" | "partner",
    dueDate: "",
    priority: "Medium" as "Low" | "Medium" | "High",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toDoTasks = tasks.filter((task) => task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const doneTasks = tasks.filter((task) => task.status === "Done");

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !newTask.dueDate) return;

    setError(null);
    setSuccessMessage(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not authenticated");

      const taskBase: Omit<Task, "id" | "userId"> = {
        title: newTask.title,
        description: newTask.description,
        status: "To Do",
        creator: newTask.creator,
        createdAt: new Date().toISOString(),
        dueDate: newTask.dueDate,
        priority: newTask.priority,
      };

      const tasksCollection = collection(db, "tasks");

      if (newTask.creator === "self") {
        const task = { ...taskBase, userId: currentUser.uid };
        const docRef = await addDoc(tasksCollection, task);
        handleAddTask({ ...task, id: docRef.id });
        setSuccessMessage("Task created successfully!");
      } else if (newTask.creator === "partner") {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) throw new Error("User document not found");

        const partnerId = userDoc.data()?.partnerId;
        if (!partnerId) {
          setError("No partner linked. Please link a partner first.");
          return;
        }

        const task = { ...taskBase, userId: partnerId };
        const docRef = await addDoc(tasksCollection, task);
        console.log(`Task created for partner with ID: ${docRef.id}`);
        setSuccessMessage("Task created for your partner!");
      }

      setNewTask({
        title: "",
        description: "",
        creator: "self",
        dueDate: "",
        priority: "Medium",
      });
      setTimeout(() => setIsCreatingTask(false), 1000);
    } catch (err: any) {
      console.error("Error creating task:", err.message);
      setError(err.message || "Failed to create task.");
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-t from-calm-n-cool-5 to-calm-n-cool-1 p-2 xl:p-6 max-h-[calc(100%-0px)]">
      <div className="relative flex justify-between items-center mb-6">
        <h1 className="text-3xl  text-calm-n-cool-6 text-center flex-1">
          Your Task Board
        </h1>
        <button
          onClick={() => setIsCreatingTask(true)}
          className="absolute top-0 right-0 bg-calm-n-cool-4 text-white px-4 py-2 rounded hover:bg-calm-n-cool-5 active:bg-calm-n-cool-6 transition-all duration-200"
        >
          <i className="fa-solid fa-plus mr-2"></i> Create New Task
        </button>
      </div>
      <div className="relative flex flex-col md:flex-row space-x-1 xl:space-x-2 space-y-6 md:space-y-0 max-h-[calc(100%-43px)]">
        <div className="w-full md:w-1/3 bg-yellow-100 p-5 bg-opacity-40  rounded-t-none rounded-b-none rounded-l-lg  overflow-auto max-h-[100%] scrollbar-transparent">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">To Do</h2>
          <div className="py-2 overflow-y-auto space-y-3 pr-2">
            {toDoTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => setSelectedTask(task)}
                onUpdateTask={onUpdateTask}
              />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/3 bg-cyan-100 p-5 bg-opacity-40 rounded-lg rounded-t-none rounded-b-none   overflow-auto max-h-[100%] scrollbar-transparent">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            In Progress
          </h2>
          <div className="py-2 overflow-y-auto space-y-3 pr-2">
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => {
                  console.log("Selected task ID:", task.id);
                  setSelectedTask(task);
                }}
                onUpdateTask={onUpdateTask}
              />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/3 bg-green-100 p-5 bg-opacity-40 rounded-t-none rounded-b-none rounded-r-lg  overflow-auto max-h-[100%] scrollbar-transparent">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Done</h2>
          <div className="py-2 overflow-y-auto space-y-3 pr-2">
            {doneTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => {
                  console.log("Selected task ID:", task.id);
                  setSelectedTask(task);
                }}
                onUpdateTask={onUpdateTask}
              />
            ))}
          </div>
        </div>
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
              <select
                value={newTask.creator}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    creator: e.target.value as "self" | "partner",
                  })
                }
                className="w-full p-2 border rounded text-gray-700"
              >
                <option value="self">For Myself</option>
                <option value="partner">For Partner</option>
              </select>
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

export default DashboardHome;
