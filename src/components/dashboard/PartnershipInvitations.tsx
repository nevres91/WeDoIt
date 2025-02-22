import { useInvitations } from "../../hooks/useInvitations";
import { UserData } from "../../types";

export const PartnershipInvitations = ({
  userData,
}: {
  userData: UserData;
}) => {
  const { invitations, handleAccept, handleReject, invitationsMessage } =
    useInvitations();
  return (
    <>
      {/* PENDING INVITATIONS */}
      {invitations.length > 0 ? (
        <div // CONTAINER
          className="bg-calm-n-cool-5 w-[calc(100%-12px)] rounded-md mt-5 p-2  z-40  "
        >
          {" "}
          {/* added z index, was below. */}
          <h2 className="text-calm-n-cool-1 font-semibold ">
            Partner Invitation:
          </h2>
          {userData.partnerId && (
            <div className="text-red-400">You already have a partner</div>
          )}
          {invitations.length > 0 ? (
            invitations.map((inviter: any) => (
              <div key={inviter.id}>
                <p className="my-2 text-calm-n-cool-1">
                  From: {inviter.senderFirstName} {inviter.senderLastName}
                </p>
                <div className=" justify-between flex">
                  <button
                    disabled={userData.partnerId ? true : false}
                    className={`border ${
                      userData.partnerId ? "bg-gray-400" : "bg-green-500"
                    } p-2  rounded-md border-calm-n-cool-1 text-calm-n-cool-1 w-[49%] ${
                      !userData.partnerId ? "hover:bg-green-600" : ""
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
                    className="border border-calm-n-cool-1 bg-red-500 p-2 rounded-md text-white w-[49%] hover:bg-red-600 transition-all duration-100"
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
    </>
  );
};
