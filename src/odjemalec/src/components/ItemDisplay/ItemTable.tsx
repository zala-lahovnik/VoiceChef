import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableContainer, TableRow, Paper, Typography, TextField, Button } from "@mui/material";
import ItemRow from './ItemRow';
import { Item } from "../../utils/itemTypes";

interface ItemTableProps {
    items: Item[];
    selectedStore: string | null;
    editItemId: string | null;
    editItemName: string;
    editItemQuantity: number;
    editItemUnit: string;
    editItemStore: string; // New state for edited store
    newItemName: string;
    newItemQuantity: number;
    newItemUnit: string;
    setEditItemName: (name: string) => void;
    setEditItemQuantity: (quantity: number) => void;
    setEditItemUnit: (unit: string) => void;
    setEditItemStore: (store: string) => void; // Function to set edited store
    setNewItemName: (name: string) => void;
    setNewItemQuantity: (quantity: number) => void;
    setNewItemUnit: (unit: string) => void;
    handleEditItem: (id: string) => void;
    handleDeleteItem: (id: string) => void;
    handleStartEditing: (item: Item) => void;
    handleCancelEditing: () => void;
    handleAddNewItem: () => void;
    handleStartStoreEditing: (item: Item) => void; // Function to start editing store
    isEditing: (id: string) => boolean;
}

const ItemTable: React.FC<ItemTableProps> = ({
    items,
    selectedStore,
    editItemId,
    editItemName,
    editItemQuantity,
    editItemUnit,
    editItemStore,
    newItemName,
    newItemQuantity,
    newItemUnit,
    setEditItemName,
    setEditItemQuantity,
    setEditItemUnit,
    setEditItemStore,
    setNewItemName,
    setNewItemQuantity,
    setNewItemUnit,
    handleEditItem,
    handleDeleteItem,
    handleStartEditing,
    handleCancelEditing,
    handleAddNewItem,
    handleStartStoreEditing,
    isEditing,
}) => {
    // State to manage checked items
    const [checkedItems, setCheckedItems] = useState<string[]>([]);

    // Function to toggle checked state of an item
    const toggleCheck = (itemId: string) => {
        if (checkedItems.includes(itemId)) {
            setCheckedItems(checkedItems.filter(id => id !== itemId));
        } else {
            setCheckedItems([...checkedItems, itemId]);
        }
    };

    // Render Add New Item section only if selectedStore is null
    const renderAddNewItemSection = selectedStore !== 'Uncategorized' && (
        <>
            <Typography sx={{ fontSize: '24px', padding: 1, marginBottom: 1, textAlign: 'center', color: '#fff' }}>
                Add New Item
            </Typography>
            <TableContainer component={Paper} sx={{ marginBottom: '16px', backgroundColor: '#1F1D2B' }}>
                <Table sx={{ minWidth: 650 }} aria-label="add new item table">
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">
                                <TextField
                                    label={'Item name'}
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Item Name"
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{
                                        style: {
                                            color: 'white',
                                            borderColor: 'white',
                                        },
                                    }}
                                    sx={{
                                        color: 'white',
                                        '& .MuiInputLabel-root': { color: 'white' },
                                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white',
                                        },
                                    }} />
                            </TableCell>
                            <TableCell align="center">
                                <TextField
                                    label='Quantity'
                                    value={newItemQuantity}
                                    onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Quantity"
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{
                                        style: {
                                            color: 'white',
                                            borderColor: 'white',
                                        },
                                    }}
                                    sx={{
                                        color: 'white',
                                        '& .MuiInputLabel-root': { color: 'white' },
                                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white',
                                        },
                                    }} />
                            </TableCell>
                            <TableCell align="center">
                                <TextField
                                    label='Unit'
                                    value={newItemUnit}
                                    onChange={(e) => setNewItemUnit(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Unit"
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{
                                        style: {
                                            color: 'white',
                                            borderColor: 'white',
                                        },
                                    }}
                                    sx={{
                                        color: 'white',
                                        '& .MuiInputLabel-root': { color: 'white' },
                                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white',
                                        },
                                    }} />
                            </TableCell>
                            <TableCell align="center">
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#c17c37',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#b56929',
                                        },
                                    }}
                                    onClick={handleAddNewItem}
                                >
                                    Add
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );

    return (
        <>
            {renderAddNewItemSection}
            <TableContainer component={Paper} sx={{ marginBottom: '16px' }}>
                <Table sx={{ minWidth: 650, backgroundColor: '#1F1D2B' }} aria-label="shopping item table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="center">
                                <Typography sx={{ fontSize: '24px', padding: 1, marginBottom: 1, textAlign: 'center', color: '#fff' }}>
                                    Item
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography sx={{ fontSize: '24px', padding: 1, marginBottom: 1, textAlign: 'center', color: '#fff' }}>
                                    Quantity
                                </Typography>
                            </TableCell>
                            {(selectedStore === "Uncategorized" || selectedStore === null) && (
                                <TableCell align="center">
                                    <Typography sx={{ fontSize: '24px', padding: 1, marginBottom: 1, textAlign: 'center', color: '#fff' }}>
                                        Store
                                    </Typography>
                                </TableCell>
                            )}
                            <TableCell align="center">
                                <Typography sx={{ fontSize: '24px', padding: 1, marginBottom: 1, textAlign: 'center', color: '#fff' }}>
                                    Actions
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <ItemRow
                                key={item._id}
                                item={item}
                                selectedStore={selectedStore}
                                editItemId={editItemId}
                                editItemName={editItemName}
                                editItemQuantity={editItemQuantity}
                                editItemUnit={editItemUnit}
                                editItemStore={editItemStore} // Pass edited store name
                                setEditItemName={setEditItemName}
                                setEditItemQuantity={setEditItemQuantity}
                                setEditItemUnit={setEditItemUnit}
                                setEditItemStore={setEditItemStore} // Pass setter for edited store name
                                handleEditItem={handleEditItem}
                                handleDeleteItem={handleDeleteItem}
                                handleStartEditing={handleStartEditing}
                                handleCancelEditing={handleCancelEditing}
                                isEditing={isEditing}
                                isChecked={checkedItems.includes(item._id)} // Pass isChecked state
                                toggleCheck={() => toggleCheck(item._id)} // Pass toggleCheck function
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ItemTable;