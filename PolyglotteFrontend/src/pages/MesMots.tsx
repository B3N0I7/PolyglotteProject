import { MainLayout } from '../layouts';
import { useAuth } from '../app/providers';

const MesMots: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <MainLayout>
            <div className="welcome-section">
                <h1>Mes Mots</h1>
                {isAuthenticated ? (
                    <>
                        <p>Gérez votre vocabulaire personnel et suivez vos progrès.</p>
                        <div className="welcome-actions">
                            <button className="btn btn-primary">Ajouter un mot</button>
                            <button className="btn btn-secondary">Réviser</button>
                        </div>
                    </>
                ) : (
                    <p>Connectez-vous pour accéder à votre vocabulaire personnalisé.</p>
                )}
            </div>
        </MainLayout>
    );
};

export default MesMots;