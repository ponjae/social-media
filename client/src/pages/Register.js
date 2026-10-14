import { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { REGISTER_USER } from "../utils/mutations";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../utils/hooks";
import { AuthContext } from "../context/auth";

const Register = () => {
  const [errors, setErrors] = useState();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { formData, onChange, onSubmit } = useForm(addUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      login(userData);
      navigate("/");
    },
    onError(err) {
      setErrors(err.errors[0]?.extensions?.errors);
    },
    variables: { registerInput: formData },
  });

  // Hoisted function to be used with useForm hook
  function addUser() {
    registerUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} className={loading ? "loading" : ""}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          value={formData.username}
          error={!!errors?.username}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email"
          name="email"
          value={formData.email}
          error={!!errors?.email}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          error={!!errors?.password}
          onChange={onChange}
        />
        <Form.Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm password"
          name="confirmPassword"
          value={formData.confirmPassword}
          error={!!errors?.confirmPassword}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {errors && Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {errors &&
              Object.values(errors).map((value) => (
                <li key={value}>{value}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Register;
