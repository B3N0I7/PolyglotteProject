---
applyTo: "PolyglotteFrontend/**"
---

# Principales Règles de Codage en React

## Suivre les 'Rules of React'

### 1. Utiliser des Composants Fonctionnels

**DO** : Utiliser des composants fonctionnels avec hooks

```jsx
// ✅ Bon
function UserProfile({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "Cancel" : "Edit"}
      </button>
    </div>
  );
}
```

**DON'T DO** : Éviter les composants classe obsolètes

```jsx
// ❌ À éviter
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: false };
  }

  render() {
    return (
      <div>
        <h2>{this.props.user.name}</h2>
        <button
          onClick={() => this.setState({ isEditing: !this.state.isEditing })}
        >
          {this.state.isEditing ? "Cancel" : "Edit"}
        </button>
      </div>
    );
  }
}
```

### 2. Hooks

**DO** : Utiliser les hooks correctement

```jsx
// ✅ Bon
function DataFetcher({ url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (loading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

**DON'T DO** : Ne pas mélanger hooks et classes

```jsx
// ❌ À éviter
class DataFetcher extends React.Component {
  // Ne pas utiliser hooks dans les composants classe
  const [data, setData] = useState(null); // ❌ Erreur

  render() {
    return <div>Content</div>;
  }
}
```

### 3. Ne pas Appeler les Hooks à l'Intérieur de Boucles ou de Conditions

**DO** : Appeler les hooks au niveau supérieur

```jsx
// ✅ Bon
function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(name.length > 0 && email.includes("@"));
  }, [name, email]);

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
    </form>
  );
}
```

**DON'T DO** : Éviter les hooks conditionnels

```jsx
// ❌ À éviter
function UserForm() {
  const [name, setName] = useState("");

  if (name.length > 0) {
    // ❌ Hook appelé conditionnellement
    const [email, setEmail] = useState("");
  }

  for (let i = 0; i < 3; i++) {
    // ❌ Hook appelé dans une boucle
    const [value, setValue] = useState("");
  }

  return <form>...</form>;
}
```

### 4. Utiliser des Noms de Composants Commençant par une Majuscule

**DO** : Nommer correctement les composants

```jsx
// ✅ Bon
function UserCard({ user }) {
  return <div className="user-card">{user.name}</div>;
}

const ProductList = ({ products }) => (
  <ul>
    {products.map((product) => (
      <li key={product.id}>{product.name}</li>
    ))}
  </ul>
);
```

**DON'T DO** : Éviter les noms en minuscule

```jsx
// ❌ À éviter
function usercard({ user }) {
  // ❌ Doit commencer par une majuscule
  return <div>{user.name}</div>;
}

const productlist = (
  { products } // ❌ Doit commencer par une majuscule
) => <ul>...</ul>;
```

### 5. Retourner un Seul Élément

**DO** : Utiliser des fragments ou un conteneur parent

```jsx
// ✅ Bon
function UserProfile({ user }) {
  return (
    <>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <img src={user.avatar} alt="Avatar" />
    </>
  );
}

// ✅ Alternative avec fragment nommé
function ProductDetails({ product }) {
  return (
    <React.Fragment>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
    </React.Fragment>
  );
}
```

**DON'T DO** : Éviter les retours multiples

```jsx
// ❌ À éviter
function UserProfile({ user }) {
  return (
    <h1>{user.name}</h1> // ❌ Retourne plusieurs éléments
    <p>{user.email}</p>
    <img src={user.avatar} alt="Avatar" />
  );
}
```

### 6. Utiliser des Clés Uniques pour les Listes

**DO** : Utiliser des identifiants uniques

```jsx
// ✅ Bon
function ProductList({ products }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {" "}
          {/* ✅ Clé unique et stable */}
          {product.name} - ${product.price}
        </li>
      ))}
    </ul>
  );
}

// ✅ Pour les données sans ID, utiliser un index en dernier recours
function TemporaryList({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {" "}
          {/* ✅ Acceptable si pas d'ID unique */}
          {item}
        </li>
      ))}
    </ul>
  );
}
```

**DON'T DO** : Éviter les clés non-uniques ou aléatoires

```jsx
// ❌ À éviter
function ProductList({ products }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={Math.random()}>
          {" "}
          {/* ❌ Clé changeante à chaque rendu */}
          {product.name}
        </li>
      ))}
    </ul>
  );
}

// ❌ Éviter les clés dupliquées
function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key="user-item">
          {" "}
          {/* ❌ Clé dupliquée */}
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

### 7. Éviter les Effets Secondaires dans le Rendu

**DO** : Utiliser useEffect pour les effets secondaires

```jsx
// ✅ Bon
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Effet secondaire dans useEffect
    fetchUser(userId).then(setUser);
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

**DON'T DO** : Éviter les effets directs dans le rendu

```jsx
// ❌ À éviter
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);

  // ❌ Effet secondaire direct dans le rendu
  fetchUser(userId).then(setUser);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  );
}

// ❌ Modification directe de l'état pendant le rendu
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ Modification de l'état pendant le rendu
  setCount(count + 1);

  return <div>{count}</div>;
}
```

### 8. Gérer les Erreurs avec des Boundaries

**DO** : Implémenter des Error Boundaries

```jsx
// ✅ Bon
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Utilisation
function App() {
  return (
    <ErrorBoundary fallback={<div>Custom error message</div>}>
      <UserProfile />
      <ProductList />
    </ErrorBoundary>
  );
}
```

**DON'T DO** : Éviter de gérer les erreurs dans les composants fonctionnels

```jsx
// ❌ À éviter
function UserProfile({ user }) {
  try {
    return (
      <div>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>
    );
  } catch (error) {
    // ❌ Ne fonctionne pas pour les erreurs de rendu React
    return <div>Error loading user</div>;
  }
}

// ❌ Ne pas ignorer les erreurs
function ProductList({ products }) {
  // ❌ Aucune gestion d'erreur
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### 9. Optimiser les Performances

**DO** : Utiliser les optimisations appropriées

```jsx
// ✅ Bon
const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data,
  onUpdate,
}) {
  const processedData = useMemo(() => {
    return data
      .filter((item) => item.active)
      .map((item) => ({
        ...item,
        computedValue: item.value * 2,
      }));
  }, [data]);

  const handleUpdate = useCallback(
    (id, value) => {
      onUpdate(id, value);
    },
    [onUpdate]
  );

  return (
    <div>
      {processedData.map((item) => (
        <div key={item.id} onClick={() => handleUpdate(item.id, item.value)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
```

**DON'T DO** : Éviter les optimisations inutiles ou incorrectes

```jsx
// ❌ À éviter
// Mauvais usage de React.memo pour des composants simples
const SimpleButton = React.memo(function SimpleButton({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
});

// useMemo/useCallback inutiles
function UserList({ users }) {
  const userCount = useMemo(() => users.length, [users]); // ❌ Calcul trivial

  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []); // ❌ Fonction simple

  return (
    <div>
      <p>Users: {userCount}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```

### 10. Utiliser TypeScript pour la Validation des Props

**DO** : Définir les types avec TypeScript

```typescript
// ✅ Bon
interface UserProfileProps {
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string; // Optionnel
  };
  onEdit: (user: User) => void;
  isAdmin?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onEdit,
  isAdmin = false,
}) => {
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {isAdmin && <button onClick={() => onEdit(user)}>Edit User</button>}
    </div>
  );
};
```

**DON'T DO** : Éviter le typage faible ou incorrect

```typescript
// ❌ À éviter
// Pas de typage
const UserProfile = ({ user, onEdit }) => {
  // ❌ Types implicites any
  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
};

// Typage trop permissif
interface UserProps {
  user: any; // ❌ Type any trop permissif
  onEdit: Function; // ❌ Function trop vague
}

// Types incorrects
interface ProductProps {
  price: string; // ❌ Devrait être number
  inStock: "yes" | "no"; // ❌ Devrait être boolean
}
```

### 11. Séparer la Logique et la Présentation

**DO** : Séparer les composants présentationnels et conteneurs

```jsx
// ✅ Bon - Composant présentationnel (dumb component)
function UserCard({ user, onEdit, onDelete, isEditing }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <div className="actions">
        <button onClick={() => onEdit(user.id)} disabled={isEditing}>
          Edit
        </button>
        <button onClick={() => onDelete(user.id)}>Delete</button>
      </div>
    </div>
  );
}

// ✅ Bon - Composant conteneur (smart component)
function UserCardContainer({ userId }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  const handleEdit = useCallback((id) => {
    setIsEditing(true);
    // Logique d'édition...
  }, []);

  const handleDelete = useCallback((id) => {
    // Logique de suppression...
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <UserCard
      user={user}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isEditing={isEditing}
    />
  );
}
```

**DON'T DO** : Éviter les composants mélangés

```jsx
// ❌ À éviter - Composant qui fait tout
function UserCard({ userId }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Logique de fetching
  useEffect(() => {
    fetchUser(userId).then((userData) => {
      setUser(userData);
      setLoading(false);
    });
  }, [userId]);

  // Logique métier
  const updateUser = async (userData) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    return response.json();
  };

  // Logique de présentation
  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {/* Trop de responsabilités dans un seul composant */}
    </div>
  );
}
```

### 12. Utiliser des Contexts pour le Partage d'État Global

**DO** : Utiliser Context API correctement

```jsx
// ✅ Bon
const UserContext = React.createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser().then((userData) => {
      setUser(userData);
      setLoading(false);
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      login: (credentials) => {
        return loginUser(credentials).then(setUser);
      },
      logout: () => {
        logoutUser().then(() => setUser(null));
      },
    }),
    [user, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Hook personnalisé pour utiliser le contexte
function useUser() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Utilisation dans un composant
function UserProfile() {
  const { user, login, logout } = useUser();

  if (!user) return <button onClick={() => login(credentials)}>Login</button>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**DON'T DO** : Éviter les mauvaises pratiques avec Context

```jsx
// ❌ À éviter - Créer un contexte pour chaque état
const UserNameContext = React.createContext();
const UserEmailContext = React.createContext();
const UserAvatarContext = React.createContext();

// ❌ Valeur du contexte qui change trop souvent
function BadUserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  ); // ❌ Nouvel objet à chaque rendu
}

// ❌ Utilisation sans hook personnalisé
function UserProfile() {
  const context = React.useContext(UserContext); // ❌ Pas de vérification
  return <div>{context.user.name}</div>; // ❌ Peut causer des erreurs
}
```

### 13. Écrire des Tests Unitaires

**DO** : Écrire des tests complets

```jsx
// ✅ Bon - Tests avec React Testing Library
import { render, screen, fireEvent } from "@testing-library/react";
import UserProfile from "./UserProfile";

describe("UserProfile", () => {
  const mockUser = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  };

  test("renders user information", () => {
    render(<UserProfile user={mockUser} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  test("calls onEdit when edit button is clicked", () => {
    const mockOnEdit = jest.fn();
    render(<UserProfile user={mockUser} onEdit={mockOnEdit} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(mockOnEdit).toHaveBeenCalledWith(mockUser.id);
  });

  test("displays loading state", () => {
    render(<UserProfile user={null} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

**DON'T DO** : Éviter les tests de mise en œuvre

```jsx
// ❌ À éviter - Tests de mise en œuvre
import { shallow } from "enzyme";

describe("UserProfile", () => {
  test("updates state correctly", () => {
    const wrapper = shallow(<UserProfile user={mockUser} />);

    // ❌ Teste l'implémentation interne
    wrapper.instance().setState({ isEditing: true });
    expect(wrapper.state("isEditing")).toBe(true);

    // ❌ Teste les détails d'implémentation
    expect(wrapper.find("button").prop("onClick")).toBe(
      wrapper.instance().handleEdit
    );
  });
});

// ❌ Tests incomplets ou non significatifs
test("renders without crashing", () => {
  // ❌ Test trop basique
  render(<UserProfile user={null} />);
});

// ❌ Utiliser des sélectors CSS fragiles
test("displays user name", () => {
  render(<UserProfile user={mockUser} />);

  expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe"); // ❌ Test ID spécifique
  expect(document.querySelector(".user-card h2")).toBeInTheDocument(); // ❌ Sélector CSS fragile
});
```

### 14. Suivre les Conventions de Nommage

**DO** : Utiliser des conventions cohérentes

```jsx
// ✅ Bon - Conventions cohérentes
// Fichier: components/UserProfile/UserProfile.jsx
function UserProfile({ user, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const hasUnreadMessages = useHasUnreadMessages(user.id);

  const handleSave = useCallback(
    (userData) => {
      return saveUser(user.id, userData);
    },
    [user.id]
  );

  if (!user) return null;

  return (
    <div className="user-profile">
      <UserAvatar user={user} size="large" />
      <UserInfo user={user} />
      <UserActions onEdit={onEdit} />
    </div>
  );
}

// Hook personnalisé
function useHasUnreadMessages(userId) {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // Logique de vérification des messages...
  }, [userId]);

  return hasUnread;
}
```

**DON'T DO** : Éviter les incohérences de nommage

```jsx
// ❌ À éviter - Incohérences de nommage
// Fichier: components/userProfile/UserProfile.js (❌ mélange camelCase et PascalCase)
function user_profile({ User, on_edit }) {
  // ❌ snake_case
  const [isediting, setisediting] = useState(false); // ❌ camelCase incorrect

  const HandleSave = useCallback(
    (user_data) => {
      // ❌ PascalCase pour fonction
      return saveUser(User.id, user_data);
    },
    [User.id]
  );

  return (
    <div>
      <userAvatar user={User} /> {/* ❌ minuscule pour composant */}
      <User_Info user={User} /> {/* ❌ snake_case pour composant */}
    </div>
  );
}
```

## Suivre le 'Thinking in React'

### 1. Décomposer l'Interface Utilisateur en Composants

**DO** : Identifier les composants réutilisables

```jsx
// ✅ Bon - Décomposition claire
function ECommerceProductPage({ product }) {
  return (
    <div className="product-page">
      <ProductHeader title={product.name} rating={product.rating} />
      <ProductGallery images={product.images} />
      <ProductDetails
        description={product.description}
        features={product.features}
      />
      <ProductPurchase
        price={product.price}
        stock={product.stock}
        onAddToCart={handleAddToCart}
      />
      <ProductReviews reviews={product.reviews} />
    </div>
  );
}

// Composants spécialisés et réutilisables
function ProductHeader({ title, rating }) {
  return (
    <header className="product-header">
      <h1>{title}</h1>
      <StarRating rating={rating} />
    </header>
  );
}
```

**DON'T DO** : Éviter les composants monolithiques

```jsx
// ❌ À éviter - Composant qui fait tout
function ProductPage({ product }) {
  return (
    <div className="product-page">
      {/* ❌ Pas de décomposition */}
      <div className="header">
        <h1>{product.name}</h1>
        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < product.rating ? "filled" : ""}>
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="gallery">
        {product.images.map((img) => (
          <img key={img.id} src={img.url} alt={img.alt} />
        ))}
      </div>

      {/* Trop de responsabilités dans un seul composant */}
      <div className="details">
        <p>{product.description}</p>
        <ul>
          {product.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="purchase">
        <span className="price">${product.price}</span>
        <button onClick={handleAddToCart}>
          Add to Cart ({product.stock} left)
        </button>
      </div>

      <div className="reviews">
        {product.reviews.map((review) => (
          <div key={review.id} className="review">
            <h4>{review.author}</h4>
            <p>{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 2. Construire une Arborescence de Composants

**DO** : Organiser la hiérarchie logiquement

```jsx
// ✅ Bon - Hiérarchie claire
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Header />
            <Sidebar>
              <Navigation />
              <UserMenu />
            </Sidebar>
            <MainContent>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<ProductCatalog />} />
                <Route path="/products/:id" element={<ProductDetail />} />
              </Routes>
            </MainContent>
            <Footer />
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Composants enfants bien structurés
function Dashboard() {
  return (
    <div className="dashboard">
      <WelcomeBanner />
      <StatsOverview>
        <StatCard title="Revenue" value="$12,345" />
        <StatCard title="Users" value="1,234" />
        <StatCard title="Orders" value="456" />
      </StatsOverview>
      <RecentActivity />
    </div>
  );
}
```

**DON'T DO** : Éviter les structures plates ou désorganisées

```jsx
// ❌ À éviter - Structure plate et désorganisée
function App() {
  return (
    <div>
      <AuthProvider>
        <Header />
        <Navigation />
        <UserMenu />
        <ThemeProvider>
          <Router>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <div>
                    <WelcomeBanner />
                    <StatCard title="Revenue" value="$12,345" />
                    <StatCard title="Users" value="1,234" />
                    <StatCard title="Orders" value="456" />
                    <RecentActivity />
                  </div>
                }
              />
              {/* ❌ Pas de structure hiérarchique claire */}
            </Routes>
          </Router>
        </ThemeProvider>
        <Footer />
      </AuthProvider>
    </div>
  );
}
```

### 3. Définir l'État Minimal

**DO** : Identifier l'état minimal nécessaire

```jsx
// ✅ Bon - État minimal et dérivé
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  // État dérivé - pas besoin de le stocker
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <div>
      <TodoFilter filter={filter} onFilterChange={setFilter} />
      <TodoItems todos={filteredTodos} onToggle={toggleTodo} />
      <TodoSummary activeCount={activeCount} completedCount={completedCount} />
    </div>
  );
}
```

**DON'T DO** : Éviter la duplication d'état

```jsx
// ❌ À éviter - État dupliqué
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState([]); // ❌ État dupliqué
  const [activeCount, setActiveCount] = useState(0); // ❌ État dupliqué
  const [completedCount, setCompletedCount] = useState(0); // ❌ État dupliqué

  useEffect(() => {
    // ❌ Synchronisation manuelle d'état
    const filtered = todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });
    setFilteredTodos(filtered);

    setActiveCount(todos.filter((todo) => !todo.completed).length);
    setCompletedCount(todos.filter((todo) => todo.completed).length);
  }, [todos, filter]);

  return <div>{/* Logique rendue complexe par la duplication d'état */}</div>;
}
```

### 4. Utiliser des Props pour la Communication

**DO** : Communiquer via les props de manière descendante

```jsx
// ✅ Bon - Communication claire via props
function SearchableProductList({ products }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }, [products, searchTerm, sortBy]);

  return (
    <div>
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <ProductList
        products={filteredProducts}
        onProductSelect={handleProductSelect}
      />
    </div>
  );
}

// Composant enfant avec props claires
function SearchFilters({ searchTerm, onSearchChange, sortBy, onSortChange }) {
  return (
    <div className="filters">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
      />
      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
    </div>
  );
}
```

**DON'T DO** : Éviter les patterns de communication complexes

```jsx
// ❌ À éviter - Communication indirecte ou complexe
function SearchableProductList({ products }) {
  const [filters, setFilters] = useState({});

  // ❌ Communication indirecte via contexte global
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("filtersChanged", {
        detail: filters,
      })
    );
  }, [filters]);

  return (
    <div>
      <SearchFilters onFiltersChange={setFilters} />
      <ProductList products={products} />
    </div>
  );
}

function ProductList({ products }) {
  const [filters, setFilters] = useState({});

  // ❌ Écoute d'événements globaux
  useEffect(() => {
    const handleFiltersChange = (event) => {
      setFilters(event.detail);
    };

    window.addEventListener("filtersChanged", handleFiltersChange);
    return () =>
      window.removeEventListener("filtersChanged", handleFiltersChange);
  }, []);

  const filteredProducts = products.filter(/* ... */);

  return (
    <div>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 5. Gérer l'État au Niveau Approprié

**DO** : Placer l'état au bon niveau

```jsx
// ✅ Bon - État au niveau approprié
function ShoppingApp() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  // État global de l'application
  const addToCart = useCallback((product) => {
    setCart((prevCart) => [...prevCart, product]);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Header />
        <ProductCatalog />
        <ShoppingCart />
      </UserContext.Provider>
    </CartContext.Provider>
  );
}

// État local pour l'UI
function ProductCard({ product }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToCart } = useCart();

  return (
    <div className={`product-card ${isExpanded ? "expanded" : ""}`}>
      <h3>{product.name}</h3>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "Show Less" : "Show More"}
      </button>
      {isExpanded && <p>{product.description}</p>}
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}
```

**DON'T DO** : Éviter le mauvais placement de l'état

```jsx
// ❌ À éviter - État mal placé
function ProductCard({ product }) {
  const [cart, setCart] = useState([]); // ❌ État global dans composant local

  const addToCart = (productToAdd) => {
    setCart((prev) => [...prev, productToAdd]);
    // ❌ Chaque ProductCard a son propre panier
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}

// ❌ État descendant trop profond
function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <MainContent searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Sidebar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Footer searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      {/* ❌ Props drilling */}
    </div>
  );
}
```

### 6. Rendre l'Interface Utilisateur

**DO** : Rendre l'UI de manière déclarative

```jsx
// ✅ Bon - Rendu déclaratif basé sur l'état
function UserDashboard({ user, isLoading, error }) {
  // Rendu basé sur l'état actuel
  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <WelcomeScreen onLogin={handleLogin} />;
  }

  // Rendu normal basé sur les données
  return (
    <div className="dashboard">
      <UserHeader user={user} />
      <DashboardStats stats={user.stats} />
      <RecentActivity activities={user.recentActivities} />
      <QuickActions onAction={handleQuickAction} />
    </div>
  );
}

// Composant conditionnel élégant
function NotificationBell({ notifications }) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notification-bell">
      <BellIcon />
      {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <NotificationList notifications={notifications} />
      )}
    </div>
  );
}
```

**_DON'T DO_** : Éviter le rendu impératif

```jsx
// ❌ À éviter - Rendu impératif
function UserDashboard({ user, isLoading, error }) {
  const [content, setContent] = useState(null);

  // ❌ Logique impérative pour déterminer le rendu
  useEffect(() => {
    if (error) {
      setContent(<ErrorMessage error={error} />);
    } else if (isLoading) {
      setContent(<LoadingSpinner />);
    } else if (!user) {
      setContent(<WelcomeScreen onLogin={handleLogin} />);
    } else {
      setContent(
        <div className="dashboard">
          <UserHeader user={user} />
          {/* ... */}
        </div>
      );
    }
  }, [user, isLoading, error]);

  return content;
}

// ❌ Manipulation DOM directe
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
    // ❌ Manipulation DOM directe
    document.getElementById('counter-display').textContent = count + 1;
  };

  return (
    <div>
      <span id="counter-display">{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
### 7. Mettre à Jour l'État de Manière Immuable
```

**DO** : Mettre à jour l'état immuablement

```jsx
// ✅ Bon - Mises à jour immuables
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState({ name: "", preferences: {} });

  const addTodo = useCallback((text) => {
    setTodos((prevTodos) => [
      ...prevTodos,
      { id: Date.now(), text, completed: false },
    ]);
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const updateUserPreference = useCallback((key, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        [key]: value,
      },
    }));
  }, []);

  const removeTodo = useCallback((id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  return (
    <div>
      <TodoList todos={todos} onToggle={toggleTodo} onRemove={removeTodo} />
      <AddTodo onAdd={addTodo} />
    </div>
  );
}
```

**_DON'T DO_** : Éviter les mutations directes

```jsx
// ❌ À éviter - Mutations directes
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState({ name: "", preferences: {} });

  const addTodo = (text) => {
    // ❌ Mutation directe
    const newTodo = { id: Date.now(), text, completed: false };
    todos.push(newTodo); // ❌ Ne pas muter l'état existant
    setTodos(todos);
  };

  const toggleTodo = (id) => {
    // ❌ Mutation directe
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed; // ❌ Mutation directe
      setTodos(todos);
    }
  };

  const updateUserPreference = (key, value) => {
    // ❌ Mutation directe d'objet imbriqué
    user.preferences[key] = value; // ❌ Mutation directe
    setUser(user);
  };

  return <div>{/* Composants... */}</div>;
}
```

### 8. Optimiser les Performances

**DO** : Optimiser intelligemment

```jsx
// ✅ Bon - Optimisations appropriées
const ExpensiveChart = React.memo(function ExpensiveChart({
  data,
  onPointClick,
}) {
  // Mémoïsation des calculs coûteux
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      normalizedValue: (item.value - item.min) / (item.max - item.min),
      trend: calculateTrend(item.history),
    }));
  }, [data]);

  // Callback stable
  const handlePointClick = useCallback(
    (pointId) => {
      onPointClick(pointId);
    },
    [onPointClick]
  );

  // Composant mémoïsé pour éviter les rendus inutiles
  const ChartTooltip = React.memo(function ChartTooltip({ point }) {
    return (
      <div className="tooltip">
        <strong>{point.label}</strong>
        <span>Value: {point.value}</span>
        <span>Trend: {point.trend}</span>
      </div>
    );
  });

  return (
    <div className="chart">
      {processedData.map((point) => (
        <ChartPoint
          key={point.id}
          point={point}
          onClick={handlePointClick}
          tooltip={<ChartTooltip point={point} />}
        />
      ))}
    </div>
  );
});

// Hook d'optimisation personnalisé
function useOptimizedFilter(data, filterFn) {
  return useMemo(() => {
    return data.filter(filterFn);
  }, [data, filterFn]);
}
```

**_DON'T DO_** : Éviter les optimisations prématurées ou incorrectes

```jsx
// ❌ À éviter - Optimisations inutiles
const SimpleButton = React.memo(function SimpleButton({ onClick, children }) {
  // ❌ React.memo inutile pour un composant simple
  return <button onClick={onClick}>{children}</button>;
});

function UserList({ users }) {
  // ❌ useMemo pour un calcul trivial
  const userCount = useMemo(() => users.length, [users]);

  // ❌ useCallback pour une fonction simple
  const handleClick = useCallback(() => {
    console.log("Clicked");
  }, []);

  // ❌ Optimisation prématurée
  const processedUsers = useMemo(() => {
    return users.map((user) => ({ ...user }));
  }, [users]); // ❌ Copie superficielle inutile

  return (
    <div>
      <p>Total: {userCount}</p>
      <SimpleButton onClick={handleClick}>Click me</SimpleButton>
    </div>
  );
}

// ❌ Mauvaise dépendance de useMemo
function BadComponent({ data, transformFn }) {
  const transformedData = useMemo(() => {
    return transformFn(data);
  }, [data]); // ❌ transformFn manquant dans les dépendances

  return <div>{transformedData}</div>;
}
```

### 9. Gérer les Effets Secondaires

**DO** : Gérer les effets secondaires correctement

```jsx
function DataFetcher({ resourceUrl, onDataLoaded }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(resourceUrl);
        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();

        if (!cancelled) {
          setData(result);
          onDataLoaded?.(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true; // Nettoyage pour éviter les fuites
    };
  }, [resourceUrl, onDataLoaded]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <div>No data available</div>;

  return <DataDisplay data={data} />;
}

// Effet pour les abonnements
function LiveUpdates({ channel }) {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const subscription = subscribeToChannel(channel, (update) => {
      setUpdates((prev) => [...prev, update]);
    });

    return () => {
      subscription.unsubscribe(); // Nettoyage important
    };
  }, [channel]);

  return (
    <div>
      {updates.map((update) => (
        <UpdateItem key={update.id} update={update} />
      ))}
    </div>
  );
}
```

**_DON'T DO_** : Éviter les mauvaises pratiques avec useEffect

```jsx
// ❌ À éviter - Mauvais usage de useEffect
function DataFetcher({ resourceUrl }) {
  const [data, setData] = useState(null);

  // ❌ Effet sans tableau de dépendances
  useEffect(() => {
    fetch(resourceUrl)
      .then((response) => response.json())
      .then(setData);
  }); // ❌ S'exécute à chaque rendu

  // ❌ Effet qui devrait être un événement
  useEffect(() => {
    const handleClick = () => {
      console.log("Document clicked");
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []); // ❌ Écouteur d'événements global

  // ❌ Effets en cascade
  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (!loading) {
      processData(data);
    }
  }, [loading, data]);

  return <div>{/* ... */}</div>;
}

// ❌ Pas de nettoyage
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // ❌ Pas de nettoyage
    setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
  }, []);

  return <div>Count: {count}</div>;
}
```

### 10. Tester les Composants

**DO** : Écrire des tests significatifs

```jsx
// ✅ Bon - Tests complets et significatifs
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfile } from "./UserProfile";

describe("UserProfile", () => {
  const mockUser = {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com",
    avatar: "avatar.jpg",
  };

  const mockOnSave = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders user information correctly", () => {
    render(
      <UserProfile
        user={mockUser}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByAltText("User avatar")).toHaveAttribute(
      "src",
      "avatar.jpg"
    );
  });

  test("calls onSave with updated data when form is submitted", async () => {
    const user = userEvent.setup();
    render(<UserProfile user={mockUser} onSave={mockOnSave} />);

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "John Smith");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockUser,
      name: "John Smith",
    });
  });

  test("shows confirmation dialog before deletion", async () => {
    render(<UserProfile user={mockUser} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockUser.id);
  });

  test("handles loading state", () => {
    render(<UserProfile user={null} isLoading={true} />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
  });

  test("displays error message when provided", () => {
    const error = new Error("Failed to load user");
    render(<UserProfile user={null} error={error} />);

    expect(screen.getByText(/failed to load user/i)).toBeInTheDocument();
  });
});

// Tests de hooks personnalisés
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  test("should increment counter", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

**_DON'T DO_** : Éviter les tests fragiles ou non significatifs

```jsx
// ❌ À éviter - Tests fragiles
describe("UserProfile", () => {
  test("renders correctly", () => {
    const wrapper = shallow(<UserProfile user={mockUser} />);

    // ❌ Tests de détails d'implémentation
    expect(wrapper.find("div.user-profile").length).toBe(1);
    expect(wrapper.find('input[name="name"]').prop("value")).toBe("Jane Doe");
    expect(wrapper.state("isEditing")).toBe(false);

    // ❌ Tests de méthodes internes
    wrapper.instance().handleEdit();
    expect(wrapper.state("isEditing")).toBe(true);
  });

  // ❌ Test trop générique
  test("does not crash", () => {
    render(<UserProfile user={mockUser} />);
  });

  // ❌ Tests avec sélecteurs fragiles
  test("updates user name", () => {
    render(<UserProfile user={mockUser} />);

    const nameInput = document.querySelector(".user-profile > div > input");
    fireEvent.change(nameInput, { target: { value: "John" } });

    expect(nameInput.value).toBe("John");
  });
});

// ❌ Tests asynchrones mal gérés
test("fetches user data", () => {
  render(<UserProfile userId={1} />);

  // ❌ Pas d'attente pour l'opération asynchrone
  expect(screen.getByText("Jane Doe")).toBeInTheDocument();
});

// ❌ Tests qui ne testent rien d'utile
test("component exists", () => {
  const { container } = render(<UserProfile user={mockUser} />);
  expect(container).toBeDefined();
});
```
