import React, { useEffect, useState } from "react";
import { useFirebase } from "../../firebase_context";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { routes } from "../../app_router";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const NewMarketing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [businessType, setBusinessType] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [location, setLocation] = useState("");
  const [emailStart, setEmailStart] = useState("");
  const [emailEnd, setEmailEnd] = useState("");

  const navigate = useNavigate();

  const { db, user } = useFirebase();

  useEffect(() => {
    if (!user) {
      navigate(routes.login);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await addDoc(collection(db, "marketings"), {
        businessType,
        jobRole,
        location,
        emailStart,
        emailEnd,
        userID: user.uid,
      });
      setLoading(false);
      navigate(routes.marketings);
    } catch (error) {
      setError("Failed to add marketing data");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          New Marketing
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Business Type</InputLabel>
            <Select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              label="Business Type"
            >
              <MenuItem value="">
                <em>Select Business Type</em>
              </MenuItem>
              <MenuItem value="type1">Type 1</MenuItem>
              <MenuItem value="type2">Type 2</MenuItem>
              <MenuItem value="type3">Type 3</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Job Role</InputLabel>
            <Select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              label="Job Role"
            >
              <MenuItem value="">
                <em>Select Job Role</em>
              </MenuItem>
              <MenuItem value="role1">Role 1</MenuItem>
              <MenuItem value="role2">Role 2</MenuItem>
              <MenuItem value="role3">Role 3</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            fullWidth
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email Start"
            multiline
            rows={4}
            value={emailStart}
            onChange={(e) => setEmailStart(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email End"
            multiline
            rows={4}
            value={emailEnd}
            onChange={(e) => setEmailEnd(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Add Marketing"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NewMarketing;
