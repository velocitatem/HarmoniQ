const axios = require('axios');
const token = "BQA84ygajtybVRl6KmWUN7dy9V6AqWvT9NRZJ1cWRbNX3V0xTWEZNgadcyzl9dZfuC_Y8LtjjK_DpWiuCwS1QbURMjRr-wG5TQIDdGDW8Xe42K7KxOk";
// Replace with your Spotify access token
const USERTOKEN = "BQB05gsrF2IqcLq5SVGhVQiBAUI2IiVPMeWsMtL1sHCNuCQMQzHmCe1Ny25PXk9WXt2Vz5nH7c5izNBhIUpzLKijPkUAncMcmhwCP1-G0wEXcRwrhh56mht4N9dUYA4nvAZGanF6cwpvHi9zSmFa9m4I34HKfEHeKRkMJ-hd68p0QSDsuPJsVwe5sK1eYoZBfn6nP0DdAbsLYCgtNi-Y69npGLvi6qoDWcPjjQ";


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
      // create a playlist spotify:user:7o62h9dyfomalrk3hq9i91kn8
        // https://api.spotify.com/v1/users/7o62h9dyfomalrk3hq9i91kn8/playlists

      axios.post('https://api.spotify.com/v1/users/7o62h9dyfomalrk3hq9i91kn8/playlists', {
        "name": "New Playlist",
        "description": "New playlist description",
        "public": false
        }, {
        headers: {
            'Authorization': `Bearer ${USERTOKEN}`,
            'Content-Type': 'application/json'
        },
        })
        .then(res1 => {
            /// add tracks to playlist
            console.log(response.data);
            console.log(res1.data);
            const playlist_id = res1.data.id;
            const tracks = response.data.tracks.map(track => track.uri);
            console.log(tracks);
            axios.post(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
                "uris": tracks
            }, {
                headers: {
                    'Authorization': `Bearer ${USERTOKEN}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(res2 => {
                console.log(res2.data);
            })

        })


  })
  .catch(error => {
    console.log(error.response.data);
  });
