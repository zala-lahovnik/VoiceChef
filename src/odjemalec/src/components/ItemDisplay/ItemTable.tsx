import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableContainer, TableRow, Paper, Typography } from "@mui/material";
import ItemRow from './ItemRow';
import { Item } from "../../utils/itemTypes";
import {StyledTextField} from "../../pages/HomePage";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

interface ItemTableProps {
    items: Item[];
    selectedStore: string | null;
    editItemId: string | null;
    editItemName: string;
    editItemQuantity: number;
    editItemUnit: string;
    editItemStore: string;
    newItemName: string;
    newItemQuantity: number;
    newItemUnit: string;
    setEditItemName: (name: string) => void;
    setEditItemQuantity: (quantity: number) => void;
    setEditItemUnit: (unit: string) => void;
    setEditItemStore: (store: string) => void;
    setNewItemName: (name: string) => void;
    setNewItemQuantity: (quantity: number) => void;
    setNewItemUnit: (unit: string) => void;
    handleEditItem: (id: string) => void;
    handleDeleteItem: (id: string) => void;
    handleStartEditing: (item: Item) => void;
    handleCancelEditing: () => void;
    handleAddNewItem: () => void;
    handleStartStoreEditing: (item: Item) => void;
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
    const [checkedItems, setCheckedItems] = useState<string[]>([]);

    const toggleCheck = (itemId: string) => {
        if (checkedItems.includes(itemId)) {
            setCheckedItems(checkedItems.filter(id => id !== itemId));
        } else {
            setCheckedItems([...checkedItems, itemId]);
        }
    };

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
                                <StyledTextField
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
                                />
                            </TableCell>
                            <TableCell align="center">
                                <StyledTextField
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
                                />
                            </TableCell>
                            <TableCell align="center">
                                <StyledTextField
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
                                />
                            </TableCell>
                            <TableCell align="center">
                                <IconButton
                                    sx={{
                                        backgroundColor: '#d17a22',
                                        color: 'white'
                                    }}
                                    onClick={handleAddNewItem}
                                >
                                    <AddIcon />
                                </IconButton>
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
                        {items.map((item, index) => (
                            <ItemRow
                                key={index}
                                item={item}
                                selectedStore={selectedStore}
                                editItemId={editItemId}
                                editItemName={editItemName}
                                editItemQuantity={editItemQuantity}
                                editItemUnit={editItemUnit}
                                editItemStore={editItemStore}
                                setEditItemName={setEditItemName}
                                setEditItemQuantity={setEditItemQuantity}
                                setEditItemUnit={setEditItemUnit}
                                setEditItemStore={setEditItemStore}
                                handleEditItem={handleEditItem}
                                handleDeleteItem={handleDeleteItem}
                                handleStartEditing={handleStartEditing}
                                handleCancelEditing={handleCancelEditing}
                                isEditing={isEditing}
                                isChecked={checkedItems.includes(item._id)}
                                toggleCheck={() => toggleCheck(item._id)}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ItemTable;