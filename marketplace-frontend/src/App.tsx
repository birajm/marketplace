import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ProductListPage } from './pages/ProductListPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { Button } from './components/Button';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex min-h-screen flex-col">
          <header className="bg-background sticky top-0 z-50 w-full border-b">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link to="/" className="text-lg font-semibold">
                Marketplace
              </Link>
              <nav className="flex items-center space-x-4">
                <Link to="/cart">
                  <Button variant="outline">Cart</Button>
                </Link>
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<ProductListPage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          <footer className="bg-muted py-6">
            <div className="container px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
              © {new Date().getFullYear()} Marketplace Inc. All rights reserved.
            </div>
          </footer>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
