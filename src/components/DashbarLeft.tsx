interface LogoutProps {
  logout: () => void;
}

const DashbarLeft: React.FC<LogoutProps> = ({ logout }) => {
  return (
    <>
      <div className="flex flex-col items-center shadow-2xl h-[calc(100%-6px)] w-[18%] bg-white bg-opacity-80 backdrop-blur-[9px] rounded-[4px] ml-[3px]">
        <button
          onClick={logout}
          className="bg-login-button text-input-bg p-2  rounded-md w-[90%] hover:bg-button-hover transition-all duration-100 disabled:opacity-50 mt-2 absolute bottom-5"
        >
          Logout
        </button>
      </div>
    </>
  );
};
export default DashbarLeft;
