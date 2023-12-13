const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config();
// const port = process.env.PORT || 3000;

const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const event = 'extraqueso'

// get all the users
const getUsers = async () => {
    try {
        if (client) {
            await client.close();
        }
        try {
            await client.connect();
        } catch (error) {
            console.log(error);
        }

        const db = client.db('harmoniQ');
        const users = db.collection('users');
        let data = await users.find({ 'event': event
                                    }).toArray();
        // there might be duplicates of users, so we filter them out by getting the latest one by signupDate
        data = data.sort((a, b) => new Date(b.signupDate) - new Date(a.signupDate)); // sort by signupDate
        // filter out duplicates
        client.close();
        const seen = new Set();
        data = data.filter(user => {
            const duplicate = seen.has(user.id);
            seen.add(user.id);
            return !duplicate;
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

const fs = require('fs');
const saveJSON = (data, name) => {
    fs.writeFile(name+".json", JSON.stringify(data), function(err) {
        if (err) {
            console.log(err);
        }
    });
}



/*

const params = {
  'limit': 20,
  'market': 'ES',  // Replace with the desired market/country code
  'seed_artists': '4NHQUGzhtTLFvgF5SZesLK',  // Replace with seed artists
  'target_danceability': 0.690,
  'min_danceability': 0.323,
  'max_danceability': 0.874,
  'target_energy': 0.665,
  'min_energy': 0.31,
  'max_energy': 0.911,
  'target_loudness': -8.33,
  'min_loudness': -14.821,
  'max_loudness': -3.646,
  'target_speechiness': 0.063,
  'min_speechiness': 0.0268,
  'max_speechiness': 0.189,
  'target_acousticness': 0.135,
  'min_acousticness': 0.00134,
  'max_acousticness': 0.793,
  'target_instrumentalness': 0.185,
  'min_instrumentalness': 0.0,
  'max_instrumentalness': 0.904,
  'target_liveness': 0.151,
  'min_liveness': 0.0293,
  'max_liveness': 0.508,
  'target_valence': 0.576,
  'min_valence': 0.135,
  'max_valence': 0.962,
  'target_tempo': 124.81,
  'min_tempo': 88.825,
  'max_tempo': 188.155,
  'target_key': 2,
  'min_key': 0,
  'max_key': 11,
  'target_mode': 0,
  'min_mode': 0,
  'max_mode': 1
};
  */
const computeParams = (features) => {
  const audioFeatures = features.audio_features;

  // Initialize variables to hold sum and count for each feature
  const sum = {}, count = {}, min = {}, max = {};
  audioFeatures.forEach(feature => {
    for (const [key, value] of Object.entries(feature)) {
      // Skip non-numeric and irrelevant features
      if (typeof value !== 'number' || ['type', 'id', 'uri', 'track_href', 'analysis_url', 'duration_ms', 'time_signature'].includes(key)) {
        continue;
      }
      sum[key] = (sum[key] || 0) + value;
      count[key] = (count[key] || 0) + 1;
      min[key] = min[key] !== undefined ? Math.min(min[key], value) : value;
      max[key] = max[key] !== undefined ? Math.max(max[key], value) : value;
    }
  });

  // Calculate averages
  const avg = {};
  for (const key in sum) {
    avg[key] = sum[key] / count[key];
  }

  // Construct the params object
  const params = {
    limit: 20,
    market: 'US',  // Replace with the desired market/country code
    seed_artists: '4NHQUGzhtTLFvgF5SZesLK'  // Replace with seed artists
  };

  for (const key in avg) {
    params[`target_${key}`] = avg[key];
    params[`min_${key}`] = min[key];
    params[`max_${key}`] = max[key];
  }

  return params;
};


const validateToken = async (user) => {

    const testToken = axios.create({
        baseURL: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + user.access_token
        },
        method: 'GET'
    });
    // get status code
    let status;
    try {
        let { status: statusCode } = await testToken();
        status = statusCode;
    } catch (error) {
        status = error.response.status;
    }
    console.log(status);
    if (status !== 200) {
        // refresh token
        const refreshToken = axios.create({
            baseURL: 'https://accounts.spotify.com/api/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                grant_type: 'refresh_token',
                refresh_token: user.refresh_token
            },
            auth: {
                username: process.env.CLIENT_ID,
                password: process.env.CLIENT_SECRET
            },
            method: 'POST'
        });
        let { data: newToken } = await refreshToken();
        console.log(newToken);
        // update user in db
        await client.connect();
        const db = client.db('harmoniQ');
        const users = db.collection('users');
        await users.updateOne({ 'id': user.id, 'signupDate': user.signupDate
                                }, { $set: { 'access_token': newToken.access_token } });
        await client.close();
        user = { ...user, 'access_token': newToken.access_token }; // update user
    }
    return user;
}


const getTopTracksForUser = async (user) => {

        // get top tracks
        const topTracks = axios.create({
            baseURL: 'https://api.spotify.com/v1/me/top/tracks',
            headers: {
                'Authorization': 'Bearer ' + user.access_token
            },
            method: 'GET'
        });
        let { data: tracks } = await topTracks();
        return tracks;
    }


const getAPPToken = async () => {
    // get token from client id and secret
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
    const { data: token } = await auth();
    console.log(token);
    return token;
}

const getFeaturesForTracks = async (trackIds, token) => {
    const features = axios.create({
        baseURL: 'https://api.spotify.com/v1/audio-features?ids=' + trackIds.join(','),
        headers: {
            'Authorization': 'Bearer ' + token
        },
        method: 'GET'
    });
    let { data: featuresData } = await features();
    return featuresData;
}

const getTrackGenres = async (trackIds, token) => {
    // split trackIds into chunks of 49
    let artistIDs= [];
    while (trackIds.length > 0) {
        artistIDs.push(trackIds.splice(0, 49));
    }
    // get genres for each chunk
    let trackData = await Promise.all(artistIDs.map(async (ids) => {
        const artists = axios.create({
            baseURL: 'https://api.spotify.com/v1/artists?ids=' + ids.join(','),
            headers: {
                'Authorization': 'Bearer ' + token
            },
            method: 'GET'
        });
        let { data: artistsData } = await artists();
        // get genres
        let genres = artistsData.artists.map(artist => artist.genres);
        return genres;
    }));
    // get track data
    trackData = trackData.flat();
    return trackData;
}




getUsers().then(async (data) => {
    console.log(data);

    let token = await getAPPToken();
    let allTracks = [];
    // async itterate over all users
    Promise.all(data.map(async (user) => {
        user = await validateToken(user);
        console.log(user);
        let tracks = await getTopTracksForUser(user);
        allTracks = [...allTracks, tracks.items];
    })
    ).then(async () => {
        allTracks = allTracks.flat();
        allTracks = allTracks.filter((track, index, self) =>
            index === self.findIndex((t) => (
                t.id === track.id
            ))
        )
        // uniqe track ids
        let trackIds = allTracks.map(track => track.id);
        let trackArtists = allTracks.map(track => track.artists[0].id);

        let trackData = await getTrackGenres(trackArtists, token.access_token);
        saveJSON(trackData, 'trackData');
        let matchGenre = "reggaeton,latin,hip-hop,party,pop".split(',');
        let filteredTracks = [];
        for (let i = 0; i < trackData.length; i++) {
            let genres = trackData[i];
            // if one of maches is in genres
            let match = false;
            genres.forEach(genre => {
                matchGenre.forEach(match => {
                    console.log(genre, match);
                    if (genre.includes(match)) {
                        console.log('match');
                        match = true;
                        filteredTracks.push(trackIds[i]);
                        return;
                    }
                })
            })
        }
        allTracks = [...new Set(filteredTracks)];
        // remove duplicates
        // filter out those that have

        saveJSON(allTracks, 'tracks');
    }).then(async () => {
        let features = await getFeaturesForTracks(allTracks, token.access_token);
        let params = computeParams(features);
        saveJSON(params, 'params');
    });






    // get audio features for all tracks

}).catch((err) => {
            console.log(err);
        }
    );
