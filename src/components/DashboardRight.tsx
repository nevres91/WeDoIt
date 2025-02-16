import { User } from "firebase/auth";
import { Invitation, PartnerData, UserData } from "../types";
import { leavePartner } from "../utils/PartnerService";
import { useEffect } from "react";

interface DashboardRightProps {
  partnerData: PartnerData | null;
  invitations: Invitation[];
  userId: string | undefined;
  handleAccept: (id: string) => void;
  handleReject: (id: string) => void;
  userData: UserData;
}
export const DashboardRight: React.FC<DashboardRightProps> = ({
  partnerData,
  invitations,
  handleAccept,
  handleReject,
  userId,
  userData,
}) => {
  const isLeaveDisabled = !userId || !userData?.partnerId;

  const handleLeave = () => {
    if (userId && userData?.partnerId) {
      leavePartner(userId, userData.partnerId, () => {});
    }
  };
  return (
    <>
      <div className="flex flex-col p-5 shadow-2xl h-[calc(100%-6px)] w-[22%] bg-white  bg-opacity-80 backdrop-blur-[9px] rounded-[4px] mr-[3px]">
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
              invitations.map((inviter: any) => (
                <div key={inviter.id}>
                  <p className="my-2">
                    From: {inviter.senderFirstName} {inviter.senderLastName}
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
        {/* Leave Partner Button */}
        {/* Leave Partner Button */}
        <button
          onClick={handleLeave}
          disabled={isLeaveDisabled}
          className="bg-red-500 text-input-bg p-2 rounded-md w-[90%] hover:bg-red-600 transition-all duration-100 disabled:opacity-50 mt-2 absolute bottom-5"
        >
          Leave your partner
        </button>
      </div>
    </>
  );
};
