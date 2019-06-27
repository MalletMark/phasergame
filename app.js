const express = require('express')
const app = express()
const path = require('path');
const port = 3000

app.use('/tutorial', express.static(path.join(__dirname, 'tutorial')))
app.use('/tutorial2', express.static(path.join(__dirname, 'tutorial2')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))