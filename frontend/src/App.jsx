import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClientProvider } from './context/ClientContext';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import FormPage from './pages/FormPage';
import TablePage from './pages/TablePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [showRegister, setShowRegister] = useState(false);

  if (!token) {
    return showRegister
      ? <RegisterPage onBackToLogin={() => setShowRegister(false)} />
      : <LoginPage setToken={setToken} onRegister={() => setShowRegister(true)} />;
  }

  return (
    <BrowserRouter>
      <ClientProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/table" element={<TablePage />} />
          </Route>
        </Routes>
      </ClientProvider>
    </BrowserRouter>
  );
}
