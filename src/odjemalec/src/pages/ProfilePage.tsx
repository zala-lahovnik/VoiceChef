import {Grid, Typography} from "@mui/material";
import SideMenu from "../components/SideMenu/SideMenu";
import React from "react";


const ProfilePage = () => {

  return (
    <Grid container sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      maxHeight: '100%',
      height: {xs: '50vh', sm: '95vh', md: '100vh'}
    }}>
      <Grid item xs={1} sx={{height: '100%'}}>
        <SideMenu />
      </Grid>
      <Grid item xs={11} sx={{overflowY: 'scroll', height: '100%', paddingBottom: 8, paddingTop: 3}}>
        <Typography>
          Neko random besedilo za zdaj, tukaj bodo podatki o uporabniku
        </Typography>
      </Grid>
    </Grid>
  )
}

export default ProfilePage