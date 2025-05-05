import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, TextField, Select, MenuItem, Paper } from '@mui/material';
import { PlayArrow, Pause, Stop, Add } from '@mui/icons-material';
import axios from 'axios';

const Timer = ({ userId }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [distractionType, setDistractionType] = useState('');
  const [distractionNote, setDistractionNote] = useState('');
  const [showDistractionForm, setShowDistractionForm] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            endSession();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const startSession = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/sessions', { userId });
      setSessionId(response.data._id);
      setIsActive(true);
    } catch (err) {
      console.error('Error starting session:', err);
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resumeTimer = () => {
    setIsActive(true);
  };

  const endSession = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/sessions/${sessionId}/end`);
      setIsActive(false);
      setMinutes(25);
      setSeconds(0);
      setSessionId(null);
    } catch (err) {
      console.error('Error ending session:', err);
    }
  };

  const logDistraction = async () => {
    try {
      await axios.post(`http://localhost:5000/api/sessions/${sessionId}/distractions`, {
        type: distractionType,
        note: distractionNote
      });
      setDistractionType('');
      setDistractionNote('');
      setShowDistractionForm(false);
    } catch (err) {
      console.error('Error logging distraction:', err);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        FocusTime
      </Typography>
      <Typography variant="h2" align="center" gutterBottom>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
        {!isActive && !sessionId && (
          <Button variant="contained" startIcon={<PlayArrow />} onClick={startSession}>
            Start
          </Button>
        )}
        {isActive && (
          <Button variant="outlined" startIcon={<Pause />} onClick={pauseTimer}>
            Pause
          </Button>
        )}
        {!isActive && sessionId && (
          <Button variant="contained" startIcon={<PlayArrow />} onClick={resumeTimer}>
            Resume
          </Button>
        )}
        {sessionId && (
          <Button variant="outlined" color="error" startIcon={<Stop />} onClick={endSession}>
            End
          </Button>
        )}
      </Box>

      {isActive && (
        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<Add />} 
            onClick={() => setShowDistractionForm(true)}
          >
            Log Distraction
          </Button>
        </Box>
      )}

      {showDistractionForm && (
        <Box sx={{ mt: 3, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Log Distraction</Typography>
          <Select
            fullWidth
            value={distractionType}
            onChange={(e) => setDistractionType(e.target.value)}
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>Select distraction type</MenuItem>
            <MenuItem value="phone">Checked phone</MenuItem>
            <MenuItem value="call">Got a call</MenuItem>
            <MenuItem value="email">Checked email</MenuItem>
            <MenuItem value="social">Social media</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
          <TextField
            fullWidth
            label="Note (optional)"
            value={distractionNote}
            onChange={(e) => setDistractionNote(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" onClick={() => setShowDistractionForm(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={logDistraction}>
              Log
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default Timer;