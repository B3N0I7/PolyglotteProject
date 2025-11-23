import MainLayout from "../layouts/MainLayout/MainLayout";

const Learn: React.FC = () => {
  return (
    <MainLayout>
      <div className="welcome-section">
        <h1>Section Apprentissage</h1>
        <p>
          Découvrez nos leçons interactives pour maîtriser de nouvelles langues.
        </p>
        <div className="welcome-actions">
          <button className="btn btn-primary">Commencer une leçon</button>
          <button className="btn btn-secondary">
            Voir les langues disponibles
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Learn;
