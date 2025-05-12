import { useTranslation } from "react-i18next";
import { useState } from "react";
import { auth } from "../services/firebase";
import { sendEmailVerification, signOut, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Resend verification email
  const handleResendEmail = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await sendEmailVerification(user);
      setResendMessage(t("verification_email_resent"));
    } catch (error: any) {
      setResendMessage(t("resend_email_error"));
      console.error("Error resending verification email:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check verification status
  const checkVerification = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await user.reload(); // Refresh user data
      if (user.emailVerified) {
        navigate("/dashboard");
      } else {
        setResendMessage(t("email_not_verified"));
      }
    } catch (error) {
      console.error("Error checking verification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-calm-n-cool-1 to-calm-n-cool-2">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-calm-n-cool-6 text-center">
          {t("verify_email_title")}
        </h1>

        {/* Message */}
        <p className="text-calm-n-cool-5 text-center">
          {t("verify_email_message")} <br />
          <span className="font-semibold">{user?.email}</span>
        </p>

        {/* Resend Message (Success or Error) */}
        {resendMessage && (
          <div
            className={`text-center p-2 rounded-md ${
              resendMessage.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {resendMessage}
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className="w-full bg-calm-n-cool-6 text-calm-n-cool-1 py-2 rounded-md hover:bg-calm-n-cool-5 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? t("sending") : t("resend_verification_email")}
          </button>

          <button
            onClick={checkVerification}
            disabled={loading}
            className="w-full bg-calm-n-cool-4 text-calm-n-cool-1 py-2 rounded-md hover:bg-calm-n-cool-3 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? t("checking") : t("check_verification")}
          </button>

          <button
            onClick={handleSignOut}
            className="w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-all duration-200"
          >
            {t("logout")}
          </button>
        </div>

        {/* Additional Info */}
        <p className="text-sm text-calm-n-cool-5 text-center">
          {t("check_spam_folder")}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
