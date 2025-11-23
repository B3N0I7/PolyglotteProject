import MainLayout from "../layouts/MainLayout/MainLayout";
import { useAuth } from "../app/providers/AuthContext";

const Progress: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      <div className="welcome-section">
        <h1>Ma progression</h1>
        {isAuthenticated ? (
          <>
            <p>
              Suivez vos statistiques et vos accomplissements dans
              l'apprentissage.
            </p>
            <div className="welcome-actions">
              <button className="btn btn-primary">Voir les statistiques</button>
              <button className="btn btn-secondary">Objectifs</button>
            </div>
          </>
        ) : (
          <p>
            Veuillez vous connecter pour voir votre progression personnalisée.
          </p>
        )}
      </div>
    </MainLayout>
  );
};

export default Progress;
