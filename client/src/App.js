import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { AuthProvider } from "./context/auth";
import AuthRoute from "./utils/AuthRoute";

import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import MenuBar from "./components/MenuBar";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Container>
          <MenuBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<AuthRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
};

export default App;
