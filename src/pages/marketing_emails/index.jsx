import React, { useEffect, useState } from "react";
import { useFirebase } from "../../firebase_context";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Snackbar, Alert, Typography, Button } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { routes } from "../../app_router";

const MarketingEmails = () => {
  const [emails, setEmails] = useState([]);
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const { db, user } = useFirebase();

  useEffect(() => {
    if (!user) {
      navigate(routes.login);
    }

    const fetchMarketingData = async () => {
      const docRef = doc(db, "marketings", id);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmails(data.emails);
          setName(data.name);
        } else {
          setError("Marketing not found");
          console.log("No such document!");
        }
      } catch (error) {
        setError("Failed to fetch marketing data");
        console.error(error);
      }
    };

    fetchMarketingData();
  }, [user, db, navigate, id]);

  const handleSendEmails = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
  };

  console.log(emails);

  return (
    <Container component="main">
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
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          style={{ marginTop: "5vh", marginBottom: "5vh" }}
        >
          {"AI generated emails for '" + name + "' Marketing"}
        </Typography>
        {emails.map((email, index) => (
          <Container
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginBottom: "2vh",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: 0,
            }}
          >
            <Container
              style={{
                display: "flex",
                paddingTop: "10px",
                justifyContent: "space-between",
                backgroundColor: "darkgrey",
              }}
            >
              <Typography variant="h6">{email.lead.name}</Typography>
              <Button
                variant="contained"
                color="primary"
                href={email.lead.linkedin_url}
                target="_blank"
                style={{ marginBottom: "1vh" }}
              >
                LinkedIn
              </Button>
            </Container>
            <Typography
              variant="body1"
              style={{ whiteSpace: "pre-wrap", padding: "10px" }}
            >
              {email.email}
            </Typography>
          </Container>
        ))}
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "5vh" }}
          onClick={handleSendEmails}
          disabled={loading}
        >
          {loading ? "Loading..." : "SEND"}
        </Button>
      </Container>
    </Container>
  );
};

export default MarketingEmails;
