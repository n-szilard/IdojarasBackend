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

// PATCH weather by id
router.patch('/modify', (req, res) => {
    let {id, uid, min, max, szazalek, mm, datum, tipus} = req.body;
    let idx = weathers.findIndex(weather => weather.id == id);

/*   TODO: vegigmenni az osszes weatheren, ami stimmel a uidval,
      es ha olyan datumra modositja ami mar letezik,
      kiveve az aktualisan modositott weather, akkor hiba */



    let folytat = true;

    // Az osszes felhasznalohoz tartozo idojaras, kiveve az aktualisan modositott
    let filteredWeather = weathers.filter(weather => weather.uid == uid);
    filteredWeather = filteredWeather.filter(weather => weather.id != id);

    filteredWeather.forEach(weather => {
        if (weather.datum == datum) {
            folytat = false;
            return res.status(400).send({msg: 'A megadott dátumhoz már tartozik egy időjárás!'})
        }
    });

    if (folytat) {
        weathers[idx] = {
            uid: uid,
            min: min,
            max: max,
            szazalek: szazalek,
            mm: mm,
            datum: datum,
            tipus: tipus,
            id: id
        }
        return res.status(200).send({msg: 'Időjárás sikeresen módosítva!'})
    }
});


// DELETE weather by id
router.delete('/del', (req, res) => {
    let id = req.body.id;
    let idx = weathers.findIndex(weather => weather.id == id);

    if (idx > -1) {
        weathers.splice(idx,1);
        saveWeather();
        return res.status(200).send({msg: 'Az időjárás sikeresen törölve!'});
    } else {
        return res.status(400).send({msg: 'Nincs ilyen azonosítójú időjárás!'})
    }
})

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