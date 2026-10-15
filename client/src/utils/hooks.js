import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [formData, setFormData] = useState(initialState);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    callback();
  };

  const resetForm = () => {
    setFormData({ ...initialState });
  };

  return {
    formData,
    onChange,
    onSubmit,
    resetForm,
  };
};
