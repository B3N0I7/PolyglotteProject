import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "../providers/AuthProvider";
import Home from "../../pages/Home";
import Learn from "../../pages/Learn";
import MyWords from "../../pages/MyWords";
import AddWord from "../../pages/AddWord";
import UpdateWord from "../../pages/UpdateWord";
import DeleteWord from "../../pages/DeleteWord";
import Progress from "../../pages/Progress";
import Community from "../../pages/Community";
import Login from "../../pages/authentication/Login";
import Register from "../../pages/authentication/Register";

const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/words" element={<MyWords />} />
          <Route path="/words/add" element={<AddWord />} />
          <Route path="/words/edit/:id" element={<UpdateWord />} />
          <Route path="/words/delete/:id" element={<DeleteWord />} />
          <Route path="/my-words" element={<Navigate to="/words" replace />} />
          <Route
            path="/add-word"
            element={<Navigate to="/words/add" replace />}
          />
          <Route path="/progress" element={<Progress />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
