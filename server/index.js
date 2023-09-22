const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });



const routes = [
    {
        method: 'GET',
        path: '/spotify/auth/callback',
        handler: async (request, res) => {
            const { code } = request.query;
            const client_id = process.env.CLIENT_ID;
            const client_secret = process.env.CLIENT_SECRET;
            const redirect_uri = process.env.REDIRECT_URI;
            const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
            const spotify = new Spotify();
            const { access_token, refresh_token } = await spotify.authorizationCodeGrant(code);
            const user = await spotify.getMe(access_token);
            const { id, display_name, email } = user.body;
            const newUser = {
                spotifyId: id,
                displayName: display_name,
                email,
                accessToken: access_token,
                refreshToken: refresh_token
            };
            const updateResponse = await db.collection('users').updateOne(
                { spotifyId: id },
                { $set: newUser },
                { upsert: true }
            );
            res.json({
                message: 'success',
                data: newUser
            });
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
