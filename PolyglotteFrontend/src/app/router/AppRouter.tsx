import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../providers';
import Home from '../../pages/Home';
import Apprendre from '../../pages/Apprendre';
import MesMots from '../../pages/MesMots';
import Progression from '../../pages/Progression';
import Communaute from '../../pages/Communaute';
import { Login, Register } from '../../pages';

const AppRouter: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/accueil" element={<Navigate to="/" replace />} />
                    <Route path="/apprendre" element={<Apprendre />} />
                    <Route path="/mots" element={<MesMots />} />
                    <Route path="/progression" element={<Progression />} />
                    <Route path="/communaute" element={<Communaute />} />
                    <Route path="/connexion" element={<Login />} />
                    <Route path="/inscription" element={<Register />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRouter;