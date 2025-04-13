import React, { useState } from "react";
import TaskCard from "./TaskCard";
import TaskDetails from "./TaskDetails";
import { Task } from "../../types";
import { auth } from "../../services/firebase";
import { useTasks } from "../../hooks/useTasks";
import { TabsComponent } from "../TabsComponent";
import { createTask } from "../../utils/taskOperations";
import { useTranslation } from "react-i18next";

interface DashboardHomeProps {
  onUpdateTask: (task: Task) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onUpdateTask }) => {
  const userId = auth.currentUser?.uid;
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [activeTab, setActiveTab] = useState("todo");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    creator: "self" as "self" | "partner",
    dueDate: "",
    priority: "Medium" as "Low" | "Medium" | "High",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const {
    toDoTasks,
    inProgressTasks,
    doneTasks,
    selectedTask,
    setSelectedTask,
    handleAddTask,
  } = useTasks(userId);

  const { t } = useTranslation();

  // -----------------------------TABS COMPONENT-----------------------------
  const taskTabs = [
    {
      id: "todo",
      label: (
        <>
          <i className="fa-solid fa-list fa-lg"></i> {t("to_do")}
        </>
      ),
      color: "red-300",
    },
    {
      id: "inProgress",
      label: (
        <>
          <i className="fa-solid fa-list-check fa-lg"></i> {t("in_progress")}
        </>
      ),
      color: "yellow-200",
    },
    {
      id: "done",
      label: (
        <>
          <i className="fa-solid fa-check-double fa-lg"></i> {t("done")}
        </>
      ),
      color: "green-200",
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const activeTabColor =
    taskTabs.find((tab) => tab.id === activeTab)?.color || "red-300";

  const tabsContent = {
    todo: (
      <div className="py-2 overflow-y-auto space-y-3 px-1">
        {[...toDoTasks]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => setSelectedTask(task)}
              onUpdateTask={onUpdateTask}
            />
          ))}
      </div>
    ),
    inProgress: (
      <div className="py-2 overflow-y-auto space-y-3 px-1">
        {[...inProgressTasks]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => {
                setSelectedTask(task);
              }}
              onUpdateTask={onUpdateTask}
            />
          ))}
      </div>
    ),
    done: (
      <div className="py-2 overflow-y-auto space-y-3 px-1">
        {[...doneTasks]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => {
                setSelectedTask(task);
              }}
              onUpdateTask={onUpdateTask}
            />
          ))}
      </div>
    ),
  };

  // -----------------------------CREATE NEW TASK-----------------------------
  const handleCreateTask = async () => {
    const result = await createTask(newTask, handleAddTask);
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message || "",
    });
    if (result.success) {
      setNewTask({
        title: "",
        description: "",
        creator: "self" as "self" | "partner",
        dueDate: "",
        priority: "Medium" as "Low" | "Medium" | "High",
      });
      setTimeout(() => {
        setIsCreatingTask(false);
        setMessage(null); // Clear message when modal closes
      }, 1000);
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-t from-calm-n-cool-5 to-calm-n-cool-1 p-1 sm:p-2 md:p-6 lg:px-0  max-h-[calc(100%-0px)]">
      <div className="relative flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-3xl text-calm-n-cool-6 text-center flex-1">
          <i className="fa-solid fa-list-check"></i> {t("your_task_board")}
        </h1>

        <button //Create new task mobile button
          onClick={() => setIsCreatingTask(true)}
          className="lg:hidden absolute top-0 right-0  bg-calm-n-cool-5 text-white py-[4px] px-[11px] md:p-2 md:px-[14px] rounded-md hover:bg-calm-n-cool-5 active:bg-calm-n-cool-6 transition-all duration-200"
        >
          <i className="fa-solid fa-plus" />
        </button>
      </div>
      <div //Tabs Component
        className="relative h-[calc(100vh-100px)]"
      >
        <button //Create new task button
          onClick={() => setIsCreatingTask(true)}
          className={`hidden lg:block  absolute top-0 right-[40px] rounded-t-xl text-calm-n-cool-5 bg-${activeTabColor} bg-opacity-50 px-4 py-2 hover:-translate-y-2 hover:shadow-xl hover:rounded-b-xl hover:bg-opacity-90 transition-all duration-200`}
        >
          <i className="fa-solid fa-plus mr-2"></i> {t("create_new_task")}
        </button>
        <TabsComponent
          tabs={taskTabs}
          tabContent={tabsContent}
          defaultTab="todo"
          onTabChange={handleTabChange}
        />
      </div>
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={onUpdateTask}
        />
      )}
      {isCreatingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {t("create_new_task")}
            </h3>
            {message?.type === "error" && (
              <div className="text-red-500 mb-4">{message.text}</div>
            )}
            {message?.type === "success" && (
              <div className="text-green-500 mb-4">{message.text}</div>
            )}
            <div className="">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder={t("task_title")}
                className="w-full p-2 border rounded text-gray-700"
              />
              <textarea
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder={t("task_description")}
                className="w-full p-2 border rounded text-gray-700 mt-3"
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
                className="w-full p-2 border rounded text-gray-700 mt-1"
              >
                <option value="self">{t("for_myself")}</option>
                <option value="partner">{t("for_partner")}</option>
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="w-full p-2 border rounded text-gray-700 mt-3"
                min={new Date().toISOString().split("T")[0]}
              />
              <p className="mt-3 p-1 text-gray-500">{t("priority")}</p>
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
                <option value="Low">{t("low")}</option>
                <option value="Medium">{t("medium")}</option>
                <option value="High">{t("high")}</option>
              </select>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleCreateTask}
                className="flex-1 bg-calm-n-cool-4 text-white px-4 py-2 rounded hover:bg-calm-n-cool-5 active:bg-calm-n-cool-6 transition-all duration-200"
                disabled={!newTask.title.trim() || !newTask.dueDate}
              >
                {t("create")}
              </button>
              <button
                onClick={() => setIsCreatingTask(false)}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
