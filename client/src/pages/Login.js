import { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { LOGIN_USER } from "../utils/mutations";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../utils/hooks";
import { AuthContext } from "../context/auth";

const Login = () => {
  const [errors, setErrors] = useState();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { formData, onChange, onSubmit } = useForm(onLogin, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      login(userData);
      navigate("/");
    },
    onError(err) {
      setErrors(err.errors[0]?.extensions?.errors);
    },
    variables: formData,
  });

  // Hoisted function to be used with useForm hook
  function onLogin() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          value={formData.username}
          error={!!errors?.username}
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
        <Button type="submit" primary>
          Login
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

export default Login;
