import express from 'express';
import Favorites from "../models/favorites.js";

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { id, recipeId } = req.body;

        // Find the user's favorite document
        let usersFavs = await Favorites.findOne({ userId: id });

        if (!usersFavs) {
            // If the document does not exist, create a new one with the recipeId
            usersFavs = new Favorites({ userId: id, favorites: [recipeId] });
        } else {
            // If the document exists, check if the recipeId is already in the array
            const recipeIndex = usersFavs.favorites.indexOf(recipeId);

            if (recipeIndex > -1) {
                // If the recipeId is already in the array, remove it
                usersFavs.favorites.splice(recipeIndex, 1);
            } else {
                // If the recipeId is not in the array, add it
                usersFavs.favorites.push(recipeId);
            }
        }

        // Save the updated document
        await usersFavs.save();

        res.status(200).json(usersFavs);
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: 'An error occurred while updating the favorites.' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const item = await Favorites.find({userId: req.params.id});
        if (!item) {
            return res.status(404).json({ error: 'Item not found.' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the item.' });
    }
});

export default router;