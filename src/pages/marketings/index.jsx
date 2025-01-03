import React, { useEffect, useState } from "react";
import { useFirebase } from "../../firebase_context";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { routes } from "../../app_router";

const MarketingPage = () => {
  const [marketings, setMarketings] = useState([]);

  const { logout, db, user } = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarketingData = async () => {
      const q = query(
        collection(db, "marketings"),
        where("userID", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setMarketings(data);
    };

    fetchMarketingData();
  }, [db, user]);

  const handleAddMarketing = () => {
    navigate(routes.newMarketing);
  };

  const handleLogout = async () => {
    await logout();
    navigate(routes.login);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <button
        onClick={handleLogout}
        style={{ alignSelf: "flex-end", margin: "20px" }}
      >
        Logout
      </button>
      <table style={{ width: "80%", margin: "20px 0" }}>
        <thead>
          <tr>
            <th>Business Type</th>
            <th>Job Role</th>
            <th>Location</th>
            <th>Email Start</th>
            <th>Email End</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {marketings.map((marketing, index) => (
            <tr key={index}>
              <td>{marketing.businessType}</td>
              <td>{marketing.jobRole}</td>
              <td>{marketing.location}</td>
              <td>{marketing.emailStart}</td>
              <td>{marketing.emailEnd}</td>
              <td>
                <button onClick={() => alert("Get Prospects")}>
                  Get Prospects
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button onClick={handleAddMarketing}>Add Marketing</button>
      </div>
    </div>
  );
};

export default MarketingPage;
