const express = require('express')
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const app = express()
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));

var addresses = [];
var users = [];

const getUser = function(UUID){
    return users.find(user => user.id == UUID);
}
/*
app.post('/gameRequest', (req, res) =>{
    const user = getUser(req.body.UUID);
    const newGame = new GameEvent(1,[user]);
    GameEvents.push(newGame);
    res.json(newGame.gameID);
});
app.get('/getGameData', (req, res) =>{
    const user = getUser(req.body.UUID);
    const newGame = new GameEvent(1,[user]);
    GameEvents.push(newGame);
    res.json(GameEvents);
});*/

app.post('/removeUserID', (req, res) => {
    users = users.filter(user => user.id != req.body.UUID);
    res.send(req.body.UUID);
});

app.post('/incrementPlanet', (req, res) => {
    const user = getUser(req.body.UUID);
    user.selectedPlanet+= 1;
  
});

app.post('/decrementPlanet', (req, res) => {
    const user = getUser(req.body.UUID);
    user.selectedPlanet-= 1;
  
});


app.post('/getPlanet', (req, res) => {
    const user = getUser(req.body.UUID);
    res.json(user.selectedPlanet);
});

app.post('/setQueue', (req, res) => {
    const user = getUser(req.body.UUID);
    user.name = req.body.name;
    user.gameSize = req.body.gameSize;
    user.gameSize = req.body.gameSize;
});

app.post('/userID', (req, res) => {

    var UUID = req.body.UUID;
    if (UUID == "") {
        UUID = uuidv4();
        res.json(UUID);
    }

    if (!addresses.includes(UUID)) {
        addresses.push(UUID);
        users.push(
            {
                id: UUID,
                name: "",
                selectedPlanet: 2,
                gameSize: 4,
                screen: "logo",
                gameData: {
                    mousePos: { x: 0, y: 0 },
                    health: 100
                },
            });

    }

});

app.post('/setScreen', (req, res) => {
    const user = getUser(req.body.UUID);
    user.screen = req.body.data;
    res.json(true);

});
app.post('/getScreen', (req, res) => {
    const user = getUser(req.body.UUID);
    res.json( user.screen);

});


app.get('/', (req, res) => {
    res.json(users);
});


app.listen(5000, () => { console.log("Server started on port 5000") })



