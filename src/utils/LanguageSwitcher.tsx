import { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative  justify-center flex  bg-calm-n-cool-1 rounded-md bg-opacity-40 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-calm-n-cool-5 bg-transparent"
      >
        {i18n.language === "en" ? "English" : "Bosanski"}{" "}
        <i className="fa-solid fa-circle-chevron-down"></i>
      </button>
      {isOpen && (
        <div className="absolute top-[40px] mt-[1px]   w-full bg-calm-n-cool-1 bg-opacity-70 rounded-md shadow-lg">
          <button
            onClick={() => changeLanguage("en")}
            className="block w-full text-left p-2 bg-calm-n-cool-1 text-calm-n-cool-5 hover:bg-opacity-20 hover:bg-calm-n-cool-1-hover rounded-t-md"
          >
            English
          </button>
          <button
            onClick={() => changeLanguage("bs")}
            className="block w-full text-left p-2 bg-calm-n-cool-1 text-calm-n-cool-5 hover:bg-opacity-20 hover:bg-calm-n-cool-1-hover rounded-b-md"
          >
            Bosanski
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
