import React from "react";
import { Grid, IconButton, Typography, ButtonBase } from "@mui/material";
import { Item } from "../../utils/itemTypes";
import BalanceRoundedIcon from '@mui/icons-material/BalanceRounded';
import AgricultureRoundedIcon from '@mui/icons-material/AgricultureRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';

// Define icons for each store
const storeIcons: Record<string, React.ReactElement> = {
  "Local Market": <BalanceRoundedIcon sx={{ color: '#fff' }} />,
  "Supermarket": <ShoppingCartRoundedIcon sx={{ color: '#fff' }} />,
  "Grocery Store": <ShoppingBagRoundedIcon sx={{ color: '#fff' }} />,
  "Butcher Shop": <SavingsRoundedIcon sx={{ color: '#fff' }} />,
  "Local Farm": <AgricultureRoundedIcon sx={{ color: '#fff' }} />,
  "Uncategorized": <HelpRoundedIcon sx={{ color: '#fff' }} />, // Example icon for Uncategorized with white color
};

// Function to group items by store and count occurrences
const groupItemsByStore = (items: Item[]) => {
  const stores = items.reduce((acc, item) => {
    const storeName = item.store || "Uncategorized";
    if (acc[storeName]) {
      acc[storeName]++;
    } else {
      acc[storeName] = 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Add "All" option to show total count of items
  stores["All"] = items.length;

  return stores;
};

type SideMenuShopsProps = {
  items: Item[];
  onStoreSelect: (store: string) => void;
  selectedStore: string | null;
};

const SideMenuShops: React.FC<SideMenuShopsProps> = ({ items, onStoreSelect, selectedStore }) => {
  const stores = groupItemsByStore(items);

  // Extract "Uncategorized" and "All" from stores object
  const uncategorized = stores["Uncategorized"];
  const all = stores["All"];

  // Filter out "Uncategorized" and "All" from the keys
  const sortedStores = Object.keys(stores)
    .filter(store => store !== "Uncategorized" && store !== "All")
    .sort();

  return (
    <Grid container sx={{
      borderRadius: '25px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1F1D2B',
      border: 0,
      paddingTop: 2,
      paddingBottom: 2,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Grid sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center'
      }}>

        {/* "Uncategorized" option */}
        <Grid item xs={12} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomRightRadius: '16px',
        }}>
          <Grid item xs={12} sx={{
            padding: 1,
            display: 'flex',
            marginLeft: 1.5,
            paddingRight: 3.5,
            backgroundColor: selectedStore === "Uncategorized" ? '#252836' : '#1F1D2B',
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
            justifyContent: 'left',
          }}>
            <ButtonBase
              sx={{
                borderRadius: '8px',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: '#252836',
                },
              }}
              onClick={() => onStoreSelect("Uncategorized")}
            >
              <IconButton
                sx={{
                  padding: 1,
                  backgroundColor: 'transparent',
                }}
              >
                {storeIcons["Uncategorized"] || <HelpRoundedIcon sx={{ color: '#fff' }} />} {/* Default icon for Uncategorized with white color */}
              </IconButton>
              <Typography
                variant="body1"
                sx={{
                  color: '#fff',
                  marginLeft: '8px',
                  fontSize: '18px',
                  textAlign: 'center', // Center-align the text
                  display: 'flex',
                  alignItems: 'center', // Align text vertically with icon
                  paddingRight: 2
                }}
              >
                Uncategorized ({uncategorized})
              </Typography>
            </ButtonBase>
          </Grid>
        </Grid>

        {/* "All" option */}
        <Grid item xs={12} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomRightRadius: sortedStores.length === 0 ? '16px' : ''
        }}>
          <Grid item xs={12} sx={{
            padding: 1,
            display: 'flex',
            marginLeft: 1.5,
            paddingRight: 3.5,
            backgroundColor: selectedStore === null ? '#252836' : '#1F1D2B',
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
            justifyContent: 'left',
          }}>
            <ButtonBase
              sx={{
                borderRadius: '8px',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: '#252836',
                },
              }}
              onClick={() => onStoreSelect("All")}
            >
              <IconButton
                sx={{
                  padding: 1,
                  backgroundColor: 'transparent',
                }}
              >
                <StoreRoundedIcon sx={{ color: '#fff' }} />
              </IconButton>
              <Typography
                variant="body1"
                sx={{
                  color: '#fff',
                  marginLeft: '8px',
                  fontSize: '18px',
                  textAlign: 'center', // Center-align the text
                  display: 'flex',
                  alignItems: 'center', // Align text vertically with icon
                  paddingRight: 2
                }}
              >
                All ({all})
              </Typography>
            </ButtonBase>
          </Grid>
        </Grid>

        {/* Actual store options */}
        {sortedStores.map((store, index) => (
          <Grid item xs={12} key={index} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomRightRadius: index === sortedStores.length - 1 ? '16px' : ''
          }}>
            <Grid item xs={12} sx={{
              padding: 1,
              display: 'flex',
              marginLeft: 1.5,
              paddingRight: 3.5,
              backgroundColor: selectedStore === store ? '#252836' : '#1F1D2B',
              borderTopLeftRadius: '16px',
              borderBottomLeftRadius: '16px',
              justifyContent: 'left',
            }}>
              <ButtonBase
                sx={{
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: '#252836',
                  },
                }}
                onClick={() => onStoreSelect(store)}
              >
                <IconButton
                  sx={{
                    padding: 1,
                    backgroundColor: 'transparent',
                  }}
                >
                  {storeIcons[store] || <StoreRoundedIcon sx={{ color: '#fff' }} />} {/* Default to StoreIcon with white color */}
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#fff',
                    marginLeft: '8px',
                    fontSize: '18px',
                    textAlign: 'center', // Center-align the text
                    display: 'flex',
                    alignItems: 'center', // Align text vertically with icon
                    paddingRight: 2
                  }}
                >
                  {store} ({stores[store]})
                </Typography>
              </ButtonBase>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid >
  );
};

export default SideMenuShops;