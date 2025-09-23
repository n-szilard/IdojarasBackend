const express = require('express');
const fs = require('fs');
const cors = require('cors');

const userRoutes = require('./modules/users');
const weatherRoutes = require('./modules/weathers');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Nagyapáti Szilárd 13.A időjárás api');
});

app.use('/users', userRoutes);
app.use('/weather', weatherRoutes);


app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
})

