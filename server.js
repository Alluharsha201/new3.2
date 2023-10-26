const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Connect to your MongoDB Atlas cluster
mongoose.connect('mongodb+srv://alluharsha82:root@cluster0.dz8xwys.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas: ' + err);
  });

// Create a Player model (schema)
const Player = mongoose.model('Player', {
    name: String,
    team: String,
    rushingYards: Number,
    touchdownsThrown: Number,
    sacks: Number,
    fieldGoalsMade: Number,
    fieldGoalsMissed: Number,
    catchesMade: Number,
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint to add a new player
app.post('/players', async (req, res) => {
    try {
        const player = new Player(req.body);
        await player.save();
        res.status(201).json(player);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint to get a list of all players
app.get('/players', async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to get a player by ID
app.get('/players/:id', async (req, res) => {
    const playerId = req.params.id;
    try {
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.json(player);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint to update a player by ID
app.put('/players/:id', async (req, res) => {
    const playerId = req.params.id;
    try {
        const player = await Player.findByIdAndUpdate(playerId, req.body, { new: true });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.json(player);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint to delete a player by ID
app.delete('/players/:id', async (req, res) => {
    const playerId = req.params.id;
    try {
        const player = await Player.findByIdAndRemove(playerId);
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.json(player);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

