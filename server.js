const express = require('express');
const request = require('request');
const querystring = require('querystring');
const path = require('path');

const app = express();

const redirect_uri = 'http://localhost:8888/callback'; 
let globalAccessToken = null;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function(req, res) {
  var scope = 'user-top-read user-follow-read playlist-read-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: 'facff0da002542c4866a4d8f81e517e3',
      scope: scope,
      redirect_uri: redirect_uri,
    }));
});

app.get('/callback', function(req, res) {
  var code = req.query.code || null;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from('facff0da002542c4866a4d8f81e517e3' + ':' + '8aca80728aa84fb78ffe05ac83b9157f').toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      globalAccessToken = body.access_token;
      res.redirect('http://localhost:8888/#authenticated');
    } else {
      res.send('Authentication failed.');
    }
  });
});

app.get('/top-tracks', function(req, res) {
  if (!globalAccessToken) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  var options = {
    url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=20',
    headers: { 'Authorization': 'Bearer ' + globalAccessToken },
    json: true
  };

  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const trackData = body.items.map(item => ({
        name: item.name,
        image: item.album.images[0].url,
        id: item.id
      }));
      res.send({ tracks: trackData });
    } else {
      res.send({ error: "Failed to fetch top tracks" });
    }
  });
});

app.get('/top-artists', function(req, res) {
  if (!globalAccessToken) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  var options = {
    url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=20',
    headers: { 'Authorization': 'Bearer ' + globalAccessToken },
    json: true
  }

  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const artistData = body.items.map(item => ({
        name: item.name,
        image: item.images[2].url,
        id: item.id
      }))
      res.send({ artists: artistData});
      // console.log(body)
    } else {
      res.send({ error: "Failed to fetch top artists"})
    }
  })
})

app.get('/playlist-info', function(req, res) {
  if (!globalAccessToken) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  var options = {
    url: 'https://api.spotify.com/v1/me/playlists?limit=50',
    headers: { 'Authorization': 'Bearer ' + globalAccessToken },
    json: true
  }

  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body)
    } else {
      res.send({ error: "Failed to fetch playlist data"})
    }
  })
})

app.get('/user-data', function(req, res) {
  if (!globalAccessToken) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + globalAccessToken },
    json: true
  };

  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body)
    } else {
      res.status(response.statusCode).send({ error: "Failed to fetch user data" });
    }
  });
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

app.get('/artist-info/:id', function(req, res) {
  if (!globalAccessToken) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const artistId = req.params.id;
  var options = {
    url: `https://api.spotify.com/v1/artists/${artistId}`,
    headers: { 'Authorization': 'Bearer ' + globalAccessToken },
    json: true
  };

  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body);
      //console.log(body)
    } else {
      res.status(response.statusCode).send({ error: "Failed to fetch artist info data" });
    }
  });
});

app.get('/track-info/:id', function(req, res) {
  if (!globalAccessToken) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const trackId = req.params.id
  //console.log(trackId)
  var options = {
    url: `https://api.spotify.com/v1/audio-analysis/${trackId}`,
    headers: { 'Authorization': 'Bearer ' + globalAccessToken },
    json: true
  };

  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body)
      //console.log(body)
    } else {
      res.status(response.statusCode).send({ error: "Failed to fetch track info data" });
    }
  })
})

app.get('/track-details/:id', function(req, res) {
  if (!globalAccessToken) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const trackId = req.params.id;
  var options = {
    url: `https://api.spotify.com/v1/tracks/${trackId}`,
    headers: { 'Authorization': 'Bearer ' + globalAccessToken },
    json: true
  };

  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body);
      //console.log(body)
    } else {
      res.status(response.statusCode).send({ error: "Failed to fetch track details" });
    }
  });
});

app.get('/track-audio-features/:id', function(req, res) {
  if (!globalAccessToken) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  const trackId = req.params.id;

  var options = {
    url: `https://api.spotify.com/v1/audio-features/${trackId}`,
    headers: { 'Authorization': 'Bearer ' + globalAccessToken },
    json: true
  };

  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body);
      console.log(body)
    } else {
      res.status(response.statusCode).send({ error: "Failed to fetch track audio features" });
    }
  });


})

console.log('Listening on 8888');
app.listen(8888);
