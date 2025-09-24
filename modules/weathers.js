const express = require('express');
const { weathers, getNextWeatherID, saveWeather, users } = require('../utils/store');
const router = express.Router();

// GET all weathers
router.get('/', (req, res) => {
    res.send(weathers);
});

// POST weather by uid
router.post('/', (req, res) => {
    let data = req.body; // uid, min, max, szazalek, mm, datum, tipus
    let folytat = true;
    weathers.forEach(weather => {
        if (weather.uid == data.uid && weather.datum == data.datum) {
            folytat = false;
            return res.status(400).send({msg: 'Ehhez a dátumhoz már van felvéve időjárás!'});
        }
    })
    if (folytat) {
        weathers.push(data);
        data.id = getNextWeatherID();
        saveWeather();
        res.status(200).send({msg: 'Időjárás jelentés sikeresen felvéve!'})
    }
});

// GET all weathers by uid
router.get('/:id', (req, res) => {
    id = Number(req.params.id);
    let matchWeathers = [];
    weathers.forEach(weather => {
        if (weather.uid == id) {
            matchWeathers.push(weather);
        }
    });
    res.send(JSON.stringify(matchWeathers));
});

module.exports = router;