import React, { useState } from 'react';
import {
  TableCell,
  TableRow,
  Typography,
  IconButton,
  Checkbox,
  MenuItem,
  FormControl,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Item } from '../../utils/itemTypes';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {StyledTextField, WhiteSelect} from "../../pages/HomePage";

interface ItemRowProps {
  item: Item;
  selectedStore: string | null;
  editItemId: string | null;
  editItemName: string;
  editItemQuantity: number;
  editItemUnit: string;
  editItemStore: string;
  isChecked: boolean;
  setEditItemName: (name: string) => void;
  setEditItemQuantity: (quantity: number) => void;
  setEditItemUnit: (unit: string) => void;
  setEditItemStore: (store: string) => void;
  handleEditItem: (id: string) => void;
  handleDeleteItem: (id: string) => void;
  handleStartEditing: (item: Item) => void;
  handleCancelEditing: () => void;
  isEditing: (id: string) => boolean;
  toggleCheck: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({
  item,
  selectedStore,
  editItemId,
  editItemName,
  editItemQuantity,
  editItemUnit,
  editItemStore,
  isChecked,
  setEditItemName,
  setEditItemQuantity,
  setEditItemUnit,
  setEditItemStore,
  handleEditItem,
  handleDeleteItem,
  handleStartEditing,
  handleCancelEditing,
  isEditing,
  toggleCheck,
}) => {
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const handleCheckboxClick = () => {
    setIsStrikethrough(!isStrikethrough);
    toggleCheck();
  };

  const canEditStore = item.store === 'Uncategorized' || !selectedStore;

  return (
    <TableRow
      key={item._id}
      style={{
        textDecoration: isChecked ? 'line-through' : 'none',
        color: isChecked ? 'white' : 'white',
      }}
    >
      <TableCell align="center">
        <Checkbox
          checked={isChecked}
          onChange={handleCheckboxClick}
          sx={{
            color: 'white',
            '&.Mui-checked': {
              color: '#c17c37',
            },
          }}
        />
      </TableCell>
      <TableCell align="center">
        {isEditing(item._id) ? (
          <StyledTextField
            label="Item name"
            value={editItemName}
            onChange={(e) => setEditItemName(e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{
              style: {
                color: 'white',
                borderColor: 'white',
              },
            }}
          />
        ) : (
          <Typography variant="body1" sx={{ color: '#fff' }}>
            {item.item}
          </Typography>
        )}
      </TableCell>
      <TableCell align="center">
        {isEditing(item._id) ? (
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6}>
              <StyledTextField
                label="Quantity"
                value={editItemQuantity}
                onChange={(e) => setEditItemQuantity(Number(e.target.value))}
                type="number"
                fullWidth
                variant="outlined"
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{
                  style: {
                    color: 'white',
                    borderColor: 'white',
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <StyledTextField
                label="Unit"
                value={editItemUnit}
                onChange={(e) => setEditItemUnit(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{
                  style: {
                    color: 'white',
                    borderColor: 'white',
                  },
                }}
              />
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1" sx={{ color: '#fff' }}>
            {item.quantity} {item.unit}
          </Typography>
        )}
      </TableCell>
      {selectedStore === null || selectedStore === 'Uncategorized' ? (

        <TableCell align="center">
          {isEditing(item._id) ? (
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                color: 'white',
                '& .MuiInputLabel-root': { color: 'white' }
              }}
            >
              <WhiteSelect
                value={editItemStore}
                onChange={(e) => setEditItemStore(e.target.value as string)}
                fullWidth
                label="Store"
                disabled={!canEditStore}
                sx={{
                  color: 'white',
                  '& .MuiInputLabel-root': { color: 'white' }
                }}
              >
                <MenuItem value={'Local Market'}>Local Market</MenuItem>
                <MenuItem value={'Supermarket'}>Supermarket</MenuItem>
                <MenuItem value={'Grocery Store'}>Grocery Store</MenuItem>
                <MenuItem value={'Butcher Shop'}>Butcher Shop</MenuItem>
                <MenuItem value={'Local Farm'}>Local Farm</MenuItem>
                <MenuItem value={'Uncategorized'}>Uncategorized</MenuItem>
              </WhiteSelect>
            </FormControl>
          ) : (
            <Typography variant="body1" sx={{ color: '#fff' }}>
              {item.store}
            </Typography>
          )}
        </TableCell>
      ) : null}
      <TableCell align="center">
        {isEditing(item._id) ? (
          <>
            <IconButton
              sx={{
                backgroundColor: '#d17a22',
                color: 'white'
              }}
              onClick={() => handleEditItem(item._id)}
            >
              <SaveIcon />
            </IconButton>
            <IconButton
              sx={{
                backgroundColor: '#2D303E',
                color: 'white',
                marginLeft: 1,
              }}
              onClick={handleCancelEditing}
            >
              <CancelIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton style={{ color: 'white' }} onClick={() => handleStartEditing(item)}>
              <EditIcon />
            </IconButton>
            <IconButton style={{ color: 'white' }} onClick={() => handleDeleteItem(item._id)}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ItemRow;