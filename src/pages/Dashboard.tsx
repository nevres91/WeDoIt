import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

const Dashboard = () => {
  const { userData, logout } = useAuth();
  const [partnerData, setPartnerData] = useState<any>(null);

  useEffect(() => {
    const fetchPartner = async () => {
      if (userData?.partnerId) {
        const partnerDoc = await getDoc(doc(db, "users", userData.partnerId));
        setPartnerData(partnerDoc.exists() ? partnerDoc.data() : null);
      }
    };

    fetchPartner();
  }, [userData]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Dashboard</h2>

      <p>
        <strong>Name:</strong> {userData?.firstName} {userData?.lastName}
      </p>
      <p>
        <strong>Email:</strong> {userData?.email}
      </p>
      <p>
        <strong>Role:</strong> {userData?.role}
      </p>

      {partnerData ? (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-bold">Partner Details:</h3>
          <p>
            <strong>Name:</strong> {partnerData.firstName}{" "}
            {partnerData.lastName}
          </p>
          <p>
            <strong>Email:</strong> {partnerData.email}
          </p>
          <p>
            <strong>Role:</strong> {partnerData.role}
          </p>
        </div>
      ) : (
        <p className="text-red-500">No partner linked yet.</p>
      )}

      <button
        onClick={logout}
        className="bg-red-500 text-white p-2 rounded w-full hover:bg-red-600 mt-4"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
