import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthScene from "./AuthScene.jsx";
import { useAppContext } from "../context/AppContext.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { authSubmit } = useAppContext();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
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
      await authSubmit("register", formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScene
      mode="register"
      title="Create"
      submitLabel="Start Growing"
      fields={[
        { name: "username", placeholder: "Create Username" },
        { name: "email", placeholder: "Create Email" },
        { name: "password", type: "password", placeholder: "Create Password" },
      ]}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
      submitting={submitting}
    />
  );
};

export default Register;
