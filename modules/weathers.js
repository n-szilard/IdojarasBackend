const express = require('express');
const { weathers, getNextWeatherID, saveWeather } = require('../utils/store');
const router = express.Router();

// GET all weathers
router.get('/', (req, res) => {
    res.send(weathers);
});

// POST weather by uid
router.post('/', (req, res) => {
    let data = req.body; // uid, min, max, szazalek, mm, datum, tipus
    weathers.forEach(weather => {
        if (weather.uid == data.uid && weather.datum == data.datum) {
            return res.status(400).send('Ehhez a dátumhoz már van felvéve időjárás!');
        }
    })
    weathers.push(data);
    data.id = getNextWeatherID();
    saveWeather();
    res.send({msg: 'Időjárás jelentés sikeresen felvéve!'})
})

module.exports = router;