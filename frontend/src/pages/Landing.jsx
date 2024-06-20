import React from 'react'
import { Button, Grid, colors } from '@mui/material'
import './landing.css'
import { useNavigate } from 'react-router-dom'
const Landing = () => {

    const navigate = useNavigate();
  return (
      <Grid container >
 
       <Grid className='left-container' item xs={12} md={6}>
                <img src="./board.png" alt="" className='board-img'/>
        
        </Grid>
        <Grid item xs={12} md={6}>
            <div className="right-container">
                <p style={{
                    color: 'whitesmoke',
                    fontWeight: '700',
                    fontSize: '3rem'
                }}>Play chess online</p>
  
                <Button variant='contained' color='success' onClick={
                    () => navigate('/game')
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
