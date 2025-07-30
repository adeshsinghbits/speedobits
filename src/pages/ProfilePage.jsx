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
  Typography
} from '@mui/material';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../firebase/config';
import { onValue, ref } from 'firebase/database';
import StarIcon from '@mui/icons-material/Star';
import CodeIcon from '@mui/icons-material/Code';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CodeOffIcon from '@mui/icons-material/CodeOff';

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

  useEffect(() => {
    if (!user) return;

    const userSnipRef = ref(database, `userSnippets/${user.uid}`);
    const sharedRef = ref(database, 'sharedSnippets');

    onValue(userSnipRef, snapshot => {
      const data = snapshot.val() || {};
      const snippets = Object.values(data);

      const langs = {};
      const now = Date.now();
      let last24 = 0;

      snippets.forEach(sn => {
        langs[sn.language] = (langs[sn.language] || 0) + 1;
        if (now - sn.timestamp < 86400000) last24++;
      });

      const mostUsedLang = Object.keys(langs).reduce((a, b) =>
        langs[a] > langs[b] ? a : b,
        ''
      );

      setStats(prev => ({
        ...prev,
        totalRuns: snippets.length,
        runs24h: last24,
        mostUsedLang,
        languagesUsed: Object.keys(langs).length
      }));

      setCodeSnippets(snippets);
    });

    onValue(sharedRef, snapshot => {
      const data = snapshot.val() || {};
      const stars = [];
      const langStars = {};

      Object.entries(data).forEach(([id, sn]) => {
        if (sn.stars && sn.stars[user.uid]) {
          stars.push({ id, ...sn });
          langStars[sn.language] = (langStars[sn.language] || 0) + 1;
        }
      });

      const mostStarredLang = Object.keys(langStars).reduce((a, b) =>
        langStars[a] > langStars[b] ? a : b,
        ''
      );

      setStats(prev => ({
        ...prev,
        starredCount: stars.length,
        mostStarredLang
      }));

      setStarredSnippets(stars);
    });
  }, [user]);

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
              <Typography variant="caption">Most starred: {stats.mostStarredLang}</Typography>
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
              <Typography variant="caption">Most used: {stats.mostUsedLang}</Typography>
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
          <Tab icon={<CodeIcon />} label="Code Executions" />
          <Tab icon={<FavoriteIcon />} label="Starred Snippets" />
        </Tabs>

        <Box>
          {tab === 0 &&
            codeSnippets.map((snip, idx) => (
              <Card key={idx} sx={{ mb: 2, p: 2, backgroundColor: '#424f63' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {snip.language.toUpperCase()} -{' '}
                  {new Date(snip.timestamp).toLocaleString()}
                </Typography>
                <SyntaxHighlighter
                  language={snip.language}
                  style={atomDark}
                  showLineNumbers={false}
                >
                  {snip.code}
                </SyntaxHighlighter>
              </Card>
            ))}

          {tab === 1 &&
            starredSnippets.map((snip, idx) => (
              <Card key={idx} sx={{ mb: 2, p: 2, backgroundColor: '#424f63' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {snip.language.toUpperCase()} -{' '}
                  {new Date(snip.timestamp).toLocaleString()}
                </Typography>
                <SyntaxHighlighter
                  language={snip.language}
                  style={atomDark}
                  showLineNumbers={false}
                >
                  {snip.code}
                </SyntaxHighlighter>
              </Card>
            ))}
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;
