const fs = require('fs');

const data = JSON.parse(fs.readFileSync('test.json', 'utf8'));

const tracks = data.tracks.map(track => {
    return {
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        image: track.album.images[0].url,
        preview: track.preview_url,
        uri: track.uri
    }
}
);

console.log(tracks);
