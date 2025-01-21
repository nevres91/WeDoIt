import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const Partner = () => {
  const { user } = useAuth();
  const [partnerEmail, setPartnerEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleFindPartner = async () => {
    if (!partnerEmail) return setMessage("Enter an email!");
    if (!user) return setMessage("You must be logged in!");
    if (partnerEmail === user?.email) {
      return setMessage("You cannot link to yourself.");
    }
    const userDoc = await getDoc(doc(db, "users", user!.uid));
    const userData = userDoc.data();

    if (userData?.partnerId) {
      setMessage("You are already linked to a partner. Please unlink first.");
      return;
    }

    try {
      // Query Firestore for a user with the provided email

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", partnerEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return setMessage("Partner not found in the database.");
      }

      // Get the first matched document
      const partnerRef = doc(db, "users", partnerEmail);
      const partnerDoc = querySnapshot.docs[0];
      const partnerId = partnerDoc.id; // This is the unique Firebase UID
      const partnerData = partnerDoc.data();

      if (!partnerData) {
        return setMessage("Partner data not found.");
      }
      //   Prevent linking two accounts with the same role.
      if (userData?.role === partnerData?.role) {
        return setMessage("You can only link with the opposite role.");
      }

      // Update both users' profiles to link them as partners
      //   const userRef = doc(db, "users", user.uid);
      //   await updateDoc(userRef, { partnerId });
      //   await updateDoc(doc(db, "users", partnerId), { partnerId: user.uid });
      await updateDoc(doc(db, "users", partnerId), {
        invitations: [...(partnerData.invitations || []), user!.uid],
      });
      //   await updateDoc(partnerRef, {
      //     invitations: [...(partnerData.invitations || []), user!.uid],
      //   });
      setMessage("Partner invitation was sent successfully.");
    } catch (error) {
      console.error("Error finding partner:", error);
      setMessage("Error linking partner.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Find Your Partner</h2>
      {message && <div className="text-red-500 text-center">{message}</div>}

      <input
        type="email"
        placeholder="Enter partner's email"
        value={partnerEmail}
        onChange={(e) => setPartnerEmail(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button
        onClick={handleFindPartner}
        className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 mt-2"
      >
        Link Partner
      </button>
    </div>
  );
};

export default Partner;
