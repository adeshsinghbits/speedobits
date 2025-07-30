// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  CircularProgress, 
  Grid,
  Divider,
  Fade,
  Paper,
  IconButton
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AuthPage = () => {
  const [user, loading] = useAuthState(auth);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/editor');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await import('../firebase/auth').then(module => {
        return module.signInWithGoogle();
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
      }}>
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      py: 8,
    }}>
      {/* Decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(142,45,226,0.3) 0%, rgba(74,0,224,0) 70%)',
        transform: 'translate(50%, -50%)',
        zIndex: 1
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(142,45,226,0.2) 0%, rgba(74,0,224,0) 70%)',
        transform: 'translate(-50%, 50%)',
        zIndex: 1
      }} />
      
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Fade in={true} timeout={800}>
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            
            
            <Grid item xs={12} md={6}>
              <div>
                <Paper sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 4,
                  p: 4,
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Decorative corner */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(45deg, rgba(142,45,226,0.2) 0%, rgba(74,0,224,0) 70%)',
                    clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                  }} />
                  
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography variant="h4" component="h3" sx={{ 
                      mb: 3, 
                      fontWeight: 700,
                      textAlign: 'center',
                      background: 'linear-gradient(45deg, #8e2de2, #4a00e0)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      Sign In
                    </Typography>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={isSigningIn ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <GoogleIcon />}
                      onClick={handleGoogleSignIn}
                      disabled={isSigningIn}
                      sx={{
                        py: 1.8,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #8e2de2, #4a00e0)',
                        boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #7a1fc1, #3a00c0)',
                          boxShadow: '0 6px 20px rgba(138, 43, 226, 0.5)',
                        },
                      }}
                    >
                      {isSigningIn ? 'Signing In...' : 'Sign in with Google'}
                    </Button>
                    
                    <Divider sx={{ my: 4, color: 'rgba(255, 255, 255, 0.3)', position: 'relative' }}>
                      <Box sx={{ px: 2, backgroundColor: 'rgba(15, 12, 41, 0.8)', zIndex: 2 }}>or</Box>
                    </Divider>
                    
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Continue without account
                      </Typography>
                      <Button 
                        variant="text" 
                        color="inherit"
                        onClick={() => navigate('/')}
                        sx={{ mt: 1, fontWeight: 500 }}
                      >
                        Explore Features
                      </Button>
                    </Box>
                    
                    <Box sx={{ 
                      backgroundColor: 'rgba(142, 45, 226, 0.1)',
                      borderRadius: 2,
                      p: 2,
                      mt: 4,
                      border: '1px solid rgba(142, 45, 226, 0.3)',
                    }}>
                      <Typography variant="body2" sx={{ textAlign: 'center' }}>
                        By signing in, you agree to our Terms of Service and Privacy Policy
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </div>
            </Grid>
          </Grid>
        </Fade>
      </Container>
      
      {/* Back button */}
      <IconButton 
        sx={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(5px)',
          '&:hover': {
            backgroundColor: 'rgba(142, 45, 226, 0.2)',
          }
        }}
        onClick={() => navigate('/')}
      >
        <ArrowBackIcon sx={{ color: 'white' }} />
      </IconButton>
    </Box>
  );
};

export default AuthPage;