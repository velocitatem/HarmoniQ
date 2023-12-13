const axios = require('axios');
require('dotenv').config();
// use client id and secret to get token
const auth = axios.create({
    baseURL: 'https://accounts.spotify.com/api/token',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: {
        grant_type: 'client_credentials'
    },
    auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET
    },
    method: 'POST'
});

auth().then(response => {
    console.log(response.data);
    const { access_token: token } = response.data;
    fullCallback(token);
})




const fullCallback = (token) => {

    const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
    };

    const params = {
    "limit": 20,
    "market": "ES",
        "seed_genres": "reggaeton,latin,hip-hop,party,pop",
        "target_danceability": 0.6182040816326532,
    "min_danceability": 0.166,
    "max_danceability": 0.887,
    "target_energy": 0.7028979591836735,
    "min_energy": 0.31,
    "max_energy": 0.97,
    "target_key": 5.346938775510204,
    "min_key": 0,
    "max_key": 11,
    "target_loudness": -6.354632653061224,
    "min_loudness": -16.765,
    "max_loudness": -2.758,
    "target_mode": 0.4897959183673469,
    "min_mode": 0,
    "max_mode": 1,
    "target_speechiness": 0.08924897959183675,
    "min_speechiness": 0.0261,
    "max_speechiness": 0.346,
    "target_acousticness": 0.17592779591836735,
    "min_acousticness": 0.000313,
    "max_acousticness": 0.854,
    "target_instrumentalness": 0.020782531836734695,
    "min_instrumentalness": 0,
    "max_instrumentalness": 0.365,
    "target_liveness": 0.21423265306122447,
    "min_liveness": 0.0642,
    "max_liveness": 0.575,
    "target_valence": 0.5566122448979594,
    "min_valence": 0.121,
    "max_valence": 0.961,
    "target_tempo": 125.703,
    "min_tempo": 79.994,
    "max_tempo": 188.155
    }


    params.target_mode = Math.round(params.target_mode);
    params.target_key = Math.round(params.target_key);

    axios.get('https://api.spotify.com/v1/recommendations', { headers, params })
    .then(response => {
        console.log(response.data);
        const fs = require('fs');
        fs.writeFile("test.json", JSON.stringify(response.data), function(err) {
            if (err) {
                console.log(err);
            }
        });

    })
    .catch(error => {
        console.log(error.response.data);
    });
}
