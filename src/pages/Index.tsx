
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import SignInPage from "./SignInPage";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
    }
  }, [user, navigate]);

  return <SignInPage />;
};

export default Index;
