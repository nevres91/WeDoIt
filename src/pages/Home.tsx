import { useNavigate } from "react-router-dom";
import LogIn from "./LogIn";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import SignUp from "./SignUp";
import LanguageSwitcher from "../utils/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../hooks/useLanguage";
import { useError } from "../context/ErrorContext";

const Home = () => {
  const [register, setRegister] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error } = useError();

  const { t } = useTranslation();
  useLanguage();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);
  return (
    <>
      <div
        className="px-2 min-w-[380px]"
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
        <div className="absolute top-1 left-1 z-40">
          <LanguageSwitcher />
        </div>
        <div
          className={`${register ? "w-[500px]" : "w-[400px]"} min-w-[340px] ${
            error ? "bg-red-100" : "bg-calm-n-cool-1"
          } p-10 rounded-xl bg-opacity-50 backdrop-blur-[6px] ${
            error
              ? "shadow-[0px_0px_10px_5px_rgba(214,42,42,0.75)]"
              : "shadow-[0px_0px_10px_5px_rgba(0,0,0,0.35)]"
          }  `}
        >
          {register ? <SignUp /> : <LogIn />}
          {register ? (
            <div className="flex flex-row mt-3 text-calm-n-cool-6">
              <p>{t("Already_have_an_account")}</p>{" "}
              <button
                onClick={() => setRegister(false)}
                className="p-0 ml-2  text-calm-n-cool-4 hover:text-calm-n-cool-3"
              >
                {t("login")}
              </button>
            </div>
          ) : (
            <div className="flex flex-row mt-3 text-calm-n-cool-6">
              <p>{t("Dont_have_an_account_yet")}</p>{" "}
              <button
                onClick={() => setRegister(true)}
                className="p-0 ml-2 text-calm-n-cool-4 hover:text-calm-n-cool-3"
              >
                {t("register")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
