import './App.css'
import { MainLayout } from './layouts'

function App() {
  return (
    <MainLayout>
      <div className="welcome-section">
        <h1>Bienvenue sur Polyglotte!</h1>
        <p>Commencez votre voyage d'apprentissage des langues dès aujourd'hui.</p>
        <div className="welcome-actions">
          <button className="btn btn-primary">Commencer l'apprentissage</button>
          <button className="btn btn-secondary">Découvrir les langues</button>
        </div>
      </div>
    </MainLayout>
  )
}

export default App
