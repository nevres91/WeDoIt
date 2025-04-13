import { useTranslation } from "react-i18next";
// ---------------------Calculate task's remaining time---------------------
export const getRemainingTime = (dueDate: string | Date) => {
  const { t } = useTranslation();
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) {
    return { text: "Expired", color: "hidden" };
  }
  if (minutes < 60) {
    return {
      text: `${minutes} min`,
      color:
        minutes <= 15
          ? "bg-red-200 text-red-800"
          : "bg-orange-200 text-orange-800",
    };
  }
  if (hours < 24) {
    return {
      text: `${hours + " " + t("hrs")}`,
      color:
        hours <= 3
          ? "bg-orange-200 text-orange-800"
          : "bg-yellow-200 text-yellow-800",
    };
  }
  return {
    text: `${days + " " + t("days")}`,
    color:
      days <= 1
        ? "bg-yellow-200 text-yellow-800"
        : "bg-green-200 text-green-800",
  };
};
