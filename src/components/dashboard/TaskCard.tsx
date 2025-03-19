import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { Task } from "../../types";

const TaskCard: React.FC<{
  task: Task;
  onClick: () => void;
  onUpdateTask?: (task: Task) => void;
  hideActions?: boolean;
}> = ({ task, onClick, hideActions }) => {
  const priorityColor = {
    Low: "bg-gray-200 text-gray-800",
    Medium: "bg-yellow-200 text-yellow-800",
    High: "bg-red-200 text-red-800",
  };
  const { userData } = useAuth();
  const { activeTab } = useDashboard();

  return (
    <div //container
      className={`flex relative overflow-hidden justify-between w-full xs:w-[45%] lg:w-full  min-w-[200px] rounded-lg shadow-md hover:shadow-lg transition-all duration-100 h-[110px]  ${
        activeTab === "partner" && task.creator === "self"
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
      <div // DECLINE OVERLAY
        className={`w-full h-full bg-red-200 absolute top-0 left-0 bg-opacity-30 flex items-center justify-center cursor-pointer ${
          task.declined ? "" : "hidden"
        }`}
        onClick={onClick}
      >
        <p className="font-bold text-2xl text-red-600 z-10 opacity-70 absolute bottom-1 right-3">
          DECLINED
        </p>
      </div>
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
            className={`text-xs font-semibold px-2 py-1 rounded-full 
              ${
                activeTab === "partner" && task.creator === "self"
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
            {activeTab === "partner" && task.creator === "self"
              ? userData?.role === "wife"
                ? "From Husband"
                : "From Wife"
              : activeTab === "partner" && task.creator === "partner"
              ? userData?.role === "wife"
                ? "From Wife"
                : "From Husband"
              : task.creator === "self"
              ? "From You"
              : userData?.role === "wife"
              ? "From Husband"
              : "From Wife"}
          </span>
        </div>
      </div>
      <div className="w-[18%] max-w-[80px] h-full rounded-lg p-2 font-normal min-w-[75px]">
        <button
          className={`w-full text-xs px-2 py-1 rounded-full bg-green-200 text-green-700 my-1 hover:bg-green-400 hover:text-white transition-all duration-100 ${
            hideActions ? "hidden" : ""
          }`}
        >
          {task.status === "To Do"
            ? "Accept"
            : task.status === "In Progress"
            ? "Finish"
            : "Restart"}
        </button>
        <button
          className={`w-full text-xs px-2 py-1 rounded-full bg-red-200 text-red-700 my-1 hover:bg-red-400 hover:text-white transition-all duration-100 ${
            hideActions ? "hidden" : ""
          }`}
        >
          Reject
        </button>
        <button
          className={`w-full text-xs  px-2 py-1 rounded-full bg-red-400 text-white my-1 hover:bg-red-500 hover:text-white transition-all duration-100 ${
            hideActions ? "hidden" : ""
          }`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
