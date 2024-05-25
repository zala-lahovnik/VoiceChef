import express from 'express';
import Item from "../models/Item.js";

const router = express.Router();

// POST: Create a new shopping list item
router.post('/', async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: 'An error occurred while creating an item.' });
    }
});

// GET: Get all shopping list items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching items.' });
    }
});

// GET: Get a specific shopping list item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found.' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the item.' });
    }
});

// PUT: Update a specific shopping list item by ID
router.put('/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) {
            return res.status(404).json({ error: 'Item not found.' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: 'An error occurred while updating the item.' });
    }
});

// DELETE: Delete a specific shopping list item by ID
router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found.' });
        }
        res.status(200).json({ message: 'Item deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the item.' });
    }
});

export default router;