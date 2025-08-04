// This is the LandingPage 
import React from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Avatar,
    Container
} from '@mui/material';
import {
    Code,
    People,
    Share,
    CloudUpload,
    Bolt,
    Lock
} from '@mui/icons-material';
import  codeTyping from '../assets/Code-typing-pana.svg';
import {Title, Meta } from 'react-head';

const LandingPage = () => {
    return (
        <Box
        sx={{
            minHeight: '100vh',
            backgroundColor: '#000000', 
            color: '#f1f5f9',
            fontFamily: 'Inter, sans-serif',
            overflowX: 'hidden',
        }}
        >
        <Title>SpeedoBits -HomePage</Title>
        <Meta name="description" content="SpeedoBits is a real-time collaborative code editor with instant snippet sharing for developers and teams." />
        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ pt: { xs: 8, sm: 10, md: 15 }, pb: { xs: 6, sm: 8, md: 10 } }}>
            <Box textAlign="center">
            <Typography
                variant="h2"
                sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem', lg: '4.5rem' },
                mb: 2,
                background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.03em'
                }}
            >
                Code Together, Build Faster
            </Typography>

            <Typography
                variant="h5"
                sx={{
                maxWidth: '800px',
                mx: 'auto',
                mb: 4,
                color: '#cbd5e1',
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                px: 2
                }}
            >
                Real-time collaborative code editing with instant snippet sharing for teams and individuals.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                variant="contained"
                component="a"
                href="/editor"
                size="large"
                sx={{
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 600,
                    borderRadius: '12px',
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                    background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 25px rgba(99, 102, 241, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                }}
                >
                Start Coding Now
                </Button>

                <Button
                variant="outlined"
                component="a"
                href="/demo"
                size="large"
                sx={{
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: '2px solid #818cf8',
                    color: '#e0e7ff',
                    '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    border: '2px solid #6366f1'
                    }
                }}
                >
                View Demo
                </Button>
            </Box>
            <Avatar
                src={codeTyping}
                alt="Code Typing"
                sx={{
                    width: { xs: '100%', sm: '80%', md: '60%' },
                    height: 'auto',
                    backgroundColor: 'transparent',
                    mt: 4,
                    mx: 'auto',
                }}
            />
            </Box>
        </Container>

        {/* Feature Section */}
            <Box sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
                <Container>
                    <Typography
                    variant="h3"
                    sx={{
                        textAlign: 'center',
                        mb: { xs: 6, sm: 8 },
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                    >
                    Powerful Collaboration Features
                    </Typography>

                    <Grid container sx={{ gap: 4, justifyContent: 'center', alignItems: 'center' }}>
                    {[
                        {
                        icon: <People sx={{ fontSize: 50, color: '#818cf8' }} />,
                        title: 'Real-time Collaboration',
                        desc: "Code simultaneously with your team. See each other's cursors and changes as they happen."
                        },
                        {
                        icon: <Share sx={{ fontSize: 50, color: '#c084fc' }} />,
                        title: 'Instant Snippet Sharing',
                        desc: 'Share code snippets with a single click. Generate shareable links for any part of your code.'
                        },
                        {
                        icon: <CloudUpload sx={{ fontSize: 50, color: '#38bdf8' }} />,
                        title: 'Cloud Sync',
                        desc: 'All your work is automatically saved to the cloud. Access your projects from any device.'
                        },
                        {
                        icon: <Bolt sx={{ fontSize: 50, color: '#fbbf24' }} />,
                        title: 'Lightning Fast',
                        desc: 'Our editor is optimized for performance. No lag even with large codebases.'
                        },
                        {
                        icon: <Code sx={{ fontSize: 50, color: '#34d399' }} />,
                        title: 'Multi-language Support',
                        desc: 'Supports all major programming languages with syntax highlighting and autocomplete.'
                        },
                        {
                        icon: <Lock sx={{ fontSize: 50, color: '#f87171' }} />,
                        title: 'Secure & Private',
                        desc: 'End-to-end encryption for your code. Control who can view and edit your projects.'
                        }
                    ].map((feature, index) => (
                        <Grid item xs={10} sm={6} key={index}>
                        <Box
                            sx={{
                            background: 'rgba(30, 41, 59, 0.7)',
                            borderRadius: '16px',
                            p: 4,
                            height: '100%',
                            border: '1px solid rgba(99, 102, 241, 0.1)',
                            transition: 'transform 0.3s ease, border-color 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-10px)',
                                borderColor: 'rgba(99, 102, 241, 0.3)'
                            }
                            }}
                        >
                            <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#e0e7ff' }}>
                            {feature.title}
                            </Typography>
                            <Typography sx={{ color: '#94a3b8' }}>{feature.desc}</Typography>
                        </Box>
                        </Grid>
                    ))}
                    </Grid>
                </Container>
            </Box>

        {/* CTA Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, sm: 10, md: 12 }, textAlign: 'center' }}>
            <Typography
            variant="h3"
            sx={{
                fontWeight: 800,
                mb: 3,
                background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}
            >
            Ready to Code Together?
            </Typography>

            <Typography
            variant="h5"
            sx={{ maxWidth: '600px', mx: 'auto', mb: 5, color: '#cbd5e1' }}
            >
            Join thousands of developers collaborating in real-time and sharing code snippets.
            </Typography>

            <Button
            variant="contained"
            component="a"
            href="/get-started"
            size="large"
            sx={{
                px: { xs: 4, sm: 6 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '1rem', sm: '1.2rem' },
                fontWeight: 600,
                borderRadius: '14px',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                transform: 'translateY(-3px)',
                boxShadow: '0 15px 30px rgba(99, 102, 241, 0.5)'
                },
                transition: 'all 0.3s ease'
            }}
            >
            Get Started For Free
            </Button>
        </Container>
        </Box>
    );
};

export default LandingPage;