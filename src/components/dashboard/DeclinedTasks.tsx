import React, { useState } from "react";
import TaskCard from "./TaskCard";
import TaskDetails from "./TaskDetails";
import { Task } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../hooks/useTasks";
import { TabsComponent } from "../TabsComponent";

const DeclinedTasks: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { userData } = useAuth();
  const { declinedTasks, loading, reactivateTask } = useTasks(
    userData?.partnerId
  );

  // Handle task reactivation
  const handleReactivateTask = async (taskId: string) => {
    try {
      if (reactivateTask) {
        await reactivateTask(taskId);
        setSelectedTask(null); // Close the details view after reactivation
      }
    } catch (error) {
      console.error("Failed to reactivate task:", error);
      // You might want to add error handling UI here
    }
  };

  // -----------------------------TABS COMPONENT-----------------------------
  const taskTabs = [
    { id: "declined", label: "Declined Tasks", color: "blue-300" },
  ];
  const tabsContent = {
    declined: (
      <div className="py-2 overflow-y-auto space-y-3 px-1">
        {declinedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => setSelectedTask(task)}
            hideActions
          />
        ))}
      </div>
    ),
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-full w-full bg-gradient-to-t from-calm-n-cool-5 to-calm-n-cool-1 p-1 sm:p-2 md:p-6 lg:px-0  max-h-[calc(100%-0px)]">
      <div className="relative flex justify-between items-center mb-6">
        <div className="w-[30px]"></div>
        <h1 className="text-xl lg:text-3xl text-calm-n-cool-6 text-center flex-1">
          Tasks that your partner declined
        </h1>
      </div>

      <div //Tabs Component
        className="relative h-[calc(100vh-100px)]"
      >
        <TabsComponent
          tabs={taskTabs}
          tabContent={tabsContent}
          defaultTab="declined"
        />
      </div>

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onReactivate={handleReactivateTask}
        />
      )}
    </div>
  );
};

export default DeclinedTasks;
