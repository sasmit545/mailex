import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Paper, 
  Divider,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      background: 'linear-gradient(to bottom, #e8f5fe, #ffffff)',
      minHeight: '100vh',
      pt: 6,
      pb: 8
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" sx={{ color: '#0d2e67' }}>
            Supercharge Outreach with <Box component="span" sx={{ color: '#2277cc' }}>Hyper-Personalized</Box> Campaigns
          </Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', mb: 4 }}>
            All-in-one platform that combines AI, API requests, data enrichment and automation 
            to deliver deeply personalized email campaigns at scale
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ 
                px: 4, 
                py: 1.5, 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              sx={{ 
                px: 4, 
                py: 1.5, 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              Book Demo
            </Button>
          </Box>
        </Box>

        {/* Problem Statement */}
        <Paper elevation={3} sx={{ p: 4, mb: 8, borderRadius: 3 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
            The Problem with Manual Cold Outreach
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, backgroundColor: '#fff4f4', height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Low Response Rates
                </Typography>
                <Typography variant="body1">
                  Only 1-3% response from generic "mail-merge" blasts that fail to resonate with prospects
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, backgroundColor: '#fff4f4', height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Complex Tech Stacks
                </Typography>
                <Typography variant="body1">
                  10+ disconnected tools create operational chaos between data providers, email automation, and CRM
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, backgroundColor: '#fff4f4', height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Wasted Time
                </Typography>
                <Typography variant="body1">
                  Over 15-20 hours/week spent on manual lead sourcing, data entry, and repetitive emailing
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Solution Features */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mb: 4 }} fontWeight="bold">
            A Seamless, AI-Powered B2B Lead Generator
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                    <SmartToyIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Autonomous AI Agents
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Running 24/7 to identify, enrich, and contact prospects at the perfect time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                    <EmailIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Hyper-personalized Outreach
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Using API requests and AI to craft 1:1 relevant messaging that resonates
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                    <AutorenewIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Multi-Channel Sequences
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Email, LinkedIn, and follow-ups all orchestrated automatically
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Testimonial */}
        <Paper elevation={1} sx={{ p: 5, mb: 8, textAlign: 'center', bgcolor: '#f7f9fc', borderRadius: 3 }}>
          <FormatQuoteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" component="p" sx={{ fontStyle: 'italic', mb: 3, maxWidth: 800, mx: 'auto' }}>
            "This system completely transformed how we approach outreach. Within weeks, we saw a 4x increase in response rates"
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            Armin Zetterberg
          </Typography>
          <Typography variant="body2" color="text.secondary">
            CEO of Puffer.se & Co-founder of Blastiq.se
          </Typography>
        </Paper>

        {/* How It Works */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mb: 4 }} fontWeight="bold">
            How It Works
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                step: "1",
                title: "Lead Sourcing",
                description: "AI identifies and qualifies potential prospects based on your criteria"
              },
              {
                step: "2",
                title: "Data Enrichment",
                description: "Automatically gather additional data points for deep personalization"
              },
              {
                step: "3",
                title: "Content Creation",
                description: "AI generates hyper-personalized messages for each individual prospect"
              },
              {
                step: "4",
                title: "Automated Sequences",
                description: "Multi-channel follow-ups sent at optimal times to maximize engagement"
              }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  position: 'relative', 
                  height: '100%',
                  borderTop: 4, 
                  borderColor: 'primary.main',
                  borderRadius: 2
                }}>
                  <CardContent>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.light', 
                        mb: 2,
                        color: 'primary.dark',
                        fontWeight: 'bold'
                      }}
                    >
                      {item.step}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Paper 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 5, 
            textAlign: 'center', 
            borderRadius: 3 
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to transform your outreach?
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ maxWidth: 700, mx: 'auto', mb: 4, fontWeight: 'normal' }}>
            Join forward-thinking companies scaling their outreach with AI
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="secondary"
              size="large" 
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': { bgcolor: '#f0f0f0' },
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              color="secondary"
              size="large" 
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              See Pricing
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;