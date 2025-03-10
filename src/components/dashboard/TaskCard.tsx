import { useAuth } from "../../context/AuthContext";
import { Task } from "../../types";

const TaskCard: React.FC<{
  task: Task;
  onClick: () => void;
  onUpdateTask: (task: Task) => void;
}> = ({ task, onClick }) => {
  const priorityColor = {
    Low: "bg-gray-200 text-gray-800",
    Medium: "bg-yellow-200 text-yellow-800",
    High: "bg-red-200 text-red-800",
  };
  const { userData } = useAuth();

  return (
    <div //container
      className={`flex relative overflow-hidden w-full min-w-[200px] rounded-lg shadow-md hover:shadow-lg transition-all duration-100 h-[110px]  ${
        task.creator === "partner" && userData?.role === "husband"
          ? "bg-pink-50 border-l-4 border-pink-400 hover:bg-pink-100"
          : task.creator === "partner" && userData?.role === "wife"
          ? "bg-blue-50 border-l-4 border-blue-400 hover:bg-blue-100"
          : task.creator === "self" && userData?.role === "husband"
          ? "bg-blue-50 border-l-4 border-blue-400 hover:bg-blue-100"
          : "bg-pink-50 border-l-4 border-pink-400 hover:bg-pink-100"
      }`}
    >
      <div //content
        onClick={onClick}
        className="flex flex-col cursor-pointer rounded-lg p-2 h-full w-[82%]"
      >
        <p //title
          className="text-calm-n-cool-6 text-sm font-semibold mr-2"
        >
          {task.title}
        </p>
        <div //Description
          className="w-full h-[55%] overflow-hidden text-xs"
        >
          <p
            className="line-clamp-3" // Limits to 3 lines and adds ellipsis
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {task.description}
          </p>
        </div>
        <div //Status container
          className="flex items-center space-x-2 absolute bottom-1 left-1"
        >
          <span //Priority
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              priorityColor[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              task.creator === "partner" && userData?.role === "husband"
                ? "bg-pink-200 text-pink-800"
                : task.creator === "partner" && userData?.role === "wife"
                ? "bg-blue-200 text-blue-800"
                : task.creator === "self" && userData?.role === "husband"
                ? "bg-blue-200 text-blue-800"
                : "bg-pink-200 text-pink-800"
            }`}
          >
            {userData?.role === "husband" && task.creator === "partner"
              ? "From Wife"
              : userData?.role === "wife" && task.creator === "partner"
              ? "From Husband"
              : "From You"}
          </span>
        </div>
      </div>
      <div className="w-[18%] h-full rounded-lg p-2 content-center font-normal min-w-[75px]">
        <button
          className={`w-full text-xs px-2 py-1 rounded-full bg-green-200 text-green-700 my-1 hover:bg-green-400 hover:text-white transition-all duration-100`}
        >
          {task.status === "To Do"
            ? "Accept"
            : task.status === "In Progress"
            ? "Finish"
            : "Restart"}
        </button>
        <button
          className={`w-full text-xs px-2 py-1 rounded-full bg-red-200 text-red-700 my-1 hover:bg-red-400 hover:text-white transition-all duration-100`}
        >
          Reject
        </button>
        <button
          className={`w-full text-xs  px-2 py-1 rounded-full bg-red-400 text-white my-1 hover:bg-red-500 hover:text-white transition-all duration-100`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
