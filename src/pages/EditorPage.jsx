import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { RxCrossCircled, RxCheckCircled } from "react-icons/rx";
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Button,
  Slider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  Snackbar,
  Chip,
  useMediaQuery,
  Menu,
  Fade,
  Divider,
  CircularProgress
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiPhp
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://emkc.org/api/v2/piston/execute';

const DEFAULT_CODE = {
  javascript: 'console.log("Hello World!");',
  python: 'print("Hello World!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World!" << std::endl;\n    return 0;\n}',
  php: '<?php\necho "Hello World!";\n?>'
};

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', Icon: SiJavascript, color: '#f0db4f' },
  { id: 'python', name: 'Python', Icon: SiPython, color: '#3572A5' },
  { id: 'java', name: 'Java', Icon: FaJava, color: '#b07219' },
  { id: 'cpp', name: 'C++', Icon: SiCplusplus, color: '#f34b7d' },
  { id: 'php', name: 'PHP', Icon: SiPhp, color: '#4F5D95' }
];

const buttonStyle = {
  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '12px',
  padding: '8px 20px',
  textTransform: 'none',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
    background: 'linear-gradient(45deg, #4f46e5, #7c3aed)'
  },
  '&:disabled': {
    background: '#94a3b8',
    transform: 'none',
    boxShadow: 'none'
  }
};

function DemoEditorPage() {
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(14);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [runUsed, setRunUsed] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const navigate = useNavigate();
  
  const isSmallScreen = useMediaQuery('(max-width:900px)');
  const isMediumScreen = useMediaQuery('(max-width:1200px)');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    const codeParam = params.get('code');

    if (langParam && LANGUAGES.some(lang => lang.id === langParam)) {
      setLanguage(langParam);
    }

    if (codeParam) {
      try {
        const decodedCode = decodeURIComponent(atob(codeParam));
        setCode(decodedCode);
      } catch (e) {
        console.error('Error decoding shared code:', e);
        setSnackbar({
          open: true,
          message: 'Failed to load shared code',
          severity: 'error'
        });
      }
    }
  }, []);

  const handleRunCode = async () => {
    const runUsedlocal = localStorage.getItem('runUsed') === 'true';
    console.log('Run used:', runUsed, 'Local storage run used:', runUsedlocal);
    
    if (runUsed || runUsedlocal) {
      setSnackbar({
        open: true,
        message: 'You can run code only once in demo mode',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    setOutput('');
    setStatus(null);
    try {
      const response = await axios.post(API_URL, {
        language,
        version: '*',
        files: [{ content: code }]
      });

      setOutput(response.data.run.output || 'No output available');
      setStatus(response.data.run.code === 0 ? 'success' : 'error');
      setRunUsed(true);
      localStorage.setItem('runUsed', 'true');
      setShowSignupPrompt(true);
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.message || error.message}`);
      setStatus('error');
      setRunUsed(true);
      localStorage.setItem('runUsed', 'true');
      setShowSignupPrompt(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(DEFAULT_CODE[newLang] || '');
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    setSnackbar({
      open: true,
      message: 'Output copied to clipboard!',
      severity: 'info'
    });
  };

  const handleResetCode = () => {
    setCode(DEFAULT_CODE[language] || '');
    setSnackbar({
      open: true,
      message: 'Editor reset to default code',
      severity: 'info'
    });
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  const currentLanguage = LANGUAGES.find(lang => lang.id === language);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#000000' }}>
      <Box sx={{ 
        backgroundColor: '#6366f1', 
        color: 'white', 
        textAlign: 'center', 
        py: 1.5,
        position: 'sticky',
        top: 0,
        zIndex: 1100
      }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Demo Mode: Run code only once
        </Typography>
      </Box>
      
      <AppBar position="static" sx={{ 
        backgroundColor: '#000000',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          py: isSmallScreen ? 1 : 0,
          gap: isSmallScreen ? 1 : 0
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: isSmallScreen ? 1 : 0 
          }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ 
                mr: 1,
                display: isSmallScreen ? 'inline-flex' : 'none' 
              }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                cursor: 'pointer',
                background: 'linear-gradient(45deg, #8b5cf6, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: isSmallScreen ? '1.2rem' : '1.5rem'
              }}
              onClick={() => navigate('/')}
            >
              CodeShare Demo
            </Typography>
          </Box>

          <Box sx={{ 
            display: isSmallScreen ? 'none' : 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
            my: isSmallScreen ? 1 : 0
          }}>
            <Select
              value={language}
              onChange={handleLanguageChange}
              variant="outlined"
              size="small"
              sx={{
                minWidth: 160,
                background: '#1e293b',
                borderRadius: 3,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&:hover': {
                  boxShadow: `0 0 10px ${currentLanguage?.color || '#6366f1'}`
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: 2,
                    background: '#1e293b',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
                  }
                }
              }}
              renderValue={(selected) => {
                const selectedLang = LANGUAGES.find(lang => lang.id === selected);
                const Icon = selectedLang?.Icon;
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ 
                      bgcolor: '#0f172a', 
                      color: selectedLang?.color, 
                      width: 28, 
                      height: 28 
                    }}>
                      <Icon style={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: '#f0f0f0' }}>
                      {selectedLang?.name}
                    </Typography>
                  </Box>
                );
              }}
            >
              {LANGUAGES.map((lang) => {
                const Icon = lang.Icon;
                return (
                  <MenuItem
                    key={lang.id}
                    value={lang.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      '&:hover': {
                        background: `rgba(${parseInt(lang.color.slice(1, 3), 16)}, ${parseInt(lang.color.slice(3, 5), 16)}, ${parseInt(lang.color.slice(5, 7), 16)}, 0.1)`
                      }
                    }}
                  >
                    <Avatar sx={{ 
                      bgcolor: '#0f172a', 
                      color: lang.color, 
                      width: 28, 
                      height: 28 
                    }}>
                      <Icon style={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="body1" sx={{ color: '#f0f0f0' }}>
                      {lang.name}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>

            <Box sx={{ 
              width: 150, 
              display: 'flex', 
              alignItems: 'center',
              minWidth: 120
            }}>
              <Typography variant="body2" sx={{ 
                color: '#f0f0f0', 
                mr: 1,
                display: isMediumScreen ? 'none' : 'block'
              }}>
                Font:
              </Typography>
              <Slider
                value={fontSize}
                onChange={(e, value) => setFontSize(value)}
                min={10}
                max={24}
                step={1}
                sx={{ 
                  color: '#8b5cf6',
                  width: isMediumScreen ? 80 : 100,
                  '& .MuiSlider-thumb': {
                    width: 14,
                    height: 14
                  }
                }}
              />
              <Typography variant="body2" sx={{ 
                color: '#f0f0f0', 
                ml: 1,
                minWidth: 30
              }}>
                {fontSize}px
              </Typography>
            </Box>

            <Button 
              onClick={handleResetCode}
              variant="contained" 
              sx={{
                ...buttonStyle,
                display: isMediumScreen ? 'none' : 'inline-flex'
              }}
            >
              Reset
            </Button>

            <Button 
              onClick={handleRunCode} 
              disabled={loading || runUsed} 
              variant="contained" 
              sx={buttonStyle}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Run'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        TransitionComponent={Fade}
        sx={{ 
          mt: 6,
          '& .MuiPaper-root': {
            background: '#000000',
            borderRadius: '12px',
            minWidth: 200
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ 
            color: '#e2e8f0', 
            fontWeight: 'bold',
            mb: 1
          }}>
            Language
          </Typography>
          <Select
            value={language}
            onChange={handleLanguageChange}
            fullWidth
            size="small"
            sx={{
              background: '#0f172a',
              borderRadius: 3,
              mb: 2,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
            renderValue={(selected) => {
              const selectedLang = LANGUAGES.find(lang => lang.id === selected);
              return (
                <Typography variant="body2" sx={{ color: '#f0f0f0' }}>
                  {selectedLang?.name}
                </Typography>
              );
            }}
          >
            {LANGUAGES.map((lang) => {
              const Icon = lang.Icon;
              return (
                <MenuItem
                  key={lang.id}
                  value={lang.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    '&:hover': {
                      background: `rgba(${parseInt(lang.color.slice(1, 3), 16)}, ${parseInt(lang.color.slice(3, 5), 16)}, ${parseInt(lang.color.slice(5, 7), 16)}, 0.1)`
                    }
                  }}
                >
                  <Avatar sx={{ 
                    bgcolor: '#0f172a', 
                    color: lang.color, 
                    width: 28, 
                    height: 28 
                  }}>
                    <Icon style={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="body1" sx={{ color: '#f0f0f0' }}>
                    {lang.name}
                  </Typography>
                </MenuItem>
              );
            })}
          </Select>

          <Typography variant="subtitle1" sx={{ 
            color: '#e2e8f0', 
            fontWeight: 'bold',
            mb: 1
          }}>
            Font Size: {fontSize}px
          </Typography>
          <Slider
            value={fontSize}
            onChange={(e, value) => setFontSize(value)}
            min={10}
            max={24}
            step={1}
            sx={{ 
              color: '#8b5cf6',
              width: '100%',
              mb: 2,
              '& .MuiSlider-thumb': {
                width: 14,
                height: 14
              }
            }}
          />

          <Divider sx={{ my: 1, bgcolor: '#334155' }} />

          <Button 
            fullWidth
            onClick={handleResetCode}
            variant="contained" 
            sx={{
              ...buttonStyle,
              mb: 1
            }}
          >
            Reset Code
          </Button>
        </Box>
      </Menu>

      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        overflow: 'hidden',
        flexDirection: isSmallScreen ? 'column' : 'row'
      }}>
        <Box sx={{ 
          width: isSmallScreen ? '100%' : (isMediumScreen ? '60%' : '70%'),
          height: isSmallScreen ? '50vh' : 'auto',
          borderRight: isSmallScreen ? 'none' : '1px solid #334155',
          borderBottom: isSmallScreen ? '1px solid #334155' : 'none',
          position: 'relative'
        }}>
          <Box sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 10,
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: 4,
            px: 1.5,
            py: 0.5
          }}>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              {language.toUpperCase()}
            </Typography>
          </Box>
          <Editor
            height="100%"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value || '')}
            options={{
              fontSize,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 30, bottom: 16 },
              fontFamily: "'Fira Code', monospace",
              fontLigatures: true,
              lineNumbers: 'on',
              glyphMargin: true,
              contextmenu: true,
              cursorBlinking: 'smooth',
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto'
              },
              readOnly: runUsed
            }}
          />
        </Box>

        <Box sx={{ 
          width: isSmallScreen ? '100%' : (isMediumScreen ? '40%' : '30%'),
          height: isSmallScreen ? '50vh' : 'auto',
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: '#0f172a',
          borderLeft: isSmallScreen ? 'none' : '1px solid #334155'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid #334155',
            backgroundColor: '#000000',
          }}>
            <Typography variant="h6" sx={{ color: '#f0f0f0', fontWeight: 'bold' }}>
              Output
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {status === 'success' && (
                <Chip 
                  icon={<RxCheckCircled />} 
                  label="Success" 
                  size="small" 
                  sx={{ 
                    background: '000000', 
                    color: '#10b981',
                    fontWeight: 'bold'
                  }} 
                />
              )}
              {status === 'error' && (
                <Chip 
                  icon={<RxCrossCircled />} 
                  label="Error" 
                  size="small" 
                  sx={{ 
                    background: 'rgba(239, 68, 68, 0.15)', 
                    color: '#ef4444',
                    fontWeight: 'bold'
                  }} 
                />
              )}
              <IconButton 
                onClick={handleCopyOutput} 
                size="small"
                sx={{ color: '#94a3b8', '&:hover': { color: '#6366f1' } }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ 
            flex: 1, 
            p: 2, 
            overflow: 'auto',
            backgroundColor: '#000000',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <pre style={{
              color: '#e2e8f0',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: "'Fira Code', monospace",
              fontSize: '0.9rem',
              lineHeight: 1.5,
              flexGrow: 1
            }}>
              {output || (loading ? 'Running code...' : 'Output will appear here')}
            </pre>
            
            {showSignupPrompt && (
              <Box sx={{
                mt: 3,
                p: 3,
                borderRadius: '8px',
                background: 'linear-gradient(to right, #1e3c72, #2a5298)',
                textAlign: 'center'
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  Demo Run Complete!
                </Typography>
                <Typography variant="body2" sx={{ color: '#e0e7ff', mb: 2 }}>
                  You've used your one-time demo execution. Sign up for full access to run code anytime!
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleSignupRedirect}
                  sx={{
                    background: 'linear-gradient(45deg, #4ade80, #22c55e)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    px: 4,
                    py: 1,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Get Started Now
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Floating action buttons for mobile */}
      {isSmallScreen && (
        <Box sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          display: 'flex',
          gap: 1,
          zIndex: 1000
        }}>
          <Button 
            variant="contained"
            onClick={handleRunCode}
            disabled={loading || runUsed}
            sx={{
              ...buttonStyle,
              minWidth: 'auto',
              padding: '10px 16px',
              borderRadius: '50%',
              width: 56,
              height: 56
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Run'}
          </Button>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            borderRadius: '12px',
            fontWeight: 'bold',
            alignItems: 'center'
          }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default DemoEditorPage;