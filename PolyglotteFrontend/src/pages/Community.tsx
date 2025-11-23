import MainLayout from "../layouts/MainLayout/MainLayout";

const Community: React.FC = () => {
  return (
    <MainLayout>
      <div className="welcome-section">
        <h1>Communauté</h1>
        <p>
          Rejoignez la communauté Polyglotte et échangez avec d'autres
          apprenants.
        </p>
        <div className="welcome-actions">
          <button className="btn btn-primary">Forums</button>
          <button className="btn btn-secondary">Trouvez un partenaire</button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Community;
