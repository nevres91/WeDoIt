export const UserProfile = () => {
  return (
    <>
      <div // Container
        className="relative w-[calc(100%-12px)] min-w-[220px] h-36 flex flex-col bg-calm-n-cool-1 items-center p-1 gap-2  shadow-md my-3 rounded-md mt-[13%] border-2 border-red-600"
      >
        <div // Buttons
          className="flex items-center content-center text-center bg-calm-n-cool-1 h-[22%] absolute -top-[38px] left-0 w-[50%] rounded-md hover:bg-calm-n-cool-4 transition-all duration-150 cursor-pointer p-1 text-calm-n-cool-6 hover:text-calm-n-cool-1"
        >
          <i className=" fa-solid fa-user-pen fa-lg  ml-[calc(50%-22%)]"></i>
        </div>
        <div // Buttons
          className="flex items-center content-center text-center bg-calm-n-cool-1 h-[22%] absolute -top-[38px] right-0 w-[50%] rounded-md hover:bg-calm-n-cool-4 transition-all duration-150 cursor-pointer p-1 text-calm-n-cool-6 hover:text-calm-n-cool-1"
        >
          <i className=" fa-solid fa-house fa-lg  ml-[calc(50%+5%)]"></i>
        </div>
        <div // Profile Picture
          className=" bg-gray-400 rounded-full w-[100px] h-[100px] mt-3 absolute -top-14 border-4 border-calm-n-cool-6"
        />
        <div
          className=" text-calm-n-cool-6 font-semibold text-xl my-3 mt-[50px] text-center"
          style={{ fontFamily: "montserrat" }}
        >
          <p>Nevres Muratovic</p>
          <p className="text-sm font-light">nevres_muratovic@hotmail.com</p>
        </div>
      </div>
      <div className="bg-calm-n-cool-1 p-2 w-[calc(100%-12px)] text-sm text-calm-n-cool-6  min-w-[220px] rounded-md">
        <p className=" font-bold">Partner Data:</p>
        <p>Sex: Male</p>
        <p>Height: 186cm</p>
        <p>Weight: 94kg</p>
      </div>
    </>
  );
};
