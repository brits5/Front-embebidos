import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';

// Importar componentes (por ahora versiones simples)
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import UserList from './components/Users/UserList';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;