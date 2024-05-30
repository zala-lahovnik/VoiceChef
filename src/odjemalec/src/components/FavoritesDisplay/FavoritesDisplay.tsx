import IconButton from "@mui/material/IconButton";
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import voiceChefApi from "../../utils/axios";
import {useAuth0} from "@auth0/auth0-react";
import {FC, useState} from "react";


type FavoritesDisplayProps = {
  isFavorited: boolean,
  recipeId: string,
  updateFavoritesFromProps: (recipeId: string) => void
}

const FavoritesDisplay:FC<FavoritesDisplayProps> = ({isFavorited, recipeId, updateFavoritesFromProps}) => {
  const { user } = useAuth0();

  const addItemToFavorites = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()

    if(user) {
      const response = await voiceChefApi.post('/favorites', {id: user?.sub, recipeId: recipeId})

      updateFavoritesFromProps(recipeId)
    }

  }

  return (
    <IconButton
      sx={{marginRight: 2, padding: '2px', borderRadius: '50%', backgroundColor: '#252836'}}
      onClick={(event) => {addItemToFavorites(event)}}
    >
      {
        isFavorited ?
          <StarRoundedIcon sx={{fontSize: '35px', color: '#d17a22'}} />
        :
          <StarOutlineRoundedIcon sx={{fontSize: '35px', color: '#d17a22'}} />
      }

    </IconButton>
  )
}

export default FavoritesDisplay