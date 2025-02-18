import { UserProfile } from "./UserProfile";

interface DashbarLeftProps {
  logout: () => void;
  role: string;
}

const DashbarLeft: React.FC<DashbarLeftProps> = ({ logout, role }) => {
  return (
    <>
      <div className="flex flex-col items-center shadow-2xl h-[calc(100%-6px)] w-[18%] bg-calm-n-cool-6  backdrop-blur-[9px] rounded-[4px] ml-[3px]">
        <div
          className={`w-full h-full absolute top-0 left-0 opacity-5 ${
            role === "husband" ? "bg-man scale-x-[-1]" : "bg-woman"
          } bg-contain bg-no-repeat bg-center `}
        />
        <UserProfile />
        <button
          onClick={logout}
          className="bg-calm-n-cool-4 tracking-widest hover:bg-calm-n-cool-1 hover:text-calm-n-cool-6 text-input-bg p-2  rounded-md w-[90%]  transition-all duration-100 disabled:opacity-50 mt-2 absolute bottom-5"
        >
          Logout
        </button>
      </div>
    </>
  );
};
export default DashbarLeft;
