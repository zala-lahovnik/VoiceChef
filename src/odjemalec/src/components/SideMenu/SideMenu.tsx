import React from "react";
import {Grid} from "@mui/material";
import {useLocation} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import IconButton from "@mui/material/IconButton";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';


const SideMenu = () => {
  const routePath = useLocation()
  const { isAuthenticated } = useAuth0();

  return (
    <Grid container sx={{
      borderTopRightRadius: '25px',
      borderBottomRightRadius: '25px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1F1D2B',
      border: 0,
      paddingTop: 2,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Grid sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#252836',
        width: '100%',
        justifyContent: 'center'
        }}>
        <Grid item xs={12}  sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomRightRadius: routePath.pathname === '/' ? '16px' : '',
          paddingTop: 2,
          paddingBottom: 2,
          backgroundColor: '#1F1D2B'
        }}>
        {/*  EMPTY GRID ITEM TO GET BORDERS ON TOP  DO NOT DELETE! */}
        </Grid>
        <Grid item xs={12} sx={routePath.pathname === '/' ? {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1F1D2B',
            marginLeft: routePath.pathname === '/' ? 0 : 2,
          } :
          {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: routePath.pathname === '/' ? '16px' : '',
            paddingTop: 2,
            paddingBottom: 2,
            backgroundColor: '#1F1D2B'
          }
          }>
          <Grid item xs={12} sx={ routePath.pathname === '/' ? {
              padding: 2,
              display: 'flex',
              marginLeft: 1.5,
              paddingRight: 3.5,
              backgroundColor: routePath.pathname === '/' ? '#252836': '',
              borderTopLeftRadius: routePath.pathname === '/' ? '16px' : '',
              borderBottomLeftRadius: routePath.pathname === '/' ? '16px' : '',
              justifyContent: 'center',
            }
            :
            {
              padding: 2,
              backgroundColor: routePath.pathname === '/shopping-list' ? '#EA7C69' : '',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }
          }>
            <IconButton sx={{padding: 2, backgroundColor: routePath.pathname === '/' ? '#d17a22' : '', borderRadius: '8px', filter: 'drop-shadow(0px 8px 24px rgba(234, 124, 105, 0.32))'}}>
              <HomeRoundedIcon sx={{color: '#fff', fontSize: '36px'}} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={routePath.pathname === 'shopping-list' ? {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1F1D2B',
            marginLeft: routePath.pathname === 'shopping-list' ? 0 : 2,
          } :
          {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: routePath.pathname === '/' ? '16px' : '',
            borderBottomRightRadius: routePath.pathname.includes('/recipe/') ? '16px': '',
            paddingTop: 2,
            paddingBottom: 2,
            backgroundColor: '#1F1D2B'
          }
        }>
          <Grid item xs={12} sx={ routePath.pathname === 'shopping-list' ? {
              padding: 2,
              display: 'flex',
              marginLeft: 1.5,
              paddingRight: 3.5,
              backgroundColor: '#252836',
              borderTopLeftRadius: '16px',
              borderBottomLeftRadius: '16px',
              justifyContent: 'center',
            }
            :
            {
              padding: 2,
              backgroundColor: routePath.pathname === 'shopping-list' ? '#EA7C69' : '',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }
          }>
            <IconButton sx={{padding: 2, backgroundColor: routePath.pathname === 'shopping-list' ? '#d17a22' : '', borderRadius: '8px', filter: 'drop-shadow(0px 8px 24px rgba(234, 124, 105, 0.32))'}}>
              <ChecklistRoundedIcon sx={{color: '#fff', fontSize: '36px'}} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={routePath.pathname.includes('/recipe/') ? {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1F1D2B',
            marginLeft: routePath.pathname.includes('/recipe/') ? 0 : 2,
          } :
          {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: routePath.pathname === '/shopping-list' ? '16px' : '',
            paddingTop: 2,
            paddingBottom: 2,
            backgroundColor: '#1F1D2B'
          }
        }>
          <Grid item xs={12} sx={ routePath.pathname.includes('/recipe/') ? {
              padding: 2,
              display: 'flex',
              marginLeft: 1.5,
              paddingRight: 3.5,
              backgroundColor: '#252836',
              borderTopLeftRadius: '16px',
              borderBottomLeftRadius: '16px',
              justifyContent: 'center',
            }
            :
            {
              padding: 2,
              backgroundColor: routePath.pathname.includes('/recipe/') ? '#EA7C69' : '',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }
          }>
            <IconButton sx={{padding: 2, backgroundColor: routePath.pathname.includes('/recipe/') ? '#d17a22' : '', borderRadius: '8px', filter: 'drop-shadow(0px 8px 24px rgba(234, 124, 105, 0.32))'}}>
              <MenuBookRoundedIcon sx={{color: '#fff', fontSize: '36px'}} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={routePath.pathname === '/profile' ? {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1F1D2B',
            marginLeft: routePath.pathname === '/profile' ? 0 : 2,
          } :
          {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: routePath.pathname.includes('/recipe/') ? '16px' : '',
            paddingTop: 2,
            paddingBottom: 2,
            backgroundColor: '#1F1D2B'
          }
        }>
          <Grid item xs={12} sx={ routePath.pathname === '/profile' ? {
              padding: 2,
              display: 'flex',
              marginLeft: 1.5,
              paddingRight: 3.5,
              backgroundColor: '#252836',
              borderTopLeftRadius: '16px',
              borderBottomLeftRadius: '16px',
              justifyContent: 'center',
            }
            :
            {
              padding: 2,
              backgroundColor: routePath.pathname === '/profile' ? '#EA7C69' : '',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }
          }>
            <IconButton sx={{padding: 2, backgroundColor: routePath.pathname === '/profile' ? '#d17a22' : '', borderRadius: '8px', filter: 'drop-shadow(0px 8px 24px rgba(234, 124, 105, 0.32))'}}>
              <ManageAccountsRoundedIcon sx={{color: '#fff', fontSize: '36px'}} />
            </IconButton>
          </Grid>
        </Grid>

        <Grid item xs={12}  sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopRightRadius: routePath.pathname === '/recipes' ? '16px' : '',
          paddingTop: 2,
          paddingBottom: 2,
          backgroundColor: '#1F1D2B'
        }}>
          {isAuthenticated ? <IconButton sx={{
            padding: 2,
            backgroundColor: routePath.pathname === '/settings' ? '#EA7C69' : '',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <LogoutRoundedIcon sx={{color: '#fff', fontSize: '36px'}}/>
          </IconButton>
          :
          <IconButton sx={{
            padding: 2,
            backgroundColor: routePath.pathname === '/settings' ? '#EA7C69' : '',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <LoginRoundedIcon sx={{color: '#fff', fontSize: '36px'}}/>
          </IconButton>
        }
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SideMenu