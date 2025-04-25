import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { auth, db } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useError } from "../context/ErrorContext";

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
  language: string;
}

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const formik = useFormik<SignUpValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      role: "husband",
      email: "",
      password: "",
      confirmPassword: "",
      partnerId: "",
      invitations: [],
      language: "en",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(t("required")),
      lastName: Yup.string().required(t("required")),
      role: Yup.string().required(t("required")),
      email: Yup.string()
        .email(t("invalid_email_address"))
        .required(t("required")),
      password: Yup.string()
        .min(6, t("password_min_length"))
        .required(t("required")),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], t("passwords_must_match"))
        .required(t("required")),
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
          language: values.language,
          createdAt: new Date().toISOString(),
        });
        // Add initial tasks to Firestore 'tasks' collection
        const tasksCollection = collection(db, "tasks");
        const initialTasks = [
          {
            title: t("initial_task_1_title"),
            description: t("initial_task_1_description"),
            status: "To Do",
            creator: "self",
            createdAt: new Date().toISOString(),
            dueDate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(), // 7 days from now
            priority: "Low",
            userId: user.uid,
          },
          {
            title: t("initial_task_2_title"),
            description: t("initial_task_2_description"),
            status: "To Do",
            creator: "self",
            createdAt: new Date().toISOString(),
            dueDate: new Date(
              Date.now() + 14 * 24 * 60 * 60 * 1000
            ).toISOString(), // 14 days from now
            priority: "Medium",
            userId: user.uid,
          },
        ];
        // Add each initial task to the 'tasks' collection
        for (const task of initialTasks) {
          await addDoc(tasksCollection, task);
        }

        // Log the user in after successful register
        await signInWithEmailAndPassword(auth, values.email, values.password);
        console.log("User loged in");

        // Redirect to dashboard or another page (optional)
        navigate("/dashboard");
        // history.push("/dashboard"); // Uncomment if using React Router

        setError(null); // Clear any previous error
      } catch (error: any) {
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
          setError(t("email_already_in_use")); // Set error message if something goes wrong
        }
        console.error("Error creating user:", error.message);
      } finally {
        setLoading(false); // End loading state
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4  m-auto">
      <div>
        <label htmlFor="firstName" className="block text-calm-n-cool-6">
          {t("first_name")}
        </label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={() => setError(null)}
          value={formik.values.firstName}
          className="p-2 rounded-md w-full text-calm-n-cool-5 bg-input-bg"
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <div className="text-red-500">{formik.errors.firstName}</div>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-calm-n-cool-6">
          {t("last_name")}
        </label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={() => setError(null)}
          value={formik.values.lastName}
          className="p-2 rounded-md w-full text-calm-n-cool-5 bg-input-bg"
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <div className="text-red-500">{formik.errors.lastName}</div>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-calm-n-cool-6">
          {t("role")}
        </label>
        <select
          id="role"
          name="role"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={() => setError(null)}
          value={formik.values.role}
          className="p-2 rounded-md w-full text-calm-n-cool-5 bg-input-bg"
        >
          <option value="husband">{t("husband")}</option>
          <option value="wife">{t("wife")}</option>
        </select>
        {formik.touched.role && formik.errors.role && (
          <div className="text-red-500">{formik.errors.role}</div>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-calm-n-cool-6">
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

      <div>
        <label htmlFor="password" className="block text-calm-n-cool-6">
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
          className="p-2 rounded-md w-full text-calm-n-cool-5 bg-input-bg"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500">{formik.errors.password}</div>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-calm-n-cool-6">
          {t("confirm_password")}
        </label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={() => setError(null)}
          value={formik.values.confirmPassword}
          className="p-2 rounded-md w-full text-calm-n-cool-5 bg-input-bg"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="text-red-500">{formik.errors.confirmPassword}</div>
        )}
      </div>
      <div>
        <label htmlFor="language" className="block text-calm-n-cool-6">
          {t("language")}
        </label>
        <select
          id="language"
          name="language"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={() => setError(null)}
          value={formik.values.language}
          className="p-2 rounded-md w-full text-calm-n-cool-5 bg-input-bg"
        >
          <option value="en">{t("english")}</option>
          <option value="bs">{t("bosanski")}</option>
        </select>
        {formik.touched.language && formik.errors.language && (
          <div className="text-red-500">{formik.errors.language}</div>
        )}
      </div>

      {error && <div className="text-red-600 text-center ">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="bg-calm-n-cool-6 text-calm-n-cool-1 p-2 rounded-md w-full hover:bg-calm-n-cool-5 transition-all duration-100 disabled:opacity-50"
      >
        {loading ? t("signing_up") : t("sign_up")}
      </button>
    </form>
  );
};

export default SignUp;
