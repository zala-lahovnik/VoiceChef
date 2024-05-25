import React, { useState, useEffect } from 'react';
import { Grid } from "@mui/material";
import voiceChefApi from '../utils/axios';
import { Item } from "../utils/itemTypes";
import { useNavigate } from "react-router-dom";
import SideMenu from '../components/SideMenu/SideMenu';
import SideMenuShops from '../components/SideMenuShops/SideMenuShops';
import ItemTable from '../components/ItemDisplay/ItemTable';

const ShoppingListPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [editItemId, setEditItemId] = useState<string | null>(null); // ID of the item being edited
  const [editItemName, setEditItemName] = useState<string>(''); // Edited item name
  const [editItemQuantity, setEditItemQuantity] = useState<number>(0); // Edited item quantity
  const [editItemUnit, setEditItemUnit] = useState<string>(''); // Edited item unit
  const [editItemStore, setEditItemStore] = useState<string>(''); // Edited item store

  const [newItemName, setNewItemName] = useState<string>(''); // New item name
  const [newItemQuantity, setNewItemQuantity] = useState<number>(0); // New item quantity
  const [newItemUnit, setNewItemUnit] = useState<string>(''); // New item unit

  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const result = await voiceChefApi.get('/items');
      setItems(result.data);
    } catch (error) {
      console.error('Error fetching shopping list', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleStoreSelect = (store: string) => {
    if (store === "All") {
      setSelectedStore(null); // Set selectedStore to null to show all items
    } else {
      setSelectedStore(store); // Set selectedStore to the selected store name
    }
  };

  // Filter items based on selectedStore
  const filteredItems = selectedStore
    ? items.filter(item => item.store === selectedStore)
    : items;

  const handleDeleteItem = async (id: string) => {
    try {
      await voiceChefApi.delete(`/items/${id}`);
      // Remove the deleted item from state without fetching all items again
      setItems(prevItems => prevItems.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item', error);
    }
  };

  const handleEditItem = async (id: string) => {
    try {
      // Perform the update request to backend with edited data
      await voiceChefApi.put(`/items/${id}`, {
        item: editItemName,
        quantity: editItemQuantity,
        unit: editItemUnit,
        store: editItemStore // Include edited store in the update request
      });

      // Update the local items state
      setItems(prevItems => {
        const updatedItems = prevItems.map(item => {
          if (item._id === id) {
            return {
              ...item,
              item: editItemName,
              quantity: editItemQuantity,
              unit: editItemUnit,
              store: editItemStore // Update store name in local state
            };
          }
          return item;
        });
        return updatedItems;
      });

      // Clear the edit mode
      setEditItemId(null);
      setEditItemName('');
      setEditItemQuantity(0);
      setEditItemUnit('');
      setEditItemStore('');

    } catch (error) {
      console.error('Error updating item', error);
    }
  };

  const handleStartEditing = (item: Item) => {
    setEditItemId(item._id);
    setEditItemName(item.item);
    setEditItemQuantity(item.quantity);
    setEditItemUnit(item.unit);
    setEditItemStore(item.store); // Initialize edited store with current item's store
  };

  const handleCancelEditing = () => {
    setEditItemId(null);
    setEditItemName('');
    setEditItemQuantity(0);
    setEditItemUnit('');
    setEditItemStore('');
  };

  const handleAddNewItem = async () => {
    try {
      const newItem = {
        item: newItemName,
        quantity: newItemQuantity,
        unit: newItemUnit,
        store: selectedStore || "Uncategorized"
      };
      
      const result = await voiceChefApi.post('/items', newItem);

      // Add the new item to the local state
      setItems([...items, result.data]);

      // Clear the new item form
      setNewItemName('');
      setNewItemQuantity(0);
      setNewItemUnit('');
    } catch (error) {
      console.error('Error adding new item', error);
    }
  };

  const handleStartStoreEditing = (item: Item) => {
    setEditItemId(item._id);
    setEditItemStore(item.store);
  };

  const isEditing = (id: string) => id === editItemId;

  return (
    <Grid container sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      maxHeight: '100%',
      height: { xs: '50vh', sm: '95vh', md: '100vh' }
    }}>
      <Grid item xs={1} sx={{ height: '100%' }}>
        <SideMenu />
      </Grid>
      <Grid container xs={11} sx={{ overflowY: 'scroll', height: '100%', paddingBottom: 8, paddingTop: 3 }}>
        <Grid xs={11} sx={{ height: '100%', paddingBottom: 8, paddingTop: 3, paddingLeft: 2, paddingRight: 2 }}>
          <Grid sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingLeft: '5%',
            paddingRight: '5%',
            rowGap: 15,
            columnGap: 2,
            paddingTop: '150px'
          }}>
            <Grid item xs={2.5} sx={{ height: '100%' }}>
              <SideMenuShops items={items} onStoreSelect={handleStoreSelect} selectedStore={selectedStore} />
            </Grid>
            <Grid item xs={8}>
              <ItemTable
                items={filteredItems}
                selectedStore={selectedStore}
                editItemId={editItemId}
                editItemName={editItemName}
                editItemQuantity={editItemQuantity}
                editItemUnit={editItemUnit}
                editItemStore={editItemStore} // Pass edited store name
                newItemName={newItemName}
                newItemQuantity={newItemQuantity}
                newItemUnit={newItemUnit}
                setEditItemName={setEditItemName}
                setEditItemQuantity={setEditItemQuantity}
                setEditItemUnit={setEditItemUnit}
                setEditItemStore={setEditItemStore} // Pass setter for edited store name
                setNewItemName={setNewItemName}
                setNewItemQuantity={setNewItemQuantity}
                setNewItemUnit={setNewItemUnit}
                handleEditItem={handleEditItem}
                handleDeleteItem={handleDeleteItem}
                handleStartEditing={handleStartEditing}
                handleStartStoreEditing={handleStartStoreEditing} // Pass function to start editing store
                handleCancelEditing={handleCancelEditing}
                handleAddNewItem={handleAddNewItem}
                isEditing={isEditing}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ShoppingListPage;
