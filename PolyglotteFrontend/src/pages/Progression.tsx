import { MainLayout } from '../layouts';
import { useAuth } from '../app/providers';

const Progression: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <MainLayout>
            <div className="welcome-section">
                <h1>Ma Progression</h1>
                {isAuthenticated ? (
                    <>
                        <p>Suivez vos statistiques et vos accomplissements dans l'apprentissage des langues.</p>
                        <div className="welcome-actions">
                            <button className="btn btn-primary">Voir les statistiques</button>
                            <button className="btn btn-secondary">Objectifs</button>
                        </div>
                    </>
                ) : (
                    <p>Connectez-vous pour voir votre progression personnalisée.</p>
                )}
            </div>
        </MainLayout>
    );
};

export default Progression;