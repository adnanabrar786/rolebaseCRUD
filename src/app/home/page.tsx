"use client";

import { useAuth } from "@/context/AuthContext";
import { Typography, Button, Container } from "@mui/material";
import Link from "next/link";

const Home = () => {
  const { currentUser, logout } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {currentUser ? (
        <>
          <Typography variant="h4" gutterBottom>
            Welcome, {currentUser.username}!
          </Typography>
          <Typography>Role: {currentUser.role}</Typography>
          <Typography>Email: {currentUser.email}</Typography>
          <Typography>Phone: {currentUser.phone}</Typography>
          {currentUser.role === "admin" && (
            <Link href="/admin" passHref>
              <Button variant="outlined" sx={{ mt: 2 }}>
                Go to Admin Panel
              </Button>
            </Link>
          )}
          <Button variant="contained" sx={{ mt: 2 }} onClick={logout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Please Login
          </Typography>
          <Link href="/login" passHref>
            <Button variant="contained" sx={{ mt: 2 }}>
              Login
            </Button>
          </Link>
        </>
      )}
    </Container>
  );
};

export default Home;
