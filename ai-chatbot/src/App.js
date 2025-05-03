import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Container,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  IconButton,
  CircularProgress
} from '@mui/material';
import { ChatBubbleOutline, Brightness4, Brightness7, Delete, Add as AddIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  const [input, setInput] = useState('');
  const [themeMode, setThemeMode] = useState('light');
  const [activeSessionId, setActiveSessionId] = useState(null); 
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false); 

  const handleThemeChange = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  const handleMessageSubmit = async () => {
    if (input.trim() === '') return;
    setLoading(true)
    var answer=''
    try {
      const response = await axios.post('http://127.0.0.1:5000/ask', {
        "question": input
      });
      answer=response.data.final_answer
    }catch (error) {
      console.error('Error fetching bot response:', error);
      setLoading(false);
    } finally {
      setLoading(false); 
    }
    const userMessage = { text: input, sender: 'user' };
    const botResponse = { text: answer, sender: 'bot' };

    // If there is no active session, create a new one
    if (activeSessionId === null) {
      const newSession = {
        id: Date.now(),
        messages: [userMessage, botResponse],
      };
      setSessions([...sessions, newSession]);
      setActiveSessionId(newSession.id);
    } else {
     
      setSessions((prevSessions) => {
        const updatedSessions = prevSessions.map((session) => {
          if (session.id === activeSessionId) {
            const updatedMessages = [userMessage, botResponse, ...session.messages];
          return { ...session, messages: updatedMessages };
          }
          return session;
        });
        return updatedSessions;
      });
    }

    setInput('');
    setLoading(false); 
  };

  const handleSessionChange = (sessionId) => {
    setActiveSessionId(sessionId);
  };

  const handleNewSession = () => {
    const newSession = {
      id: Date.now(),
      messages: [],
    };
    setSessions([...sessions, newSession]);
    setActiveSessionId(newSession.id); 
  };

  // Delete a session
  const handleDeleteSession = (sessionId) => {
    setSessions((prevSessions) => {
      const updatedSessions = prevSessions.filter((session) => session.id !== sessionId);

      if (updatedSessions.length === 0) {
        setActiveSessionId(null);
      } else if (activeSessionId === sessionId) {
        setActiveSessionId(updatedSessions[0].id);
      }

      return updatedSessions;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'row' }}>
        {/* Sidebar */}
        <Drawer
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={true}
        >
          <List>
            <ListItem button>
              <ListItemText primary="Chat History" />
            </ListItem>
         
            <ListItem button onClick={handleNewSession}>
              <IconButton color="primary" aria-label="add new session">
                <AddIcon />
              </IconButton>
              <ListItemText primary="New Chat Session" />
            </ListItem>
            
            {sessions.length > 0 && (
              <Tabs
                orientation="vertical"
                value={activeSessionId}
                onChange={(e, newValue) => handleSessionChange(newValue)}
                aria-label="Chat session tabs"
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >
                {sessions.map((session) => (
                  <Tab
                    key={session.id}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span>{`Session ${new Date(session.id).toLocaleString()}`}</span>
                        <IconButton sx={{ marginLeft: 1 }} size="small" onClick={() => handleDeleteSession(session.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                    value={session.id}
                  />
                ))}
              </Tabs>
            )}
          </List>
        </Drawer>

        <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', padding: 0 }}>
          <Paper sx={{ padding: 3, borderRadius: 2 }} elevation={3}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
              <Grid item>
                <Typography variant="h5">Chatbot Dashboard</Typography>
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Switch checked={themeMode === 'dark'} onChange={handleThemeChange} icon={<Brightness7 />} checkedIcon={<Brightness4 />} />}
                  label="Theme"
                />
              </Grid>
            </Grid>

            <Box sx={{ height: 'calc(100vh - 234px)', overflowY: 'auto', backgroundColor: 'background.paper', borderRadius: 2, padding: 2, marginBottom: 2, display: 'flex', flexDirection: 'column-reverse' }}>
              {
                loading && <CircularProgress />
              }
              {activeSessionId &&
                sessions
                  .find((session) => session.id === activeSessionId)
                  .messages.map((msg, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: 1 }}>
                      <Paper sx={{ padding: 1.5, borderRadius: 2, backgroundColor: msg.sender === 'user' ? 'primary.main' : 'grey.300', color: msg.sender === 'user' ? 'white' : 'black' }}>
                        <Typography>{msg.text}</Typography>
                      </Paper>
                    </Box>
                  ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <Box sx={{ width: '70%' }}>
                <TextField
                  fullWidth
                  label="Type a message"
                  variant="outlined"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMessageSubmit()}
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 4,
                    padding: '10px 12px 16px 0',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.dark',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.dark',
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ width: '20%', paddingLeft: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleMessageSubmit}
                  startIcon={<ChatBubbleOutline />}
                  sx={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 4,
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                    backgroundImage: 'linear-gradient(45deg, #6a1b9a, #8e24aa)',
                    '&:hover': {
                      backgroundImage: 'linear-gradient(45deg, #8e24aa, #6a1b9a)',
                      boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)',
                    },
                    margin: '15px',
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
