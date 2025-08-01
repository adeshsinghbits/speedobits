import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Card, 
    CardContent, 
    Chip, 
    Box,
    useTheme,
    CircularProgress,
    Button
} from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../firebase/config';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IoMdArrowRoundBack } from "react-icons/io";

const SavedSnippetPage = () => {
    const [snippet, setSnippet] = useState(null);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const { id } = useParams();
    const [user] = useAuthState(auth);
    const userId = user?.uid;
    
    useEffect(() => {
        if (!userId || !id) return;

        // Fixed the Firebase path - removed the extra nesting
        const snippetRef = ref(database, `userSnippets/${userId}/${id}`);
        
        const unsubscribe = onValue(snippetRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // For a single snippet, no array needed
                setSnippet({
                    id: id,
                    ...data
                });
            } else {
                setSnippet(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching snippet:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId, id]); // Added id as dependency

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ 
                py: 4, 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh'
            }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!snippet) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
                    Snippet Not Found
                </Typography>
                <Typography variant="body1">
                    The requested code snippet does not exist or has been deleted.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button   onClick={() => window.history.back()} sx={{ mb: 2 }}>
                <IoMdArrowRoundBack />Back to Profile
            </Button>

            <Card 
                elevation={3} 
                sx={{ 
                    borderRadius: 4,
                    mb: 4
                }}
            >
                <CardContent  sx={{ 
                    padding: 3,
                    backgroundColor: "#121212",
                    color: "#ffffff"
                    }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        mb: 2
                    }}>
                        <Typography variant="h6" component="h2">
                            {snippet.title || "Untitled Snippet"}
                        </Typography>
                        <Chip 
                            label={snippet.language} 
                            size="small"
                            sx={{ 
                                backgroundColor: theme.palette.secondary.light,
                                fontWeight: 'bold'
                            }} 
                        />
                    </Box>

                    <Typography variant="caption" color="#888888">
                        Saved on: {formatDate(snippet.timestamp)}
                    </Typography>

                    <Box sx={{ 
                        mt: 2, 
                        borderRadius: 1,
                        overflow: 'hidden',
                        fontSize: '0.85rem'
                    }}>
                        <SyntaxHighlighter 
                            language={snippet.language.toLowerCase()} 
                            style={materialDark}
                            customStyle={{ 
                                margin: 0, 
                                borderRadius: 4 
                            }}
                        >
                            {snippet.code}
                        </SyntaxHighlighter>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default SavedSnippetPage;