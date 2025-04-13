import { SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { useTranslation } from "react-i18next";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";

export const SidebarMenu = ({
  setSidebar,
}: {
  setSidebar: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { setActiveTab } = useDashboard();
  const { userData, user } = useAuth();
  const { t } = useTranslation();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const buttonClassses =
    "mb-1 bg-calm-n-cool-1 w-full rounded-md p-1 text-calm-n-cool-6 hover:text-calm-n-cool-1 hover:bg-calm-n-cool-4 hover:cursor-pointer transition-all duration-100 ";
  // Fetch unread notification count
  useEffect(() => {
    if (!user?.uid || !userData?.partnerId) return;

    const q = query(
      collection(db, "notifications"),
      where("recipient", "==", userData.partnerId),
      where("read", "==", false)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size); // Number of unread notifications
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [user?.uid, userData?.partnerId]);
  return (
    <>
      <div className="  w-[calc(100%-12px)] min-w-[220px] z-[10] bg-calm-n-cool-6">
        <ul className="">
          <li>
            <button
              onClick={() => {
                setActiveTab("home");
                setSidebar(false);
              }}
              className={`${buttonClassses}`}
            >
              {t("your_tasks")}
            </button>
            <button
              onClick={() => {
                setActiveTab("partner");
                setSidebar(false);
              }}
              className={`${buttonClassses}, ${
                !userData?.partnerId ? "hidden" : ""
              }`}
            >
              {t("partners_tasks")}
            </button>
            <button
              onClick={() => {
                setActiveTab("find-partner");
                setSidebar(false);
              }}
              className={`${buttonClassses}, ${
                userData?.partnerId ? "hidden" : ""
              }`}
            >
              {t("link_a_partner")}
            </button>
            <button
              onClick={() => {
                setActiveTab("declined");
                setSidebar(false);
              }}
              className={`${buttonClassses}, ${
                !userData?.partnerId ? "hidden" : ""
              } `}
            >
              {t("declined_tasks")}
            </button>
            <button
              onClick={() => {
                setActiveTab("todo");
                setSidebar(false);
              }}
              className={buttonClassses}
            >
              {t("to_do")}
            </button>
            <button
              onClick={() => {
                setActiveTab("calendar");
                setSidebar(false);
              }}
              className={buttonClassses}
            >
              {t("calendar")}
            </button>
            <button
              onClick={() => {
                setActiveTab("notifications");
                setSidebar(false);
              }}
              className={buttonClassses}
            >
              {unreadCount > 0 && (
                <span className="absolute left-3 bg-red-500 text-calm-n-cool-1 text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
              {t("notifications")}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};
