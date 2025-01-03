import React, { useState } from "react";
import { useFirebase } from "../../firebase_context";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { routes } from "../../app_router";

const NewMarketing = () => {
  const [businessType, setBusinessType] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [location, setLocation] = useState("");
  const [emailStart, setEmailStart] = useState("");
  const [emailEnd, setEmailEnd] = useState("");

  const navigate = useNavigate();

  const { db, user } = useFirebase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "marketings"), {
      businessType,
      jobRole,
      location,
      emailStart,
      emailEnd,
      userID: user.uid,
    });

    navigate(routes.marketings);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>New Marketing</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Business Type:</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
            >
              <option value="">Select Business Type</option>
              <option value="type1">Type 1</option>
              <option value="type2">Type 2</option>
              <option value="type3">Type 3</option>
            </select>
          </div>
          <div>
            <label>Job Role:</label>
            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            >
              <option value="">Select Job Role</option>
              <option value="role1">Role 1</option>
              <option value="role2">Role 2</option>
              <option value="role3">Role 3</option>
            </select>
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label>Email Start:</label>
            <textarea
              value={emailStart}
              onChange={(e) => setEmailStart(e.target.value)}
            />
          </div>
          <div>
            <label>Email End:</label>
            <textarea
              value={emailEnd}
              onChange={(e) => setEmailEnd(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NewMarketing;
