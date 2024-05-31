import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    store: { type: String, required: true }
});

const Item = mongoose.model('Item', ItemSchema);

export default Item;