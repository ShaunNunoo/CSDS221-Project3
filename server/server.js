import Images from './Images'
const express = require('express')
const app = express()
app.use(express.static(path.join(__dirname, 'public')))

app.get("/api", (req, res) => {
    res.json({ "users": ["user1", "user2", "user3"] })
})

app.listen(5000, () => { console.log("Server started on port 5000") })