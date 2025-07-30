import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get, push, onValue, off } from 'firebase/database';
import { database } from '../firebase/config';
import { 
  Box, Typography, Container, IconButton, Stack, 
  Chip, Card, CardContent, TextField, Button,
  Avatar, CircularProgress
} from '@mui/material';
import { 
  Star as StarIcon, 
  ContentCopy as ContentCopyIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';

function SnippetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user] = useAuthState(auth);
  const [commentLoading, setCommentLoading] = useState(false);

  // Fetch snippet and comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch snippet
        const snippetRef = ref(database, `sharedSnippets/${id}`);
        const snippetSnapshot = await get(snippetRef);
        
        if (!snippetSnapshot.exists()) {
          navigate('/snippets', { replace: true });
          return;
        }
        
        setSnippet({
          id: snippetSnapshot.key,
          ...snippetSnapshot.val()
        });
        
        // Set up real-time comments listener
        const commentsRef = ref(database, `snippetComments/${id}`);
        onValue(commentsRef, (snapshot) => {
          const commentsData = [];
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              commentsData.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
              });
            });
          }
          // Sort by timestamp (newest first)
          commentsData.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
          );
          setComments(commentsData);
        });
        
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Clean up listener on unmount
    return () => {
      const commentsRef = ref(database, `snippetComments/${id}`);
      off(commentsRef);
    };
  }, [id, navigate]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      alert('Please sign in to comment');
      return;
    }

    setCommentLoading(true);
    try {
      const comment = {
        text: newComment,
        author: user.displayName || 'Anonymous',
        userId: user.uid,
        timestamp: new Date().toISOString()
      };

      const commentsRef = ref(database, `snippetComments/${id}`);
      await push(commentsRef, comment);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, backgroundColor: '#0e0e12', minHeight: '100vh', color: '#fff' }}>
      <IconButton onClick={() => navigate('/snippets')} sx={{ mb: 2, color: '#fff' }}>
        <ArrowBackIcon /> Back to Snippets
      </IconButton>
      
      {snippet && (
        <Card sx={{ mb: 4, backgroundColor: '#1c1c24', color: '#fff' }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Chip 
                label={snippet.language} 
                sx={{ 
                  mb: 2,
                  backgroundColor: '#333',
                  color: '#fff'
                }} 
              />
              <Typography color="textSecondary">
                {new Date(snippet.timestamp).toLocaleString()}
              </Typography>
            </Stack>
            
            <Typography variant="h4" gutterBottom>
              {snippet.title}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src={snippet.avatar}
                alt={snippet.author || 'Anonymous'}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1,
                  bgcolor: stringToColor(snippet.author || 'Anonymous')
                }}
              />
              {snippet.author || 'Anonymous'}
            </Typography>
            
            <Box 
                sx={{
                background: '#111',
                p: 2,
                borderRadius: 2,
                whiteSpace: 'pre-wrap',
                fontSize: 14,
                mt: 1,
                mb: 2,
                overflow: 'hidden',
                position: 'relative',
                flexGrow: 1, 
                }}>
            <SyntaxHighlighter
                language={snippet.language}
                style={atomDark}
                showLineNumbers={true}
                wrapLines={true}
                LineNumbers={false}
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
                <ContentCopyIcon sx={{ color: '#fff' }} />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
        Comments ({comments.length})
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ 
            backgroundColor: '#1c1c24',
            borderRadius: 1,
            '& .MuiInputBase-root': { color: '#fff' },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#333'
            }
          }}
        />
        <Button 
          variant="contained" 
          sx={{ mt: 1 }}
          onClick={handleCommentSubmit}
          disabled={commentLoading || !newComment.trim()}
        >
          {commentLoading ? <CircularProgress size={24} /> : 'Post Comment'}
        </Button>
      </Box>

      {comments.length === 0 ? (
        <Typography variant="body1" sx={{ color: '#aaa', textAlign: 'center', py: 4 }}>
          No comments yet. Be the first to comment!
        </Typography>
      ) : (
        comments.map((comment) => (
          <Card key={comment.id} sx={{ mb: 2, backgroundColor: '#1c1c24' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: stringToColor(comment.author)
                  }}
                >
                  {getInitials(comment.author)}
                </Avatar>
                <Typography fontWeight="bold" sx={{ color: '#fff' }}>
                  {comment.author}
                </Typography>
                <Typography variant="caption" sx={{ color: '#aaa' }}>
                  {new Date(comment.timestamp).toLocaleString()}
                </Typography>
              </Stack>
              <Typography sx={{ color: '#ddd' }}>{comment.text}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}

// Helper functions for avatar colors
function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export default SnippetDetailPage;