import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AppRouter from './app_router';
import { initializeApp } from "firebase/app";
import { FirebaseProvider } from './firebase_context';

const firebaseConfig = {
  apiKey: "AIzaSyDM1r-rzeDN1_RIWICght62NiC1FXW9U8E",
  authDomain: "mailex-cfa6e.firebaseapp.com",
  projectId: "mailex-cfa6e",
  storageBucket: "mailex-cfa6e.firebasestorage.app",
  messagingSenderId: "631605633726",
  appId: "1:631605633726:web:d113f17eefb0176513f4ef",
  measurementId: "G-X8GF7HWDQ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FirebaseProvider app={app} >
      <AppRouter />
    </FirebaseProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
