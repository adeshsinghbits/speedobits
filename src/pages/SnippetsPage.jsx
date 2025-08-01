import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { ref, get, remove, update } from 'firebase/database';
import { database } from '../firebase/config';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Stack,
  CircularProgress,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import {
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiPhp,
  SiRust
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

const LANGUAGE_ICONS = {
  javascript: SiJavascript,
  python: SiPython,
  java: FaJava,
  cpp: SiCplusplus,
  php: SiPhp,
  rust: SiRust
};

const LANGUAGE_COLORS = {
  javascript: '#f1e05a',
  python: '#3572A5',
  java: '#b07219',
  cpp: '#f34b7d',
  php: '#4F5D95',
  rust: '#dea584'
};

function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const snippetsRef = ref(database, 'sharedSnippets');
        const snapshot = await get(snippetsRef);
        
        if (snapshot.exists()) {
          const snippetsData = [];
          snapshot.forEach((childSnapshot) => {
            snippetsData.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          setSnippets(snippetsData);
        } else {
          setError('No snippets found');
        }
      } catch (err) {
        console.error('Error fetching snippets:', err);
        setError('Failed to load snippets');
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  const handleDelete = async (snippetId) => {
    try {
      await remove(ref(database, `sharedSnippets/${snippetId}`));
      setSnippets(snippets.filter(snippet => snippet.id !== snippetId));
      setSnackbarMessage('Snippet deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting snippet:', error);
      setSnackbarMessage('Error deleting snippet');
      setSnackbarOpen(true);
    }
  };

  const handleSnippetClick = (snippetId) => {
    navigate(`/snippets/${snippetId}`);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setSnackbarMessage('Code copied to clipboard!');
    setSnackbarOpen(true);
  };

  const toggleStar = async (snippetId) => {
  if (!user) {
    setSnackbarMessage("Please login to star");
    setSnackbarOpen(true);
    return;
  }

  const starRef = ref(database, `sharedSnippets/${snippetId}/stars/${user.uid}`);

  try {
    const snapshot = await get(starRef);
    if (snapshot.exists()) {
      // Unstar
      await update(ref(database, `sharedSnippets/${snippetId}/stars`), { [user.uid]: null });
      setSnackbarMessage("Removed star");
    } else {
      // Star
      await update(ref(database, `sharedSnippets/${snippetId}/stars`), { [user.uid]: true });
      setSnackbarMessage("Snippet starred!");
    }
    setSnackbarOpen(true);
  } catch (error) {
    console.error('Star toggle error:', error);
    setSnackbarMessage("Failed to update star");
    setSnackbarOpen(true);
  }
};

  const filteredSnippets = snippets.filter(snippet => 
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const languages = [...new Set(snippets.map(snippet => snippet.language))];

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#0e0e12',
        minHeight: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        backgroundColor: '#000000',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <Typography variant="h5" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#000000', minHeight: '100vh', color: '#fff', py: 5 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
          Discover & Share Code Snippets
        </Typography>
        <Typography variant="subtitle1" align="center" color="gray" gutterBottom>
          Explore a curated collection of code snippets from the community
        </Typography>

        {/* Search Field */}
        <Box mt={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search snippets by title, language, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'gray' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: '#1c1c24',
              borderRadius: 2,
              input: { color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#333'
              }
            }}
          />
          <Stack direction="row" spacing={1} mt={2} alignItems="center" flexWrap="wrap">
            <Chip label="Languages:" variant="outlined" sx={{ color: '#aaa', borderColor: '#333' }} />
            {languages.map((lang) => {
              const Icon = LANGUAGE_ICONS[lang] || SiJavascript;
              return (
                <Chip
                  key={lang}
                  label={lang}
                  icon={<Icon style={{ color: LANGUAGE_COLORS[lang] || '#fff' }} />}
                  sx={{ 
                    color: '#fff',
                    backgroundColor: '#333',
                    '& .MuiChip-icon': {
                      marginLeft: '8px'
                    }
                  }}
                  clickable
                  onClick={() => setSearchTerm(lang)}
                />
              );
            })}
          </Stack>
        </Box>

        {/* Snippets Grid */}
        <Grid container spacing={3} mt={2} >
          {filteredSnippets.map(snippet => {
            const Icon = LANGUAGE_ICONS[snippet.language] || SiJavascript;
            const langColor = LANGUAGE_COLORS[snippet.language] || '#fff';
            const isStarred = snippet.stars && snippet.stars[user?.uid];
            return (
              <Grid item xs={12} sm={6} md={4} key={snippet.id}>
                <Card 
                  sx={{ 
                    backgroundColor: '#1c1c24', 
                    color: '#fff', 
                    borderRadius: 3,
                    height: '400px', 
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                }}>
                  <CardContent 
                    sx={{ flexGrow: 1, 
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column' }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Chip 
                        label={snippet.language} 
                        icon={<Icon style={{ color: langColor }} />}
                        sx={{ 
                          backgroundColor: '#333',
                          '& .MuiChip-icon': {
                            marginLeft: '8px'
                          }
                        }}
                      />
                      <Typography variant="body2" color="gray">
                        {new Date(snippet.timestamp).toDateString()}
                      </Typography>
                    </Stack>
                    <Typography variant="h6" mt={1} fontWeight="bold">
                      {snippet.title}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      👤 {snippet.author || 'Anonymous'}
                    </Typography>
                    <Box
                      component="div"
                      onClick={() => handleSnippetClick(snippet.id)}
                      sx={{
                        background: '#111',
                        cursor: 'pointer',
                        p: 2,
                        borderRadius: 2,
                        whiteSpace: 'pre-wrap',
                        fontSize: 14,
                        mt: 1,
                        mb: 2,
                        overflow: 'hidden',
                        position: 'relative',
                        flexGrow: 1, 
                      }}
                    >
                      <SyntaxHighlighter
                        language={snippet.language}
                        style={atomDark}
                        showLineNumbers={true}
                        wrapLines={true}LineNumbers={false}
                      >
                        {snippet.code}
                      </SyntaxHighlighter>
                      <IconButton
                        onClick={() => copyToClipboard(snippet.code)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.9)'
                          }
                        }}
                      >
                        <ContentCopyIcon fontSize="small" sx={{ color: '#fff' }} />
                      </IconButton>
                    </Box>
                    <Stack direction="row" justifyContent="space-between">
                      <IconButton 
                        sx={{ color: isStarred ? 'gold' : 'gray' }}
                        onClick={() => toggleStar(snippet.id)}
                      >
                        {isStarred ? <FaStar /> : <CiStar />}
                      <Typography variant="caption" sx={{ ml: 1,fontSize: 16 }} >
                        {snippet.stars ? Object.keys(snippet.stars).length : 0} stars
                      </Typography>
                      </IconButton>
                      { user.uid === snippet.userId && (
                        <IconButton 
                          sx={{ color: '#888' }}
                          onClick={() => handleDelete(snippet.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {filteredSnippets.length === 0 && (
          <Typography variant="h6" align="center" mt={4} color="gray">
            No snippets found matching your search
          </Typography>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default SnippetsPage;