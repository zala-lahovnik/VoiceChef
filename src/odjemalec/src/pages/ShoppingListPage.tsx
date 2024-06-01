import React, { useState, useEffect, useCallback } from 'react';
import { Box, Drawer, Grid } from "@mui/material";
import voiceChefApi from '../utils/axios';
import { Item } from "../utils/itemTypes";
import SideMenu from '../components/SideMenu/SideMenu';
import SideMenuShops from '../components/SideMenuShops/SideMenuShops';
import ItemTable from '../components/ItemDisplay/ItemTable';
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useResponsive } from "../hooks/responsive";
import { useAuth0 } from '@auth0/auth0-react';

const ShoppingListPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState<string>('');
  const [editItemQuantity, setEditItemQuantity] = useState<number>(0);
  const [editItemUnit, setEditItemUnit] = useState<string>('');
  const [editItemStore, setEditItemStore] = useState<string>('');

  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemQuantity, setNewItemQuantity] = useState<number>(0);
  const [newItemUnit, setNewItemUnit] = useState<string>('');

  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const responsive = useResponsive('up', 'lg')

  const { user } = useAuth0();

  const fetchItems = async () => {
    try {
      const result = await voiceChefApi.get(`/items/${user?.sub}`);
      setItems(result.data);
      localStorage.setItem('items', JSON.stringify(result.data));
      setItems(JSON.parse(localStorage.getItem('items') || '[]'));
      if (Notification.permission === 'granted') {
        new Notification("Error fetching shopping list", {
          body: 'Fetching shopping list failed. Please try again later.',
          icon: '/icon-144.png'
        });
      }
    } catch (error){
      console.error('Error fetching shopping list', error);
    }
  };

  const handleStoreSelect = (store: string) => {
    if (store === "All") {
      setSelectedStore(null);
    } else {
      setSelectedStore(store);
    }
  };

  const filteredItems = selectedStore
    ? items.filter(item => item.store === selectedStore)
    : items;

  const handleAddNewItem = async () => {
    if (user) {
      try {
        const newItem = {
          userId: user.sub,
          item: newItemName,
          quantity: newItemQuantity,
          unit: newItemUnit,
          store: selectedStore || "Uncategorized"
        };

        if (navigator.onLine) {
          const result = await voiceChefApi.post('/items', newItem);

          setItems([...items, result.data]);

          setNewItemName('');
          setNewItemQuantity(0);
          setNewItemUnit('');
        } else {
          let offlineItemsString = localStorage.getItem('offlineItems');
          let offlineItems;
          try {
            offlineItems = offlineItemsString ? JSON.parse(offlineItemsString) : [];
            if (!Array.isArray(offlineItems)) {
              console.warn('offlineItems is not an array, resetting to an empty array');
              offlineItems = [];
            }
          } catch (error) {
            console.error('Error parsing offlineItems, resetting to an empty array', error);
            offlineItems = [];
          }

          offlineItems.push(newItem);
          console.log("kaj " + offlineItems);
          localStorage.setItem('offlineItems', JSON.stringify(offlineItems));

          const itemsString = localStorage.getItem('items') || '[]';
          const items = JSON.parse(itemsString);
          items.push(newItem);
          localStorage.setItem('items', JSON.stringify(items));

          setItems(items);

          setNewItemName('');
          setNewItemQuantity(0);
          setNewItemUnit('');
        }
      } catch (error) {
        if (Notification.permission === 'granted') {
          new Notification("Error adding new item", {
            body: `Could not add item. Please try again later.`,
            icon: '/icon-144.png'
          });
        }
        console.error('Error adding new item', error);
      }
    }
  };

  const handleDeleteItem = useCallback(async (id: string) => {
    try {
      if (navigator.onLine) {
        await voiceChefApi.delete(`/items/${id}`);

        setItems(prevItems => {
          const updatedItems = prevItems.filter(item => item._id !== id);
          localStorage.setItem('items', JSON.stringify(updatedItems));
          return updatedItems;
        });

        if (Notification.permission === 'granted') {
          new Notification("Item deleted", {
            body: 'The item was successfully deleted.',
            icon: '/icon-144.png'
          });
        }
      } else {
        const pendingDeletions = JSON.parse(localStorage.getItem('pendingDeletions') || '[]');
        pendingDeletions.push(id);
        localStorage.setItem('pendingDeletions', JSON.stringify(pendingDeletions));

        setItems(prevItems => {
          const updatedItems = prevItems.filter(item => item._id !== id);
          localStorage.setItem('items', JSON.stringify(updatedItems));
          return updatedItems;
        });

        if (Notification.permission === 'granted') {
          new Notification("Item deleted locally", {
            body: 'You are offline. Item will be deleted from the server when you are back online.',
            icon: '/icon-144.png'
          });
        }
      }
    } catch (error) {
      console.error('Error deleting item', error);
      if (Notification.permission === 'granted') {
        new Notification("Error deleting item", {
          body: 'Deleting item failed. Please try again later.',
          icon: '/icon-144.png'
        });
      }
    }
  }, []);

  const handleEditItem = async (id: string) => {
    try {
      if (navigator.onLine) {
        await voiceChefApi.put(`/items/${id}`, {
          userId: user?.sub,
          item: editItemName,
          quantity: editItemQuantity,
          unit: editItemUnit,
          store: editItemStore
        });
        setItems(prevItems => {
          const updatedItems = prevItems.map(item => {
            if (item._id === id) {
              return {
                ...item,
                item: editItemName,
                quantity: editItemQuantity,
                unit: editItemUnit,
                store: editItemStore
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
      } else {
        let offlineEdits = JSON.parse(localStorage.getItem('offlineEditesItems') || '[]');
        offlineEdits.push({
          id, data: {
            item: editItemName,
            quantity: editItemQuantity,
            unit: editItemUnit,
            store: editItemStore
          }
        });
        const updatedItems = items.map(item => {
          if (item._id === id) {
            return {
              ...item,
              item: editItemName,
              quantity: editItemQuantity,
              unit: editItemUnit,
              store: editItemStore
            };
          }
          return item;
        });
        setItems(updatedItems);

        localStorage.setItem('offlineEditesItems', JSON.stringify(offlineEdits));

        console.log("Item edit saved locally.")
        setEditItemId(null);
        setEditItemName('');
        setEditItemQuantity(0);
        setEditItemUnit('');
        setEditItemStore('');
      }
    } catch (error) {
      console.error('Error updating item', error);
      if (Notification.permission === 'granted') {
        new Notification("Error updating item", {
          body: 'Updating item failed. Please try again later.',
          icon: '/icon-144.png'
        });
      }
    }
  };

  const syncOfflineItems = async () => {
    if (navigator.onLine) {
      const offlineItems = JSON.parse(localStorage.getItem('offlineItems') || '[]');
      if (offlineItems.length > 0) {
        try {
          for (const item of offlineItems) {
            await voiceChefApi.post('/items', item);
          }
          localStorage.removeItem('offlineItems');
          console.log('Offline items synced successfully');
          fetchItems();
        } catch (error) {
          if (Notification.permission === 'granted') {
            new Notification("Error syncing edits", {
              body: 'Syncing edits failed. Please try again later.',
              icon: '/icon-144.png'
            });
          }
          console.error('Error syncing offline items', error);
        }
      }
    } else {
      setItems(JSON.parse(localStorage.getItem('items') || '[]'));
    }
  };

  const synchronizePendingDeletions = async () => {
    if (navigator.onLine) {
      const pendingDeletionsString = localStorage.getItem('pendingDeletions');
      if (!pendingDeletionsString) return;

      const pendingDeletions = JSON.parse(pendingDeletionsString);
      for (const id of pendingDeletions) {
        try {
          await voiceChefApi.delete(`/items/${id}`);
        } catch (error) {
          if (Notification.permission === 'granted') {
            new Notification("Error syncing edits", {
              body: 'Syncing edits failed. Please try again later.',
              icon: '/icon-144.png'
            });
          }
          console.error(`Error synchronizing deletion for item ${id}`, error);
        }
      }
      localStorage.removeItem('pendingDeletions');
    }
  };

  const syncOfflineEdits = async () => {
    if (navigator.onLine) {
      const offlineEdits = JSON.parse(localStorage.getItem('offlineEditesItems') || '[]');
      for (const edit of offlineEdits) {
        try {
          await voiceChefApi.put(`/items/${edit.id}`, edit.data);
          fetchItems();
        } catch (error) {
          if (Notification.permission === 'granted') {
            new Notification("Error syncing edits", {
              body: 'Syncing edits failed. Please try again later.',
              icon: '/icon-144.png'
            });
          }
          console.error('Error syncing edit', error);
        }
      }
      localStorage.removeItem('offlineEditesItems');
    }
  };

  useEffect(() => {
    window.addEventListener('online', syncOfflineItems);
    window.addEventListener('online', synchronizePendingDeletions);
    window.addEventListener('online', syncOfflineEdits);
    fetchItems();
    return () => {
      window.removeEventListener('online', syncOfflineItems);
      window.removeEventListener('online', synchronizePendingDeletions);
      window.addEventListener('online', syncOfflineEdits);
    };
  }, []);

  const handleStartEditing = (item: Item) => {
    setEditItemId(item._id);
    setEditItemName(item.item);
    setEditItemQuantity(item.quantity);
    setEditItemUnit(item.unit);
    setEditItemStore(item.store);
  };

  const handleCancelEditing = () => {
    setEditItemId(null);
    setEditItemName('');
    setEditItemQuantity(0);
    setEditItemUnit('');
    setEditItemStore('');
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
      height: { xs: '50vh', sm: '95vh', lg: '100vh' }
    }}>
      {responsive ?
        <Grid item xs={12} lg={1} sx={{ height: { xs: '0%', lg: '100%' } }}>
          <SideMenu />
        </Grid>
        :
        <Grid item
          xs={12}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            padding: 2,
            backgroundColor: '#1F1D2B',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
          }}
        >
          <IconButton
            onClick={() => { setOpenMenu(true) }}
          >
            <MenuIcon sx={{ color: '#fff' }} />
          </IconButton>
          <Drawer
            open={openMenu}
            onClose={() => setOpenMenu(false)}
            PaperProps={{
              sx: {
                backgroundColor: 'transparent',
                width: {
                  xs: '60%',
                  sm: '40%',
                  md: '30%',
                  lg: '20%'
                }
              }
            }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <SideMenu />
            </Box>
          </Drawer>
        </Grid>
      }

      <Grid item xs={12} lg={11} sx={{
        overflowY: responsive ? 'scroll' : 'none',
        height: '100%',
        paddingBottom: 8,
        paddingTop: 3
      }}>
        <Grid item xs={12} lg={12} sx={{ height: '100%', paddingBottom: 8, paddingTop: 3, paddingLeft: 2, paddingRight: 2 }}>
          <Grid sx={{
            display: 'flex',
            flexDirection: responsive ? 'row' : 'column',
            justifyContent: 'space-evenly',
            paddingLeft: '5%',
            paddingRight: '5%',
            rowGap: responsive ? 15 : 3,
            columnGap: responsive ? 2 : 0,
            paddingTop: responsive ? '150px' : 2
          }}>
            <Grid item xs={12} lg={2.5} sx={{ height: '100%' }}>
              <SideMenuShops items={items} onStoreSelect={handleStoreSelect} selectedStore={selectedStore} />
            </Grid>
            <Grid item xs={12} lg={8}>
              <ItemTable
                items={filteredItems}
                selectedStore={selectedStore}
                editItemId={editItemId}
                editItemName={editItemName}
                editItemQuantity={editItemQuantity}
                editItemUnit={editItemUnit}
                editItemStore={editItemStore}
                newItemName={newItemName}
                newItemQuantity={newItemQuantity}
                newItemUnit={newItemUnit}
                setEditItemName={setEditItemName}
                setEditItemQuantity={setEditItemQuantity}
                setEditItemUnit={setEditItemUnit}
                setEditItemStore={setEditItemStore}
                setNewItemName={setNewItemName}
                setNewItemQuantity={setNewItemQuantity}
                setNewItemUnit={setNewItemUnit}
                handleEditItem={handleEditItem}
                handleDeleteItem={handleDeleteItem}
                handleStartEditing={handleStartEditing}
                handleStartStoreEditing={handleStartStoreEditing}
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
