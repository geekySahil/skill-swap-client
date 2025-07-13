import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  failure,
  findMatchesSuccess,
  requestSuccess,
  start,
} from "../redux/slices/matchesSlice";
import {
  failureForMate,
  createMatesSuccess,
} from "../redux/slices/matesSlice";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CircularProgress,
  Avatar,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSocket } from "../utils/socketContext";
import { fetchWithAuth } from "../utils/refreshToken";


const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  transition: "0.3s",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
}));

const Matches = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { matches, loading, error } = useSelector((state) => state.matches);
  const { currentUser } = useSelector((state) => state.user);
  const socket = useSocket()



  const createNewMate = async () => {
    for (const match of matches) {
      if (match.yourStatus === 'accepted' && match.matchStatus === 'accepted') {
        try {
          const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/mates/create-new-mate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matchRef: match._id, user1: currentUser._id, user2: match.user._id }),
            credentials: 'include',
          }, dispatch);

          const result = await res.json();

          console.log('mates',result)

          if (result.status !== 201) {
            dispatch(failureForMate(result.message));
          }
        } catch (error) {
          dispatch(failureForMate(error.message));
        }
      }
    }
  };

  const findMatches = async () => {
    try {
      dispatch(start());
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/matches/find-matches`, {
        credentials: "include",
      }, dispatch);

      if (!response.ok) throw new Error("Failed to find matches");
      const result = await response.json();
      console.log('matches', result)
      dispatch(findMatchesSuccess(result.data));
    } catch (error) {
      dispatch(failure(error.message));
    }
  };

  const handleRequest = async (match, body) => {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/matches/update-match-status/${match._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
      },dispatch);

      if (!res.ok) throw new Error('Failed to Request');

      console.log('matchuserId', match.user._id)

      const result = await res.json();
      dispatch(requestSuccess(result.data));
      socket.emit('notification', {type: 'request', from : currentUser._id, to : match.user._id, note: `${currentUser.username} has ${body.action} `})
      
    } catch (error) {
      dispatch(failure(error.message));
    }
  };

  useEffect(() => {
    findMatches();
    createNewMate();
  }, []);

  return (
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100vh",
          paddingTop: "100px",
        }}
      >
        <Container maxWidth="lg">
          <Typography color={'primary'} variant="h6" component="h6" gutterBottom sx={{ color: "gray", textAlign: 'start', marginBottom: 0}}>
            Matches
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <Grid container spacing={2} mt={1}>
            {loading ? (
              <Grid item xs={12} sx={{ color: 'gray', display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Grid>
            ) : (
              <>
                {matches &&
                  matches
                    .filter(match => !(match.yourStatus === 'accepted' && match.matchStatus === 'accepted'))
                    .map((match, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index} >
                        <StyledCard>
                          <CardContent  onClick={() => navigate(`/match/${match._id}`)}>
                            <Grid container spacing={2} alignItems="center" >
                              <Grid item>
                                <Avatar
                                  src={match?.user?.profilePicture || ""}
                                  alt={match?.user?.username}
                                  sx={{ width: 60, height: 60 }}
                                />
                              </Grid>
                              <Grid item xs>
                                <Typography variant="h6">{match?.user?.username}</Typography>
                                <Typography color="textSecondary">{match?.user?.email}</Typography>
                                <Typography color="textSecondary">{match?.user?.location}</Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                          <CardActions sx={{ justifyContent: 'flex-end' }}>
                            {(match.yourStatus === "accepted" && match.matchStatus === "pending") && (
                              <Button onClick={() => handleRequest(match, { status: "pending", action: 'reverted its request ' })} color="primary" variant="contained">
                                Revert
                              </Button>
                            )}
                            {(match.yourStatus === "pending" && match.matchStatus === "pending") && (
                              <Button onClick={() => handleRequest(match, {status: 'accepted', action: 'requested You to become learning mates'})}  variant="contained">
                                Request
                              </Button>
                            )}
                            {(match.yourStatus === "declined") && (
                              <Button onClick={() => handleRequest(match, { status: "pending", action: 'unblocked your request' })} color="secondary" variant="contained">
                                Undo Decline
                              </Button>
                            )}
                            {(match.matchStatus === "declined") && (
                              <Typography color="error">Declined...</Typography>
                            )}
                            {(match.yourStatus === "pending" && match.matchStatus === "accepted") && (
                              <>
                                <Button onClick={() => handleRequest(match, { status: "accepted", action: 'accepted your Request' })} color="success" variant="contained">
                                  Accept
                                </Button>
                                <Button onClick={() => handleRequest(match, { status: "declined", action: 'blocked your Request' })} color="error" variant="contained">
                                  Decline
                                </Button>
                              </>
                            )}
                          </CardActions>
                        </StyledCard>
                      </Grid>
                    ))
                }
              </>
            )}
          </Grid>
        </Container>
      </Box>
  );
};

export default Matches;
