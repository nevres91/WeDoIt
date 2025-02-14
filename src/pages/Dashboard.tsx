import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Partner from "../components/Partner";
import { useHideOnScroll } from "../hooks/UseHideOnScroll";
import Navbar from "../components/Navbar";
import { useInvitations } from "../hooks/useInvitations";
import { usePartnerData } from "../hooks/usePartnerData";

const Dashboard = () => {
  const [partnerLink, setPartnerLink] = useState<boolean>(false);
  const { userData, logout, setUserData } = useAuth();
  const { invitations, handleAccept, handleReject } = useInvitations();
  const { partnerData } = usePartnerData() || { partnerData: null };
  const { visible } = useHideOnScroll();

  const handleLogout = async () => {
    try {
      await logout();
      setUserData(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div //BACKGROUND
      style={{
        backgroundImage: `url('src/assets/dashboard_2.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="flex gap-[3px] rounded-xl  w-[100vw] h-[100vh] items-center ">
        <div //* --------------------LEFT-------------------- */
          className="flex flex-col items-center shadow-2xl h-[calc(100%-6px)] w-[18%] bg-white bg-opacity-80 backdrop-blur-[9px] rounded-[4px] ml-[3px]"
        >
          <button
            onClick={handleLogout}
            className="bg-login-button text-input-bg p-2  rounded-md w-[90%] hover:bg-button-hover transition-all duration-100 disabled:opacity-50 mt-2 absolute bottom-5"
          >
            Logout
          </button>
        </div>

        <div /* --------------------MIDDLE-------------------- */
          id="scrollable-content"
          className="flex shadow-2xl h-[calc(100%-6px)] w-[60%] bg-white bg-opacity-80 backdrop-blur-[9px] rounded-[4px] flex-col items-center overflow-auto relative"
        >
          <Navbar visible={visible} />
          {/* ROLE IMAGE */}
          <div
            className="w-[150px] h-[150px] mt-10"
            style={{
              backgroundImage: `${
                partnerData
                  ? `url('src/assets/couple.png')`
                  : userData?.role === "husband"
                  ? `url('src/assets/husband.png')`
                  : `url('src/assets/wife.png')`
              }`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
          {/* NAMES */}
          <h2 className="text-2xl font-bold mt-4 text-button-hover">
            {userData?.firstName.toUpperCase() +
              (partnerData
                ? " " + "& " + partnerData?.firstName.toUpperCase()
                : "")}
          </h2>
          {/* Partner data */}
          <div className="w-[45%]   p-10 mt-10 bg-login-button shadow-lg bg-opacity-15 rounded-md flex flex-col items-center">
            <p className="text-button-hover font-medium">
              Your role in this task application is a {userData?.role}
              {partnerData
                ? `, and ${partnerData?.firstName} is your ${
                    userData.role === "husband" ? "wife" : "husband"
                  }`
                : " and you don't have a partner yet."}
            </p>
            {!partnerData && !partnerLink ? (
              <button
                onClick={() => setPartnerLink(true)}
                className="bg-login-button text-input-bg p-2  rounded-md w-full hover:bg-button-hover transition-all duration-100 disabled:opacity-50 mt-2"
              >
                Connect to your partner
              </button>
            ) : !partnerData && partnerLink ? (
              <Partner />
            ) : (
              ""
            )}
          </div>
          <div className="p-8 pt-20 space-y-6">
            {[...Array(50)].map((_, i) => (
              <p key={i} className="text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur sodales.
              </p>
            ))}
          </div>
        </div>

        <div /* --------------------RIGHT-------------------- */
          className="flex flex-col p-5 shadow-2xl h-[calc(100%-6px)] w-[22%] bg-white  bg-opacity-80 backdrop-blur-[9px] rounded-[4px] mr-[3px]"
        >
          <p className="text">Partnesr's Information</p>
          {partnerData ? (
            <div className=" mt-10 p-2 rounded-sm bg-white shadow-lg bg-opacity-30  ">
              <p>First Name: {partnerData.firstName}</p>
              <p>Last Name: {partnerData.lastName}</p>
            </div>
          ) : (
            <div className="bg-white bg-opacity-30 mt-5 rounded-sm p-5 ">
              <p>Please Connect to a partner.</p>
            </div>
          )}
          {/* PENDING INVITATIONS */}
          {invitations.length > 0 ? (
            <div className="bg-white bg-opacity-30 mt-5 p-3 shadow-lg  ">
              <h2 className="text-login-button font-semibold ">
                Partner Invitation:
              </h2>
              {invitations.length > 0 ? (
                invitations.map((inviter) => (
                  <div key={inviter.id}>
                    <p className="my-2">
                      From: {inviter.firstName} {inviter.lastName}
                    </p>
                    <div className="w-full">
                      <button
                        className="border bg-green-400 p-2  rounded-md text-white w-[50%] hover:bg-green-500 transition-all duration-100"
                        onClick={() => handleAccept(inviter.id)}
                      >
                        Accept
                      </button>
                      <button
                        className="border bg-red-400 p-2 rounded-md text-white w-[50%] hover:bg-red-500 transition-all duration-100"
                        onClick={() => handleReject(inviter.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-red-500 font-thin">No Invitations</p>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
