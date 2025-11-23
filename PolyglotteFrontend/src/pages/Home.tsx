import MainLayout from "../layouts/MainLayout/MainLayout";
import { useAuth } from "../app/providers/AuthContext";

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <MainLayout>
      <div className="welcome-section">
        {isAuthenticated && user ? (
          <>
            <h1>Bienvenue, {user.username} !</h1>
            <p>Vous êtes connecté avec l'email : {user.email}</p>
            <div className="welcome-actions">
              <button className="btn btn-primary">
                Commencer l'apprentissage
              </button>
              <button className="btn btn-secondary">
                Découvrir les langues
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>Bienvenue sur Polyglotte!</h1>
            <p>
              Commencez votre voyage d'apprentissage des langues dès
              aujourd'hui.
            </p>
            <p className="auth-notice">
              Connectez-vous ou créez un compte pour commencer votre
              apprentissage !
            </p>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
