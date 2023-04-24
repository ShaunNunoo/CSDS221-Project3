
const express = require('express')
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const app = express()

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));

var addresses = [];
var users = [];

app.post('/removeUserID', (req, res) => {
    users = users.filter(user => user.id != req.body.UUID);
    res.send(req.body.UUID);
});

app.post('/userID', (req, res) => {

    const UUID = req.body.UUID;

    if (UUID == "" || !addresses.includes(UUID)) {
        const newUUID = uuidv4();
        users.push(
            {
                id: newUUID,
                name: "",
                selectedPlanet: "Earth",
                gameSize: 4,
                screen: "logo",
                gameData: {
                    mousePos: { x: 0, y: 0 },
                    health: 100
                },
            });
        addresses.push(newUUID);
        res.json(newUUID);
    }

});

app.post('/setScreen', (req, res) => {

    const UUID = req.body.UUID;
    const user = users.find(user => user.id == UUID);
    user.screen = req.body.data;

 
});


app.post('/getScreen', (req, res) => {
    const UUID = req.body.UUID;
    const user = users.find(user => user.id == UUID);
    res.json(user.screen);
 
});


app.get('/', (req, res) => {
    res.json(users);

});



app.listen(5000, () => { console.log("Server started on port 5000") })