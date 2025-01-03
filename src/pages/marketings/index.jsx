import React, { useEffect, useState } from "react";
import { useFirebase } from "../../firebase_context";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { routes } from "../../app_router";
import {
  Button,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { signOut } from "firebase/auth";

const MarketingPage = () => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [marketings, setMarketings] = useState([]);
  const [error, setError] = useState(null);

  const { auth, db, user } = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate(routes.login);
      return;
    }

    const fetchMarketingData = async () => {
      const q = query(
        collection(db, "marketings"),
        where("userID", "==", user.uid)
      );
      try {
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => doc.data());
        setMarketings(data);
      } catch (error) {
        setError("Failed to fetch marketing data");
        console.error(error);
      }
    };

    fetchMarketingData();
  }, [db, navigate, user]);

  const handleAddMarketing = () => {
    navigate(routes.newMarketing);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      setError("Failed to logout");
      console.error(error);
    }
    setLogoutLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
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
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        style={{ float: "right", marginBottom: "20px" }}
        disabled={logoutLoading}
      >
        {logoutLoading ? "Loading..." : "Logout"}
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Business Type</TableCell>
              <TableCell>Job Role</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Email Start</TableCell>
              <TableCell>Email End</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {marketings.map((marketing, index) => (
              <TableRow key={index}>
                <TableCell>{marketing.businessType}</TableCell>
                <TableCell>{marketing.jobRole}</TableCell>
                <TableCell>{marketing.location}</TableCell>
                <TableCell>{marketing.emailStart}</TableCell>
                <TableCell>{marketing.emailEnd}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => alert("Get Prospects")}
                  >
                    Get Prospects
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddMarketing}
        >
          Add Marketing
        </Button>
      </div>
    </div>
  );
};

export default MarketingPage;
