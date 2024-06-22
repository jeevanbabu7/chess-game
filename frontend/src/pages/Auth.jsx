import { Button, Typography } from '@mui/material'
// import {GoogleIcon} from '@mui/icons-material';
import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { useNavigate, useParams } from 'react-router-dom';
import app from '../../firebase.js'

const Auth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoogleSubmit = async () => {
    try {
   
      const provider = new GoogleAuthProvider();
      // Get authentication instance
      const auth = getAuth(app);

      // Sign in with Google Popup
      const result = await signInWithPopup(auth, provider);

      // Send user data to backend
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email
        })
      });

      // Parse response data
      const data = await res.json();
      console.log(data);
      // Dispatch action to update user state
      dispatch(signInSuccess(data));
      // Navigate to dashboard
      navigate('/home');
    } catch (e) {
      console.log(e.message);
    }
  }
  return (
    <div>
      <Button onClick={handleGoogleSubmit}>
        {/* <GoogleIcon /> */}
        <Typography>
          Continue with google
        </Typography>
        
      </Button>
    </div>
  )
}

export default Auth
