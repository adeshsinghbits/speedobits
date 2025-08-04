import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { RxCrossCircled, RxCheckCircled, RxHamburgerMenu } from "react-icons/rx";
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
  useTheme,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
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
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../firebase/config';
import { ref, push } from 'firebase/database';

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
  background: 'transparent',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '12px',
  border: '2px solid #8b5cf6',
  padding: '8px 16px',
  textTransform: 'none',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
    background: '#8b5cf6'
  },
  '&:disabled': {
    background: '#94a3b8',
    transform: 'none',
    boxShadow: 'none',
    cursor: 'not-allowed',
  }
};

function EditorPage({demoMode = false}) {
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(14);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [snippetTitle, setSnippetTitle] = useState('');
  const [user] = useAuthState(auth);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuOpen = Boolean(anchorEl);

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
  }, [user]);

  const handleRunCode = async () => {

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
  } catch (error) {
    setOutput(`Error: ${error.response?.data?.message || error.message}`);
    setStatus('error');
  } finally {
    setLoading(false);
  }
};

  const handleSave = async () => {
    if (demoMode) {
    setSnackbar({
      open: true,
      message: 'Saving is disabled in demo mode',
      severity: 'warning'
    });
    return;
  }
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please sign in to save snippets',
        severity: 'warning'
      });
      return;
    }
    
    const snippetData = {
      title: `snippet of ${language} on ${new Date().toLocaleString()}`,
      code,
      language,
      timestamp: Date.now(),
    };

    try {
      await push(ref(database, `userSnippets/${user.uid}`), snippetData);
      setSnackbar({
        open: true,
        message: 'Snippet saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error("Error saving snippet:", error);
      setSnackbar({
        open: true,
        message: 'Failed to save snippet',
        severity: 'error'
      });
    }
  };

  const handleShare = async () => {
    if (demoMode) {
    setSnackbar({
      open: true,
      message: 'Sharing is disabled in demo mode',
      severity: 'warning'
    });
    return;
  }
    if (!snippetTitle.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a title for your snippet',
        severity: 'warning'
      });
      return;
    }

    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please sign in to share snippets',
        severity: 'warning'
      });
      return;
    }

    const selectedLang = LANGUAGES.find(lang => lang.id === language);

    const snippetData = {
      title: snippetTitle.trim(),
      code: code.trim(),
      language,
      languageName: selectedLang?.name || language,
      stars: {}, 
      author: user?.displayName || 'Anonymous',
      avatar: user?.photoURL || '',
      userId: user?.uid || '',
      timestamp: Date.now(),
    };

    try {
      await push(ref(database, 'sharedSnippets'), snippetData);
      setShareDialogOpen(false);
      setSnippetTitle('');
      setSnackbar({
        open: true,
        message: 'Snippet shared successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error("Error sharing snippet:", error);
      setSnackbar({
        open: true,
        message: 'Failed to share snippet',
        severity: 'error'
      });
    }
  };

  const handleLanguageChange = (e) => {
    if (demoMode) {
      setSnackbar({
        open: true,
        message: 'Language change is disabled in demo mode',
        severity: 'warning'
      });
      return;
    }
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

  const currentLanguage = LANGUAGES.find(lang => lang.id === language);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      backgroundColor: '#0f172a',
      overflow: 'hidden'
    }}>
      <AppBar position="static" sx={{ 
        background: 'linear-gradient(45deg, #1e293b, #0f172a)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          gap: 2
        }}>
          {/* Language Selector - Always Visible */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
                      <Typography variant="body2" sx={{...buttonStyle, color: '#f0f0f0','&:hover': { color: '#8b5cf6' }}}>
                        Language :
                      </Typography>
                    )}
            <Select
              value={language}
              onChange={handleLanguageChange}
              variant="outlined"
              size="small"
              sx={{
                minWidth: 160,
                background: '#1e293b',
                borderRadius: 3,
                color: '#f0f0f0',
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
                    color: '#f0f0f0',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
                  }
                }
              }}
              renderValue={(selected) => {
                const selectedLang = LANGUAGES.find(lang => lang.id === selected);
                const Icon = selectedLang?.Icon;
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ 
                      bgcolor: '#0f172a', 
                      color: selectedLang?.color, 
                      width: 24, 
                      height: 24 
                    }}>
                      <Icon style={{ fontSize: 14 }} />
                    </Avatar>
                      <Typography variant="body1" sx={{ color: '#f0f0f0' }}>
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
                      gap: 1,
                      '&:hover': {
                        background: `rgba(${parseInt(lang.color.slice(1, 3), 16)}, ${parseInt(lang.color.slice(3, 5), 16)}, ${parseInt(lang.color.slice(5, 7), 16)}, 0.1)`
                      }
                    }}
                  >
                    <Avatar sx={{ 
                      bgcolor: '#0f172a', 
                      color: lang.color, 
                      width: 24, 
                      height: 24 
                    }}>
                      <Icon style={{ fontSize: 14 }} />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: '#f0f0f0' }}>
                      {lang.name}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
            <Button 
            onClick={handleRunCode} 
            disabled={loading} 
            variant="contained" 
            sx={{ 
              ...buttonStyle, 
              minWidth: isMobile ? '80px' : 'auto'
            }}
          >
            {loading ? 'Running...' : 'Run'}
          </Button>
          </Box>
          {/* Hamburger Menu on Mobile */}
          {isMobile ? (
            <>
              <IconButton
                onClick={handleMenuOpen}
                sx={{ color: '#f0f0f0' }}
              >
                <RxHamburgerMenu />
              </IconButton>
              <Popover
                open={menuOpen}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{
                  '& .MuiPaper-root': {
                    backgroundColor: '#1e293b',
                    color: '#f0f0f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                <List>
                  <ListItem button onClick={handleResetCode}>
                    <ListItemText primary="Reset Code" />
                  </ListItem>
                  <ListItem disabled={demoMode} button onClick={handleSave}>
                    <ListItemText primary="Save" />
                  </ListItem>
                  <ListItem disabled={demoMode} button onClick={() => {
                    setShareDialogOpen(true);
                    handleMenuClose();
                  }}>
                    <ListItemText primary="Share" />
                  </ListItem>
                  {!isMobile && (
                    <ListItem>
                      <ListItemText primary="Font Size" />
                      <Slider
                        value={fontSize}
                        onChange={(e, value) => setFontSize(value)}
                        min={10}
                        max={24}
                        step={1}
                        sx={{ 
                          color: '#8b5cf6',
                          width: 100,
                          '& .MuiSlider-thumb': {
                            width: 12,
                            height: 12
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#f0f0f0', ml: 1 }}>
                        {fontSize}px
                      </Typography>
                    </ListItem>
                  )}
                </List>
              </Popover>
            </>
          ) : (
            /* Desktop Controls */
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                <Typography variant="body2" sx={{ color: '#f0f0f0' }}>
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
                    width: 90,
                    '& .MuiSlider-thumb': {
                      width: 12,
                      height: 12
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: '#f0f0f0' }}>
                  {fontSize}px
                </Typography>
              </Box>
              
              <Button 
                onClick={handleResetCode}
                variant="contained" 
                sx={buttonStyle}
              >
                Reset
              </Button>
              <Button 
                onClick={handleSave} 
                variant="contained" 
                sx={buttonStyle}
                disabled={demoMode}
              >
                Save
              </Button>
              <Button 
                onClick={() => setShareDialogOpen(true)} 
                variant="contained" 
                sx={buttonStyle}
                disabled={demoMode}
              >
                Share
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Rest of the component remains the same */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          width: isMobile ? '100%' : '70%', 
          height: isMobile ? '50vh' : '100%', 
          position: 'relative',
          borderBottom: isMobile ? '1px solid #334155' : 'none',
          borderRight: !isMobile ? '1px solid #334155' : 'none'
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
              }
            }}
          />
        </Box>

        <Box sx={{ 
          width: isMobile ? '100%' : '30%', 
          height: isMobile ? '50vh' : '100%',
          display: 'flex', 
          flexDirection: 'column', 
          backgroundColor: '#0f172a',
          borderLeft: !isMobile ? '1px solid #334155' : 'none'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            borderBottom: '1px solid #334155',
            backgroundColor: '#1e293b'
          }}>
            <Typography variant={isMobile ? "subtitle2" : "h6"} sx={{ 
              color: '#f0f0f0', 
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}>
              Output
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {status === 'success' && (
                <Chip 
                  icon={<RxCheckCircled />} 
                  label="Success" 
                  size="small" 
                  sx={{ 
                    background: 'rgba(16, 185, 129, 0.15)', 
                    color: '#10b981',
                    fontWeight: 'bold',
                    fontSize: isMobile ? '0.7rem' : '0.8rem'
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
                    fontWeight: 'bold',
                    fontSize: isMobile ? '0.7rem' : '0.8rem'
                  }} 
                />
              )}
              <IconButton 
                onClick={handleCopyOutput} 
                size="small"
                sx={{ color: '#94a3b8', '&:hover': { color: '#6366f1' } }}
              >
                <ContentCopyIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ 
            flex: 1, 
            p: 1.5, 
            overflow: 'auto',
            backgroundColor: '#0f172a'
          }}>
            <pre style={{
              color: '#e2e8f0',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: "'Fira Code', monospace",
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              lineHeight: 1.5,
              margin: 0
            }}>
              {output || (loading ? 'Running code...' : 'Output will appear here')}
            </pre>
          </Box>
        </Box>
      </Box>

      {/* Share Dialog */}
      <Dialog 
        open={shareDialogOpen} 
        onClose={() => setShareDialogOpen(false)} 
        sx={{ 
          '& .MuiDialog-paper': { 
            backgroundColor: '#1e293b', 
            color: '#f0f0f0', 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            width: isMobile ? '90vw' : '400px',
            maxWidth: '90vw'
          } 
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          fontSize: isMobile ? '1.1rem' : '1.25rem',
          textAlign: 'center',
          py: 2
        }}>
          Share Your Code Snippet
        </DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Snippet Title"
            fullWidth
            value={snippetTitle}
            onChange={(e) => setSnippetTitle(e.target.value)}
            sx={{ 
              mb: 2,
              mt: 1,
              '& .MuiInputBase-input': {
                color: '#e2e8f0',
                fontSize: isMobile ? '0.9rem' : '1rem'
              },
              '& .MuiInputLabel-root': {
                color: '#94a3b8',
                fontSize: isMobile ? '0.9rem' : '1rem'
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#334155'
                },
                '&:hover fieldset': {
                  borderColor: '#6366f1'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8b5cf6'
                }
              }
            }}
          />
          <Typography variant="body2" sx={{ 
            color: '#94a3b8', 
            fontSize: isMobile ? '0.8rem' : '0.9rem'
          }}>
            This will be shared publicly on the community page
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          px: 2, 
          py: 1.5, 
          borderTop: '1px solid #334155',
          justifyContent: 'space-between'
        }}>
          <Button 
            onClick={() => setShareDialogOpen(false)} 
            sx={{
              color: '#94a3b8',
              fontWeight: 'bold',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              '&:hover': {
                color: '#e2e8f0',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleShare}
            variant="contained"
            sx={{
              ...buttonStyle,
              padding: isMobile ? '6px 14px' : '8px 20px',
              fontSize: isMobile ? '0.8rem' : '0.9rem'
            }}
          >
            Share Snippet
          </Button>
        </DialogActions>
      </Dialog>

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
            alignItems: 'center',
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default EditorPage;