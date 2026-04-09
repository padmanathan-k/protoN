import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Growth from "./pages/Growth.jsx";
import Nest from "./pages/Nest.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { useAppContext } from "./context/AppContext.jsx";

const PrivateRoute = ({ children }) => {
  const { token } = useAppContext();
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/growth"
        element={
          <PrivateRoute>
            <Growth />
          </PrivateRoute>
        }
      />
      <Route
        path="/nest"
        element={
          <PrivateRoute>
            <Nest />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
