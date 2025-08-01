import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../firebase/config';
import { onValue, ref } from 'firebase/database';
import StarIcon from '@mui/icons-material/Star';
import CodeIcon from '@mui/icons-material/Code';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import { FaBookmark, FaStar } from 'react-icons/fa';

const ProfilePage = () => {
  const [user] = useAuthState(auth);
  const [tab, setTab] = useState(0);
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [starredSnippets, setStarredSnippets] = useState([]);
  const [stats, setStats] = useState({
    totalRuns: 0,
    runs24h: 0,
    starredCount: 0,
    mostStarredLang: '',
    mostUsedLang: '',
    languagesUsed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const userSnipRef = ref(database, `userSnippets/${user.uid}`);
    const sharedRef = ref(database, 'sharedSnippets');
    
    // Unsubscribe functions
    const unsubscribers = [];
    
    // User snippets listener
    const userUnsub = onValue(userSnipRef, snapshot => {
      const data = snapshot.val() || {};
      // Extract snippet IDs
      const snippets = Object.entries(data).map(([id, snip]) => ({ id, ...snip }));

      const langs = {};
      const now = Date.now();
      let last24 = 0;

      snippets.forEach(sn => {
        langs[sn.language] = (langs[sn.language] || 0) + 1;
        if (sn.timestamp && now - sn.timestamp < 86400000) last24++;
      });

      const mostUsedLang = Object.keys(langs).reduce((a, b) =>
        langs[a] > langs[b] ? a : b, ''
      );
      
      setStats(prev => ({
        ...prev,
        totalRuns: snippets.length,
        runs24h: last24,
        mostUsedLang,
        languagesUsed: Object.keys(langs).length
      }));

      setCodeSnippets(snippets);
      setLoading(false);
    });
    unsubscribers.push(userUnsub);

    // Starred snippets listener
    const sharedUnsub = onValue(sharedRef, snapshot => {
      const data = snapshot.val() || {};
      const stars = [];
      const langStars = {};

      Object.entries(data).forEach(([id, sn]) => {
        if (sn.stars && sn.stars[user.uid]) {
          // Extract snippet ID
          stars.push({ id, ...sn });
          langStars[sn.language] = (langStars[sn.language] || 0) + 1;
        }
      });

      const mostStarredLang = Object.keys(langStars).reduce((a, b) =>
        langStars[a] > langStars[b] ? a : b, ''
      );

      setStats(prev => ({
        ...prev,
        starredCount: stars.length,
        mostStarredLang
      }));

      setStarredSnippets(stars);
    });
    unsubscribers.push(sharedUnsub);

    return () => unsubscribers.forEach(unsub => unsub());
  }, [user]);

  // Helper to safely format dates
  const formatDate = (timestamp) => {
    try {
      return timestamp ? new Date(timestamp).toLocaleString() : 'Unknown date';
    } catch {
      return 'Invalid date';
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#cfd8dc' }}>
          Please sign in to view your profile
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Card sx={{ p: 3, mb: 4, backgroundColor: '#424f63' }} >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Badge
              color="secondary"
              variant="dot"
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar
                src={user?.photoURL}
                alt={user?.displayName}
                sx={{ width: 80, height: 80 }}
              />
            </Badge>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" fontWeight="bold">
              {user?.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#425f77' }}>
            <CardContent>
              <Typography variant="h6">Total code runs</Typography>
              <Typography variant="h4" fontWeight="bold">{stats.totalRuns}</Typography>
              <Box mt={1}>
                <Chip icon={<CodeIcon />} label="Code Executions" />
              </Box>
              <Typography variant="caption">Last 24h: {stats.runs24h}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#425f77' }}>
            <CardContent>
              <Typography variant="h6">Saved for later</Typography>
              <Typography variant="h4" fontWeight="bold">{stats.starredCount}</Typography>
              <Box mt={1}>
                <Chip icon={<StarIcon />} label="Starred Snippets" />
              </Box>
              <Typography variant="caption">Most starred: {stats.mostStarredLang || 'None'}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#425f77' }}>
            <CardContent>
              <Typography variant="h6">Different languages</Typography>
              <Typography variant="h4" fontWeight="bold">{stats.languagesUsed}</Typography>
              <Box mt={1}>
                <Chip icon={<CodeOffIcon />} label="Languages Used" />
              </Box>
              <Typography variant="caption">Most used: {stats.mostUsedLang || 'None'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box>
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab icon={<FaBookmark />} sx={{ color: '#f1f5f9' }} label="Code Saved" />
          <Tab icon={<FaStar />}  sx={{ color: '#f1f5f9' }} label="Starred Snippets" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {tab === 0 && (
              <>
                {codeSnippets.length === 0 ? (
                  <Typography variant="h6" align="center" sx={{ color: '#cfd8dc', mt: 4 }}>
                    No code executions found
                  </Typography>
                ) : (
                  codeSnippets.map((snip) => (
                    <Card
                      key={snip.id}
                      sx={{
                        mb: 3,
                        p: 3,
                        borderRadius: 4,
                        backgroundColor: '#2e3b4e',
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.01)',
                        },
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'light',
                            color: '#9bc8f9',
                            mb: 0.5,
                            wordBreak: 'break-word',
                          }}
                        >
                          {snip.title || 'Untitled Snippet'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#90caf9' }}>
                          Language: {snip.language?.toUpperCase()}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        href={`/saved-snippets/${snip.id}`}
                        sx={{
                          mt: { xs: 2, md: 0 },
                          backgroundColor: '#1de9b6',
                          color: '#000',
                          fontWeight: 600,
                          px: 3,
                          py: 1.2,
                          borderRadius: 3,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: '#00bfa5',
                          },
                        }}
                      >
                        View Snippet
                      </Button>
                    </Card>
                  ))
                )}
              </>
            )}
            
            {tab === 1 && (
              <>
                {starredSnippets.length === 0 ? (
                  <Typography variant="h6" align="center" sx={{ color: '#cfd8dc', mt: 4 }}>
                    No starred snippets found
                  </Typography>
                ) : (
                  starredSnippets.map((snip) => (
                    <Card
                      key={snip.id}
                      sx={{
                        mb: 3,
                        p: 3,
                        borderRadius: 4,
                        backgroundColor: '#2e3b4e',
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.01)',
                        },
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: '#ffffff',
                            mb: 0.5,
                            wordBreak: 'break-word',
                          }}
                        >
                          {snip.title || 'Untitled Snippet'}
                        </Typography>

                        <Stack direction="row" spacing={2} flexWrap="wrap" mb={1}>
                          <Typography
                            variant="body2"
                            sx={{ color: '#90caf9', fontWeight: 500 }}
                          >
                            Language: {snip.language?.toUpperCase()}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: '#cfd8dc' }}
                          >
                            Author: {snip.author || 'Unknown'}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="caption"
                          sx={{ color: '#b0bec5' }}
                        >
                          Created: {formatDate(snip.timestamp)}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        href={`/snippets/${snip.id}`}
                        sx={{
                          mt: { xs: 2, md: 0 },
                          backgroundColor: '#1de9b6',
                          color: '#000',
                          fontWeight: 600,
                          px: 3,
                          py: 1.2,
                          borderRadius: 3,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: '#00bfa5',
                          },
                        }}
                      >
                        View Snippet
                      </Button>
                    </Card>
                  ))
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProfilePage;