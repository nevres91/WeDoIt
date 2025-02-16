import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHideOnScroll } from "../hooks/UseHideOnScroll";
import { useInvitations } from "../hooks/useInvitations";
import { usePartnerData } from "../hooks/usePartnerData";
import DashbarLeft from "../components/DashbarLeft";
import { DashboardMiddle } from "../components/DashboardMiddle";
import { DashboardRight } from "../components/DashboardRight";

const Dashboard = () => {
  const [partnerLink, setPartnerLink] = useState<boolean>(false);
  const { userData, logout, user } = useAuth();
  const { invitations, handleAccept, handleReject, invitationsMessage } =
    useInvitations();
  const { partnerData, loading } = usePartnerData() || {
    partnerData: null,
  };
  const { visible } = useHideOnScroll();

  return (
    <div //BACKGROUND
      className="flex bg-dashboard bg-cover bg-center min-h-[100vh] "
    >
      <div // CONTAINER
        className="flex gap-[3px] rounded-xl  w-[100vw] h-[100vh] items-center "
      >
        {/* --------------------LEFT SIDE-------------------- */}
        <DashbarLeft logout={logout} />
        {/* --------------------MIDDLE-------------------- */}
        <DashboardMiddle
          partnerLink={partnerLink}
          partnerData={partnerData}
          setPartnerLink={setPartnerLink}
          userData={userData}
          visible={visible}
          loading={loading}
        />
        {/* --------------------RIGHT SIDE-------------------- */}
        <DashboardRight
          handleAccept={handleAccept}
          handleReject={handleReject}
          invitations={invitations}
          partnerData={partnerData}
          userId={user?.uid}
          userData={userData}
          invitationsMessage={invitationsMessage}
        />
      </div>
    </div>
  );
};

export default Dashboard;
