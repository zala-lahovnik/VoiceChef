import webPush from 'web-push'
import express from "express";


const router = express.Router();

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;


webPush.setVapidDetails(
    process.env.MAILTO_ADDRESS,
    vapidPublicKey,
    vapidPrivateKey,
);

const subscriptions = []

function getRandomCookingTips(numTips) {
    const cookingTips = [
        "Always read the recipe all the way through before you start cooking.",
        "Keep your knives sharp for easier and safer cutting.",
        "Season your food as you go, not just at the end.",
        "Let meat rest after cooking to retain juices.",
        "Use a digital thermometer to ensure your meat is cooked perfectly.",
        "Prep all your ingredients before you start cooking (mise en place).",
        "Clean as you go to keep your workspace organized.",
        "Use fresh herbs for more vibrant flavors.",
        "Save pasta water to add to your sauce for extra flavor and thickness.",
        "Don't overcrowd the pan; cook in batches if necessary.",
        "Use a cast-iron skillet for even heat distribution.",
        "Taste your food frequently to adjust seasoning.",
        "Let bread dough rise in a warm, draft-free place.",
        "Add a pinch of salt to your coffee to reduce bitterness.",
        "Keep a variety of spices on hand to enhance your dishes.",
        "Invest in a good set of measuring spoons and cups.",
        "Use a zester or microplane to add citrus zest for extra flavor.",
        "Store herbs in a glass of water in the fridge to keep them fresh longer.",
        "Don't be afraid to experiment with flavors and ingredients.",
        "Always use a timer to avoid overcooking or burning food.",
        "Marinate meat overnight for deeper flavor penetration.",
        "Soak onions in water before cutting to reduce tear-inducing compounds.",
        "Add a splash of vinegar to boiling water when poaching eggs.",
        "Use parchment paper to prevent baked goods from sticking.",
        "Keep your pantry stocked with essentials like oils, vinegars, and grains.",
        "Use an ice cream scoop for perfectly portioned cookies.",
        "Freeze leftover herbs in olive oil in ice cube trays for easy use.",
        "Always use room temperature ingredients for baking.",
        "Grate cold butter into flour for flakier pastry dough.",
        "Use a potato ricer for lump-free mashed potatoes."
    ];

    for (let i = cookingTips.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cookingTips[i], cookingTips[j]] = [cookingTips[j], cookingTips[i]];
    }

    return cookingTips.slice(0, numTips);
}

router.get('/vapid-public-key', (req, res) => res.send({ publicKey: vapidPublicKey }));


router.post('/subscribe', (req, res) => {
    try {
        const body = JSON.parse(req.body.body)

        const subscriptionData = body.subscription;

        subscriptions.push(subscriptionData);

        res.status(201).json({ message: 'Subscription saved successfully' });
    } catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ error: 'Failed to save subscription' });
    }
});


router.post('/send-notification', (req, res) => {
    const payload = JSON.stringify({ title: req.body.title, body: req.body.body });

    try {
        subscriptions.forEach((subscription) => {
            webPush.sendNotification(subscription, payload)
        })
        res.status(200).send('Notifications sent successfully')
    } catch (error) {
        console.error('Error sending push notification:', error);
        res.status(500).send('Error sending notification');
    }

});


router.get('/cooking-tip', (req, res) => {
    const tip = getRandomCookingTips(1)

    const payload = JSON.stringify({title: "Today's cooking tip:", body: tip})

    try {
        subscriptions.forEach((subscription) => {
            webPush.sendNotification(subscription, payload)
        })
        res.status(200).send('Notifications sent successfully')
    } catch (error) {
        console.error('Error sending push notification:', error);
        res.status(500).send('Error sending notification');
    }

});


export default router;