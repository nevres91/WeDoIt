import { useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import { useTranslation } from "react-i18next";

export const DashboardFindPartner = () => {
  const { user } = useAuth();
  // Update message state to an object with text and type
  const [message, setMessage] = useState({ text: "", type: "" });
  const [partnerEmail, setPartnerEmail] = useState("");

  const { t } = useTranslation();

  const handleFindPartner = async () => {
    setMessage({ text: "", type: "" });

    if (!partnerEmail) {
      setMessage({ text: "Enter an email!", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }
    if (!user) {
      setMessage({ text: "You must be logged in!", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }
    if (partnerEmail === user?.email) {
      setMessage({ text: "You cannot link to yourself.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    const userDoc = await getDoc(doc(db, "users", user!.uid));
    const userData = userDoc.data();

    if (userData?.partnerId) {
      setMessage({
        text: "You are already linked to a partner.",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", partnerEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMessage({
          text: "Partner not found in the database.",
          type: "error",
        });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        return;
      }

      const partnerDoc = querySnapshot.docs[0];
      const partnerId = partnerDoc.id;
      const partnerData = partnerDoc.data();

      if (!partnerData) {
        setMessage({ text: "Partner data not found.", type: "error" });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        return;
      }
      if (userData?.role === partnerData?.role) {
        setMessage({
          text: "You can only link with the opposite role.",
          type: "error",
        });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        setPartnerEmail("");
        return;
      }
      if (partnerData.invitations?.includes(user?.uid)) {
        setMessage({
          text: "You have already sent an invitation to this user.",
          type: "error",
        });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        setPartnerEmail("");
        return;
      }

      // Update partner's invitations
      await updateDoc(doc(db, "users", partnerId), {
        invitations: [...(partnerData.invitations || []), user!.uid],
      });
      setMessage({
        text: "Partner invitation was sent successfully.",
        type: "success",
      });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
        setPartnerEmail("");
      }, 3000);
    } catch (error) {
      console.error("Error finding partner:", error);
      setMessage({ text: "Error linking partner.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <>
      <div //Container
        className="w-full h-[100%] absolute top-0 left-0 flex justify-center bg-findPartner bg-no-repeat bg-cover bg-center"
      >
        <div // Background overlay
          className="absolute top-0 left-0 w-full h-full bg-cupid bg-no-repeat bg-contain bg-center opacity-40"
        />
        <div // Form
          className={`w-[500px] min-h-[220px] min-w-[280px] self-start ml-2 mr-2 p-6 mt-[30vh] landscape:mt-[20vh] bg-calm-n-cool-2 backdrop-blur-[2px] bg-opacity-15 rounded-md flex flex-col  ${
            message.type === "success"
              ? "shadow-[0px_0px_10px_0px_rgba(2,184,2,0.75)]"
              : message.type === "error"
              ? "shadow-[0px_0px_10px_0px_rgba(250,0,0,0.75)]"
              : "shadow-[0px_0px_10px_0px_rgba(0,0,0,0.75)]"
          } `}
        >
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl text-calm-n-cool-5 font-bold my-4 text-center">
              <i className="fa-solid fa-heart-pulse fa-xl"></i>{" "}
              {t("find_your_partner")}
            </h2>
            {message.text && (
              <div
                className={`${
                  message.type === "success" ? "text-green-500" : "text-red-500"
                }`}
              >
                {message.text}
              </div>
            )}
            <input
              type="email"
              placeholder={t("enter_partners_email")}
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <button
              onClick={handleFindPartner}
              className="bg-calm-n-cool-5 text-calm-n-cool-1 p-2 rounded w-full hover:bg-calm-n-cool-4 mt-2 transition-all duration-100"
            >
              {t("link_partner")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
