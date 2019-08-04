const express = require('express')
const app = express();
const path = require('path');
const port = 3001;

app.use('/tutorial', express.static(path.join(__dirname, 'tutorial')))
app.use('/tutorial2', express.static(path.join(__dirname, 'tutorial2')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/js', express.static(path.join(__dirname, 'js')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))