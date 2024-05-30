import mongoose from 'mongoose';

const favoritesSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    favorites: { type: Array, required: true }
});

const Favorites = mongoose.model('Favorites', favoritesSchema);

export default Favorites;