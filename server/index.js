const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
var Spotify = require('spotify-web-api-js');
const axios = require('axios');

const routes = [
    {
        method: 'GET',
        path: '/spotify/auth',
        handler: async (request, res) => {
            const client_id = process.env.CLIENT_ID;
            const { event } = request.query;
            const redirect_uri = "http://localhost:3000/spotify/auth/callback/"+event;
            let scopes = [
                'user-read-private',
                'user-read-email',
                'user-library-read',
                'user-top-read'
            ].join(' ');
            res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect_uri)}`);
        }
    },
    {
        path: '/spotify/auth/callback/:event',
        method: 'GET',
        handler: async (request, res) => {
            console.log(request.query);
            const { code } = request.query;
            const { event } = request.params;
            // const client_id = process.env.CLIENT_ID;
            // const client_secret = process.env.CLIENT_SECRET;
            // auth with spotify
            const auth = axios.create({
                baseURL: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
                },
                params: {
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: 'http://localhost:3000/spotify/auth/callback/' + event
                },
                method: 'POST'
            });
            const { data } = await auth();
            console.log(data);
            // get user info via http
            const userData = axios.create({
                baseURL: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + data.access_token
                },
                method: 'GET'
            });
            let { data: user } = await userData();
            // save user to db
            user = {
                ...user,
                ...data,
                'signupDate': new Date(),
                'event': event
            }
            // connect to db
            await client.connect();
            const db = client.db('harmoniQ');
            await db.collection('users').insertOne(user);
            await client.close();
            res.json(
                {
                    'message': 'success',
                    'user': user
                }
            )
        }
    },
    {
        method: 'GET',
        path: '/status',
        handler: async (request, res) => {
            res.send('OK');
        }
    },
]

const init = async () => {
    try {
        await client.connect();
        db = client.db('spotify');
        // close the connection after use
        await client.close();
        routes.forEach(route => {
            app[route.method.toLowerCase()](route.path, route.handler);
        });
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

init();
