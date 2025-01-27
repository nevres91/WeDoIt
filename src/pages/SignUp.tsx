import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { auth, db } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Define the types for the form values
interface SignUpValues {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  password: string;
  confirmPassword: string;
  partnerId: string;
  invitations: string[];
}

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formik = useFormik<SignUpValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      role: "",
      email: "",
      password: "",
      confirmPassword: "",
      partnerId: "",
      invitations: [],
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      role: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        console.log("User created:", userCredential.user);
        const user = userCredential.user;

        // Write data to firestore database
        await setDoc(doc(db, "users", user.uid), {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          role: values.role,
          partnerId: "",
          invitations: [],
          createdAt: new Date(),
        });

        // Log the user in after successful register
        await signInWithEmailAndPassword(auth, values.email, values.password);
        console.log("User loged in");
        // Redirect to dashboard or another page (optional)
        navigate("/dashboard");
        // history.push("/dashboard"); // Uncomment if using React Router
        setError(null); // Clear any previous error
      } catch (error: any) {
        setError(error.message); // Set error message if something goes wrong
        console.error("Error creating user:", error.message);
      } finally {
        setLoading(false); // End loading state
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4  m-auto">
      <div>
        <label htmlFor="firstName" className="block text-text-color">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.firstName}
          className="p-2 rounded-md w-full text-input-text bg-input-bg"
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <div className="text-red-500">{formik.errors.firstName}</div>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-text-color">
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
          className="p-2 rounded-md w-full text-input-text bg-input-bg"
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <div className="text-red-500">{formik.errors.lastName}</div>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-text-color">
          Role
        </label>
        <select
          id="role"
          name="role"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.role}
          className="p-2 rounded-md w-full text-input-text bg-input-bg"
        >
          <option value="husband">Husband</option>
          <option value="wife">Wife</option>
        </select>
        {formik.touched.role && formik.errors.role && (
          <div className="text-red-500">{formik.errors.role}</div>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-text-color">
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

      <div>
        <label htmlFor="password" className="block text-text-color">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          className="p-2 rounded-md w-full text-input-text bg-input-bg"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500">{formik.errors.password}</div>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-text-color">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
          className="p-2 rounded-md w-full text-input-text bg-input-bg"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="text-red-500">{formik.errors.confirmPassword}</div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-login-button text-input-bg p-2 rounded-md w-full hover:bg-button-hover transition-all duration-100 disabled:opacity-50"
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUp;
