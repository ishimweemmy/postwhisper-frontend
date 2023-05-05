import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Home from "./pages/home/Home";
import Notfound from "./pages/Nofound/Notfound";
import { useSelector } from "react-redux";
import Account from "./pages/account/Account";
import { LinkedInCallback } from "react-linkedin-login-oauth2";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const userToken = useSelector((state) => state.user.token);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/linkedin" element={<LinkedInCallback />} />
          <Route
            path="/"
            element={userToken ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={!userToken ? <Login /> : <Navigate to={"/"} />}
          />
          <Route
            path="/register"
            element={!userToken ? <Signup /> : <Navigate to={"/"} />}
          />
          <Route path="/account" element={userToken ? <Account /> : <Navigate to="/login" />} />

          <Route path="*" element={<Notfound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
