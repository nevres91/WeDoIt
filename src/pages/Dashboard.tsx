import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { acceptInvitation, rejectInvitation } from "../utils/PartnerService";

const Dashboard = () => {
  const { user, userData, logout } = useAuth();
  const [partnerData, setPartnerData] = useState<any>(null);
  const [invitations, setInvitations] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);

  useEffect(() => {
    if (userData?.invitations?.length) {
      const fetchInviters = async () => {
        const inviterDetails = await Promise.all(
          userData.invitations.map(async (inviterId: string) => {
            const inviterDoc = await getDoc(doc(db, "users", inviterId));
            if (inviterDoc.exists()) {
              return { id: inviterId, ...inviterDoc.data() };
            }
            return null;
          })
        );

        // Filter out null results
        setInvitations(inviterDetails.filter(Boolean) as any);
      };

      fetchInviters();
    }
  }, [userData]);

  useEffect(() => {
    const fetchPartner = async () => {
      if (userData?.partnerId) {
        const partnerDoc = await getDoc(doc(db, "users", userData.partnerId));
        setPartnerData(partnerDoc.exists() ? partnerDoc.data() : null);
      }
    };

    fetchPartner();
  }, [userData]);

  const handleAccept = async (inviterId: string) => {
    if (!user?.uid) return;

    await acceptInvitation(user.uid, inviterId);

    // Remove the accepted invitation from local state
    setInvitations((prevInvitations) =>
      prevInvitations.filter((inviter) => inviter.id !== inviterId)
    );
  };

  const handleReject = async (inviterId: string) => {
    if (!user?.uid) return;

    await rejectInvitation(user.uid, inviterId);

    // Remove the rejected invitation from local state
    setInvitations((prevInvitations) =>
      prevInvitations.filter((inviter) => inviter.id !== inviterId)
    );
  };

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

      <div>
        <h2>Pending Invitations:</h2>
        {invitations.length > 0 ? (
          invitations.map((inviter) => (
            <div key={inviter.id} className="p-2 border">
              <p>
                Invitation from: {inviter.firstName} {inviter.lastName}
              </p>
              <button
                className="border bg-green-400 p-2 mr-2"
                onClick={() => handleAccept(inviter.id)}
              >
                Accept
              </button>
              <button
                className="border bg-red-400 p-2 ml-2"
                onClick={() => handleReject(inviter.id)}
              >
                Reject
              </button>
            </div>
          ))
        ) : (
          <p>No Invitations</p>
        )}
      </div>

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
