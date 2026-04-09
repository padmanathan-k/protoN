import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthScene from "./AuthScene.jsx";
import { useAppContext } from "../context/AppContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { authSubmit } = useAppContext();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await authSubmit("login", formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScene
      mode="login"
      title="Login"
      submitLabel="go Need"
      fields={[
        { name: "identifier", placeholder: "Username or email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
      submitting={submitting}
    />
  );
};

export default Login;
