import { Invitation, PartnerData, UserData } from "../../types";
import { leavePartner } from "../../utils/PartnerService";

interface DashboardRightProps {
  partnerData: PartnerData | null;
  invitations: Invitation[];
  userId: string | undefined;
  handleAccept: (id: string) => void;
  handleReject: (id: string) => void;
  userData: UserData;
  invitationsMessage: string | null;
  role: string;
  // inviterHasPartner: boolean;
}
export const DashboardRight: React.FC<DashboardRightProps> = ({
  partnerData,
  invitations,
  handleAccept,
  handleReject,
  userId,
  userData,
  invitationsMessage,
  role,
  // inviterHasPartner,
}) => {
  const isLeaveDisabled = !userId || !userData?.partnerId;
  // useEffect(() => {
  //   console.log(userData);
  // });
  const handleLeave = () => {
    if (userId && userData?.partnerId) {
      leavePartner(userId, userData.partnerId);
    }
  };
  return (
    <>
      <div className=" flex flex-col p-5 shadow-2xl h-[calc(100%-6px)] w-[22%] bg-white  bg-opacity-80 backdrop-blur-[9px] rounded-[4px] mr-[3px]">
        <div
          className={`w-full h-full absolute top-0 left-0 opacity-5 ${
            role === "husband" ? "bg-woman scale-x-[-1]" : "bg-man"
          } bg-contain bg-no-repeat bg-center `}
        />
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
          <div className="bg-white bg-opacity-30 mt-5 p-3 shadow-lg z-40  ">
            {" "}
            {/* added z index, was below. */}
            <h2 className="text-login-button font-semibold ">
              Partner Invitation:
            </h2>
            {userData.partnerId && (
              <div className="text-red-400">You already have a partner</div>
            )}
            {invitations.length > 0 ? (
              invitations.map((inviter: any) => (
                <div key={inviter.id}>
                  <p className="my-2">
                    From: {inviter.senderFirstName} {inviter.senderLastName}
                  </p>
                  <div className="w-full">
                    <button
                      disabled={userData.partnerId ? true : false}
                      className={`border ${
                        userData.partnerId ? "bg-gray-400" : "bg-green-400"
                      } p-2  rounded-md text-white w-[50%] ${
                        !userData.partnerId ? "hover:bg-green-500" : ""
                      } transition-all duration-100`}
                      onClick={() => {
                        if (userData.partnerId) {
                          return console.log("You already have a partner");
                        }
                        handleAccept(inviter.id);
                      }}
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
        {invitationsMessage && (
          <div className="  mt-5 rounded-xl bg-red-200 text-red-600 p-3 content-center text-md font-thin text-center">
            {invitationsMessage}
          </div>
        )}
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
