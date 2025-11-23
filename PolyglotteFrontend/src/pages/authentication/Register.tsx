import React from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { RegisterForm } from "../../features/authentication/register/components/RegisterForm";
import { useRegister } from "../../features/authentication/register/hooks/registerHook";
import "./Auth.css";

const Register: React.FC = () => {
  const {
    formData,
    errors,
    isLoading,
    passwordStrength,
    handleChange,
    handleSubmit,
  } = useRegister();

  return (
    <MainLayout>
      <RegisterForm
        formData={formData}
        errors={errors}
        isLoading={isLoading}
        passwordStrength={passwordStrength}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
    </MainLayout>
  );
};

export default Register;
