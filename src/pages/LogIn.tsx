import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useError } from "../context/ErrorContext";

const LogIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { error, setError } = useError();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email(t("invalid_email")).required(t("required")),
      password: Yup.string().required(t("required")),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        setError(null); // Clear previous errors
        navigate("/dashboard"); // Redirect after successful LogIn
      } catch (error: any) {
        if (error.message === "Firebase: Error (auth/invalid-credential).") {
          setError(t("invalid_email_or_password")); // Show error message if LogIn fails
          console.log("Error:" + error.message);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4   ">
      {error && <div className="text-red-500">{error}</div>}
      {/* Email Field */}
      <div>
        <label className="text-calm-n-cool-6" htmlFor="email">
          {t("email")}
        </label>
        <input
          id="email"
          type="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={() => setError(null)}
          value={formik.values.email}
          className="p-2 rounded-md w-full text-calm-n-cool-5 bg-input-bg"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500">{formik.errors.email}</div>
        )}
      </div>
      {/* Password Field */}
      <div>
        <label className="text-calm-n-cool-6" htmlFor="password">
          {t("password")}
        </label>
        <input
          id="password"
          type="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={() => setError(null)}
          value={formik.values.password}
          className="p-2 rounded-md w-full text-calm-n-cool-5 bg-input-bg "
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500">{formik.errors.password}</div>
        )}
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-calm-n-cool-6 text-input-bg p-2  rounded-md w-full hover:bg-calm-n-cool-5 transition-all duration-100 disabled:opacity-50 "
      >
        {loading ? t("logging_in") : t("log_in")}
      </button>
    </form>
  );
};

export default LogIn;
