import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';

const navItems = [
  { label: 'Editor', path: '/editor' },
  { label: 'Snippets', path: '/snippets' },
];

const gradientButtonStyles = {
  width: '100%',
  background: 'linear-gradient(45deg, #8e2de2, #4a00e0)',
  fontWeight: 600,
  borderRadius: 2,
  py: 1,
  '&:hover': {
    boxShadow: '0 4px 12px rgba(138, 43, 226, 0.4)',
  },
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user] = useAuthState(auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box
      sx={{
        width: 250,
        p: 2,
        background: 'linear-gradient(135deg, #0f0c29, #302b63)',
        height: '100%',
        color: 'white',
      }}
      role="presentation"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #8e2de2, #4a00e0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Speedobits
        </Typography>
        <IconButton color="inherit" onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: 1,
              mb: 1,
              '&.Mui-selected': {
                background: 'linear-gradient(45deg, #8e2de2, #4a00e0)',
                color: 'white',
              },
              '&:hover': {
                backgroundColor: 'rgba(142, 45, 226, 0.2)',
              },
            }}
          >
            <ListItemText primary={item.label} sx={{ fontWeight: 500 }} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        {user ? (
          <Button
            component={Link}
            to="/profile"
            startIcon={<Avatar src={user.photoURL || ''} sx={{ width: 24, height: 24 }} />}
            sx={gradientButtonStyles}
          >
            {user.displayName || user.email || 'Profile'}
          </Button>
        ) : (
          <Button component={Link} to="/get-started" sx={gradientButtonStyles}>
            Get Started
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: 'rgba(15, 12, 41, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}
        elevation={0}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #8e2de2, #4a00e0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Speedobits
          </Typography>

          {isMobile ? (
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              aria-label="menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    backgroundColor:
                      location.pathname === item.path
                        ? 'rgba(142, 45, 226, 0.2)'
                        : 'transparent',
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    '&:hover': {
                      backgroundColor: 'rgba(142, 45, 226, 0.1)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              {user ? (
                <Button
                  component={Link}
                  to="/profile"
                  startIcon={<Avatar src={user.photoURL || ''} sx={{ width: 24, height: 24 }} />}
                  sx={{
                    ...gradientButtonStyles,
                    width: 'auto',
                    ml: 2,
                    px: 3,
                  }}
                >
                  {user.displayName || 'Profile'}
                </Button>
              ) : (
                <Button
                  component={Link}
                  to="/get-started"
                  sx={{
                    ...gradientButtonStyles,
                    width: 'auto',
                    ml: 2,
                    px: 3,
                  }}
                >
                  Get Started
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'transparent',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
