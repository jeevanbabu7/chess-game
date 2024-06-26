import React from 'react'
import { Button, Grid, Typography, colors } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
const Landing = () => {

    const navigate = useNavigate();
    const {currentUser} = useSelector(state => state.user)
  return (
      <Grid container >
 
       <Grid  className='flex justify-center mt-10 h-screen' sx={{backgroundColor: "#302E2B"}} item xs={12} md={6}>
                <img style={{height: "35rem",margin: "auto"}} src="./board.png" alt="" className='w-10'/>
               
        </Grid>
        <Grid 
            sx={{
                backgroundColor: '#302E2B',
                height: '100vh',
            }}
        item xs={12} md={6}>
            <div style={{
                display: 'flex',
                flexDirection: "column",
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1.6rem',
                paddingTop: '2rem'
            }} >

                <Typography variant='h3' color={"white"}sx={{fontWeight: '700'}}>Play chess online</Typography>
          
  
                <Button variant='contained' color='success' onClick={
                    () => {
                        if(currentUser) navigate('/game');
                        else navigate('/')
                    }
                }>Play online</Button>
                <Button variant='text' sx={{
                    backgroundColor: '#2B2827',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#2B2827'
                    }
                }}>Play computer</Button>
            </div>

        </Grid>
      </Grid>
  )
}

export default Landing
