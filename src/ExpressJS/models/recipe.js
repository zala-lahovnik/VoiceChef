import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    type: [{
        title: { type: String },
        links: [{ text: { type: String } }]
    }],
    times: [{
        label: { type: String },
        time: { type: String }
    }],
    numberOfPeople: { type: String },
    ingredients: [{
        quantity: { type: Number },
        unit: { type: String },
        description: { type: String }
    }],
    steps: [{
        step: { type: Number },
        text: { type: String }
    }],
    img: { type: String }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
