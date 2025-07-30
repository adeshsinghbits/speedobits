import React from 'react';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Button
} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';

const ProfilePage = () => {
    const [user, loading, error] = useAuthState(auth);
        
    if (loading) {
        return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
        );
    }

    if (error) {
        return (
        <Box textAlign="center" mt={4}>
            <Typography variant="h6" color="error">Error: {error.message}</Typography>
        </Box>
        );
    }

    if (!user) {
        return (
        <Box textAlign="center" mt={4}>
            <Typography variant="h6">No user is signed in.</Typography>
        </Box>
        );
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Card sx={{ width: 400, p: 3, borderRadius: 4, boxShadow: 6 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar src={user.photoURL} sx={{ width: 100, height: 100, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold">{user.displayName || "Anonymous User"}</Typography>
            <Typography variant="body1" color="text.secondary">{user.email}</Typography>
            </Box>
            <CardContent>
            <Typography variant="subtitle1" gutterBottom>
                UID:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                {user.uid}
            </Typography>
            </CardContent>
            <Box display="flex" justifyContent="center" mt={2}>
            <Button
                variant="contained"
                color="error"
                onClick={() => auth.signOut()}
            >
                Sign Out
            </Button>
            </Box>
        </Card>
        </Box>
    );
};

export default ProfilePage;
