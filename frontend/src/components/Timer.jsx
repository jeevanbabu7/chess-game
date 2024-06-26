import { Typography } from '@mui/material'
import React from 'react'

const Timer = ({time}) => {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  return (
    <div>
        <Typography variant='h4' color='whitesmoke'>{`${min}:${sec.toString().length == 2 ?  sec : '0'+sec}`}</Typography>
    </div>
  )
}

export default Timer
