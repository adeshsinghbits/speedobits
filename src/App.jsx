import React from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import EditorPage from './pages/EditorPage';
import AuthPage from './pages/AuthPage';
import SnippetsPage from './pages/SnippetsPage';
import { auth } from './firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProfilePage from './pages/ProfilePage';
import SnippetDetailPage from './pages/SnippetDetailPage';

const theme = createTheme();

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/get-started" replace />;
  }

  return children;
};

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout user={user} />}>
            <Route index element={<LandingPage />} />
            <Route path="/get-started" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route path="/editor" element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            } />
            <Route path="/snippets" element={
              <ProtectedRoute>
                <SnippetsPage />
              </ProtectedRoute>
            } />
            <Route path="/snippets/:id" element={
              <ProtectedRoute>
                <SnippetDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;