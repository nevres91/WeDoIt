import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        setError(null); // Clear previous errors
        navigate("/dashboard"); // Redirect after successful LogIn
      } catch (error: any) {
        setError(error.message); // Show error message if LogIn fails
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
        <label className="text-text-color" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="p-2 rounded-md w-full text-input-text bg-input-bg"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500">{formik.errors.email}</div>
        )}
      </div>
      {/* Password Field */}
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          className="p-2 rounded-md w-full text-input-text bg-input-bg "
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500">{formik.errors.password}</div>
        )}
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-login-button text-input-bg p-2  rounded-md w-full hover:bg-button-hover transition-all duration-100 disabled:opacity-50 "
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
};

export default LogIn;
