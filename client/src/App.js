import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import MenuBar from "./components/MenuBar";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Container>
        <MenuBar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
