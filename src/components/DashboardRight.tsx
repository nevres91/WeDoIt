import { Invitation, PartnerData } from "../types";

interface DashboardRightProps {
  partnerData: PartnerData | null;
  invitations: Invitation[];
  handleAccept: (id: string) => void;
  handleReject: (id: string) => void;
}
export const DashboardRight: React.FC<DashboardRightProps> = ({
  partnerData,
  invitations,
  handleAccept,
  handleReject,
}) => {
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
      </div>
    </>
  );
};
