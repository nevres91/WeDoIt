import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { usePartnerData } from "../../hooks/usePartnerData";
import { useTasks } from "../../hooks/useTasks";
import { useTranslation } from "react-i18next";

const PartnerProfile: React.FC = () => {
  const { partnerData, loading: partnerLoading } = usePartnerData();
  const {
    toDoTasks,
    inProgressTasks,
    doneTasks,
    pendingApprovalTasks,
    loading: tasksLoading,
  } = useTasks(partnerData?.id);
  const [error, setError] = useState<string | null>(null);

  // Combine and sort tasks for recent tasks display
  const allTasks = [
    ...toDoTasks,
    ...inProgressTasks,
    ...doneTasks,
    ...pendingApprovalTasks,
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const { t } = useTranslation();
  useEffect(() => {
    console.log(partnerData);
  }, [partnerData]);

  const completedTasks = doneTasks.length;
  const activeTasks = toDoTasks.length + inProgressTasks.length;
  const pendingTasks = pendingApprovalTasks.length;

  // Handle loading state
  if (partnerLoading || tasksLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Handle error or no partner
  if (!partnerData) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-500 text-center">Partner not found</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const photoURL =
    currentUser && currentUser.uid === partnerData.id
      ? currentUser.photoURL ||
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
      : partnerData.photoURL ||
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

  return (
    <div className="w-full h-full flex flex-col items-center p-1">
      <div className="absolute top-0 left-0 bg-gradient-to-t from-calm-n-cool-5 to-calm-n-cool-1 w-full h-full z-0"></div>
      <div className="relative flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-3xl text-calm-n-cool-6 text-center flex-1 z-10 mt-0 sm:mt-5">
          {t("partners_profile")}
        </h1>
      </div>
      <div className="max-w-[1000px] w-full shadow-md mx-auto p-3 sm:p-6 backdrop-blur-2 bg-opacity-75  bg-gray-100 rounded-md  h-[90%] overflow-auto scrollbar-transparent z-10">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center gap-6">
          <img
            src={photoURL}
            alt={`${partnerData.firstName} ${partnerData.lastName}`}
            className="min-w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {partnerData.firstName} {partnerData.lastName}
            </h2>
            <p className="text-gray-600 capitalize">
              {t("role")}:{" "}
              {partnerData.role === "husband" ? t("husband") : t("wife")}
            </p>
            <p className="text-gray-500">
              {t("joined")}:{" "}
              {new Date(partnerData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              {t("active_tasks")}
            </h3>
            <p className="text-2xl font-bold text-blue-600">{activeTasks}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              {t("pending_approval")}
            </h3>
            <p className="text-2xl font-bold text-blue-600">{pendingTasks}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              {t("completed_tasks")}
            </h3>
            <p className="text-2xl font-bold text-blue-600">{completedTasks}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {t("informations")}
          </h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">{t("email")}:</span>{" "}
              {partnerData.email}
            </p>
            {partnerData.birthday ? (
              <p className="text-gray-600">
                <span className="font-medium">{t("birthday")}:</span>{" "}
                {partnerData.birthday}
              </p>
            ) : (
              ""
            )}
            {partnerData.height ? (
              <p className="text-gray-600">
                <span className="font-medium">{t("height")}</span>{" "}
                {partnerData.height} cm
              </p>
            ) : (
              ""
            )}
            {partnerData.weight ? (
              <p className="text-gray-600">
                <span className="font-medium">{t("weight")}</span>{" "}
                {partnerData.weight} kg
              </p>
            ) : (
              ""
            )}
            {partnerData.job ? (
              <p className="text-gray-600">
                <span className="font-medium">{t("job")}</span>{" "}
                {partnerData.job}
              </p>
            ) : (
              ""
            )}
            {partnerData.location ? (
              <p className="text-gray-600">
                <span className="font-medium">{t("location")}:</span>{" "}
                {partnerData.location}
              </p>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        {allTasks.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {t("recent_tasks")}
            </h3>
            <ul className="space-y-4">
              {allTasks.slice(0, 5).map((task) => (
                <li key={task.id} className="border-b pb-2 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-800 font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        Status:{" "}
                        <span
                          className={`ml-1 ${
                            task.status === "Done"
                              ? "text-green-500"
                              : task.status === "Pending Approval"
                              ? "text-yellow-500"
                              : "text-blue-500"
                          }`}
                        >
                          {task.status === "Done"
                            ? t("done")
                            : task.status === "In Progress"
                            ? t("in_progress")
                            : task.status === "To Do"
                            ? t("to_do")
                            : t("pending_approval")}
                        </span>
                      </p>
                      {task.dueDate && (
                        <p className="text-sm text-gray-500">
                          {t("due")}{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerProfile;
