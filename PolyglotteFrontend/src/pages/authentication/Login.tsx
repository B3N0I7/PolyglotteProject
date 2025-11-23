import React from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { LoginForm } from "../../features/authentication/login/components/LoginForm";
import { useLogin } from "../../features/authentication/login/hooks/loginHook";
import "./Auth.css";

const Login: React.FC = () => {
  const { formData, errors, isLoading, handleChange, handleSubmit } =
    useLogin();

  return (
    <MainLayout>
      <LoginForm
        formData={formData}
        errors={errors}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
    </MainLayout>
  );
};

export default Login;
