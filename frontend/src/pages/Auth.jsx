import { Box, Button, Typography } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { useNavigate} from 'react-router-dom';
import app from '../../firebase.js'
import Footer from '../components/Footer.jsx';
import AnimatedText from '../utils/TextAnimation.jsx';
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
      const res = await fetch('chess-game-six-kohl.vercel.app/api/auth/google', {
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
    

    <Box
      width='100%'
      height='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      sx={{
        backgroundColor: '#262522'
      }}
    >
      <Box 
        width='100%'
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        alignItems={'center'}
        gap='1.6rem'
        sx={{
          backgroundColor: '#262522'
        }}
      >
        <Box 
          sx={{marginTop: '5rem'}}
        >
          <AnimatedText />
        </Box>
        <Button variant='contained' color='success'  onClick={handleGoogleSubmit} sx={{width: "20rem"}}>
          <GoogleIcon sx={{marginRight: '1rem'}}/>
          <Typography>
            Continue with google
          </Typography>
          
        </Button>
      </Box>
        <Footer />
    </Box>
  )
}

export default Auth
