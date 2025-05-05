import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SessionHistory = ({ userId }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/sessions/${userId}`);
        setSessions(response.data);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      }
    };
    fetchSessions();
  }, [userId]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Session History</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Duration (min)</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Distractions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session._id}>
                <TableCell>{new Date(session.startTime).toLocaleString()}</TableCell>
                <TableCell>{session.duration ? session.duration.toFixed(1) : '-'}</TableCell>
                <TableCell>{session.completed ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      {session.distractions.length} distractions
                    </AccordionSummary>
                    <AccordionDetails>
                      {session.distractions.length > 0 ? (
                        <ul style={{ paddingLeft: 20 }}>
                          {session.distractions.map((distraction, idx) => (
                            <li key={idx}>
                              <strong>{distraction.type}</strong>: {distraction.note || 'No note'} 
                              ({new Date(distraction.timestamp).toLocaleTimeString()})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Typography>No distractions recorded</Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SessionHistory;