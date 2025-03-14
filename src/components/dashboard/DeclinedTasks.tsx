import React, { useState } from "react";
import TaskCard from "./TaskCard";
import TaskDetails from "./TaskDetails";
import { Task } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../hooks/useTasks";

const DeclinedTasks: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { userData } = useAuth();
  const { declinedTasks, loading } = useTasks(userData?.partnerId);

  const renderTaskColumn = (title: string, tasks: Task[], bgColor: string) => (
    <div
      className={`w-full  ${bgColor} p-1 lg:p-5 bg-opacity-40 rounded-lg overflow-auto max-h-[100%]  scrollbar-transparent`}
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="py-2 overflow-y-auto flex flex-wrap flex-2 gap-2 justify-center lg:justify-start ">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => setSelectedTask(task)}
            hideActions
          />
        ))}
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-full w-full bg-gradient-to-t from-calm-n-cool-5 to-calm-n-cool-1 p-1 lg:p-6">
      <div className="relative flex justify-between items-center mb-6">
        <div className="w-[30px]"></div>
        <h1 className="text-xl lg:text-3xl text-calm-n-cool-6 text-center flex-1">
          Tasks that your partner declined
        </h1>
      </div>

      <div className="relative flex flex-col md:flex-row space-x-1 xl:space-x-2 space-y-6 md:space-y-0 max-h-[calc(100%-80px)]  lg:max-h-[calc(100%-43px)]">
        {renderTaskColumn("Declined", declinedTasks, "bg-green-100")}
      </div>

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default DeclinedTasks;
