import { useNavigate } from "react-router-dom";
import LogIn from "./LogIn";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import SignUp from "./SignUp";

const Home = () => {
  const [register, setRegister] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);
  return (
    <>
      <div
        style={{
          backgroundImage: `url('src/assets/LoginPage.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className={`${
            register ? "w-[500px]" : "w-[400px]"
          } bg-form-bg p-10 rounded-xl bg-opacity-40 backdrop-blur-[6px]`}
        >
          {register ? <SignUp /> : <LogIn />}
          {register ? (
            <div className="flex flex-row mt-3">
              <p>Already have an account?</p>{" "}
              <button
                onClick={() => setRegister(false)}
                className="p-0 ml-2  text-orange-900"
              >
                Login
              </button>
            </div>
          ) : (
            <div className="flex flex-row mt-3">
              <p>Don't have an account yet?</p>{" "}
              <button
                onClick={() => setRegister(true)}
                className="p-0 ml-2 text-orange-900"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
