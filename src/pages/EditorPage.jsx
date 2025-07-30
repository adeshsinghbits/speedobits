import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { RxCrossCircled } from "react-icons/rx";
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
  Snackbar
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
  { id: 'javascript', name: 'JavaScript', Icon: SiJavascript, color: 'yellow' },
  { id: 'python', name: 'Python', Icon: SiPython, color: 'blue' },
  { id: 'java', name: 'Java', Icon: FaJava, color: 'red' },
  { id: 'cpp', name: 'C++', Icon: SiCplusplus, color: 'blue' },
  { id: 'php', name: 'PHP', Icon: SiPhp, color: 'purple' }
];

function EditorPage() {
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(14);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

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
      }
    }
    
  }, [user]);

  const handleRunCode = async () => {
    setLoading(true);
    setOutput('');
    try {
      const response = await axios.post(API_URL, {
        language,
        version: '*',
        files: [{ content: code }]
      });

      setOutput(response.data.run.output || 'No output');
      setStatus(response.data.run.code);
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
  if (!user) return;
  
  const snippetData = {
    title: `snippet of ${language} on ${new Date().toLocaleString()}`,
    code,
    language,
    timestamp: Date.now(),
  };

  try {
    // Save to user's personal snippets
    await push(ref(database, `userSnippets/${user.uid}`), snippetData);
    setSnackbarOpen(true);
  } catch (error) {
    console.error("Error saving snippet:", error);
    setOutput(`Error saving: ${error.message}`);
  }
};

  const handleShare = async () => {
    if (!snippetTitle.trim()) {
      alert("Please enter a title for your snippet");
      return;
    }

    const selectedLang = LANGUAGES.find(lang => lang.id === language);

    if (!selectedLang) {
      alert("Invalid language selected");
      return;
    }

    const snippetData = {
      title: snippetTitle.trim(),
      code: code.trim(),
      language,
      languageName: selectedLang.name,
      stars: {}, 
      author: user?.displayName || 'Anonymous',
      avatar: user?.photoURL || '',
      userId: user?.uid || '',
      timestamp: Date.now(),
    };

    try {
      await push(ref(database, 'sharedSnippets'), snippetData);
      setShareDialogOpen(false);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error sharing snippet:", error);
      setOutput(`Error sharing: ${error.message}`);
    }
  };



  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(DEFAULT_CODE[newLang] || '');
  };

  const currentLanguage = LANGUAGES.find(lang => lang.id === language);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1a1a2e' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            CodeShare
          </Typography>

          <Select
            value={language}
            onChange={handleLanguageChange}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 160,
              background: '#000000',
              borderRadius: 4,
              marginRight: 2,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover': {
                boxShadow: `0 0 10px ${currentLanguage?.color || '#4361ee'}`
              }
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: 2,
                  background: '#1a1a2e',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
                }
              }
            }}
            renderValue={(selected) => {
              const selectedLang = LANGUAGES.find(lang => lang.id === selected);
              const Icon = selectedLang?.Icon;
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: '#000000', color: selectedLang?.color, width: 28, height: 28 }}>
                    <Icon style={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="body2" sx={{ color: '#f0f0f0' }}>{selectedLang?.name}</Typography>
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
                      boxShadow: `0 0 10px ${lang.color || '#4361ee'}`
                    }
                  }}
                >
                  <Avatar sx={{ bgcolor: '#000000', color: lang.color, width: 28, height: 28 }}>
                    <Icon style={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="body1" sx={{ color: '#f0f0f0' }}>{lang.name}</Typography>
                </MenuItem>
              );
            })}
          </Select>

          <Box sx={{ width: 150, marginRight: 2 }}>
            <Typography variant="body2" sx={{ color: '#f0f0f0' }}>Font Size: {fontSize}px</Typography>
            <Slider
              value={fontSize}
              onChange={(e, value) => setFontSize(value)}
              min={10}
              max={24}
              step={1}
              sx={{ color: 'white' }}
            />
          </Box>

          <Button onClick={handleRunCode} disabled={loading} variant="contained" sx={{
            background: 'linear-gradient(45deg, #00b4d8, #0077b6)',
            fontWeight: 'bold',
            borderRadius: 4,
            marginRight: 2,
            '&:hover': {
              background: 'linear-gradient(45deg, #0096c7, #023e8a)'
            }
          }}>
            {loading ? 'Running...' : 'Run Code'}
          </Button>

          <Button onClick={handleSave} variant="contained" sx={{
            background: 'linear-gradient(45deg, #09ac00ff, #008000)',
            fontWeight: 'bold',
            borderRadius: 4,
            marginRight: 2
          }}>
            Save
          </Button>

          <Button onClick={() => setShareDialogOpen(true)} variant="contained" sx={{
            background: 'linear-gradient(45deg, #ff9e00, #ff6d00)',
            fontWeight: 'bold',
            borderRadius: 4
          }}>
            Share
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: 'flex' }}>
        <Box sx={{ width: '70%', borderRight: '1px solid #333' }}>
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
              padding: { top: 30, bottom: 16 }
            }}
          />
        </Box>

        <Box sx={{ width: '30%', padding: 2, overflow: 'auto', backgroundColor: '#121212' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#f0f0f0', fontWeight: 'bold' }}>
            Output:
          </Typography>

          {status !== '' && (
            status === 0
              ? <Typography sx={{ color: '#00ad34ff' }}>Execution Complete</Typography>
              : <Typography sx={{ color: '#a00000ff' }}><RxCrossCircled /> Execution failed</Typography>
          )}

          <pre style={{
            backgroundColor: '#1a1a2e',
            color: '#f0f0f0',
            padding: 10,
            borderRadius: 4,
            minHeight: 100,
            whiteSpace: 'pre-wrap'
          }}>
            {output}
          </pre>
        </Box>
      </Box>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} sx={{ '& .MuiDialog-paper': { backgroundColor: '#474747', color: '#f0f0f0', boxShadow: '0 0 10px #949494ff' } }}>
        <DialogTitle>Share Your Code Snippet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Snippet Title"
            fullWidth
            value={snippetTitle}
            onChange={(e) => setSnippetTitle(e.target.value)}
            sx={{ mb: 2,  }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleShare}
            variant="contained"
            color="primary"
            sx={{
              background: 'linear-gradient(45deg, #ff9e00, #ff6d00)',
              fontWeight: 'bold',
              borderRadius: 4
            }}
          >
            Share Snippet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>
          Snippet shared successfully!
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default EditorPage;