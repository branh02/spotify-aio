document.getElementById('login-button').addEventListener('click', () => {
    window.location.href = 'http://localhost:8888/login';
});

document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayTopTracks();
    fetchAndDisplayTopArtists();
});

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.hash === '#authenticated') {
      var mainHeader = document.querySelector('.main-header');
      mainHeader.style.display = 'block';
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('tracks-container').style.display = 'block';
      document.getElementById('user-profile').style.display = 'block';
      fetchAndDisplayTopTracks();
      fetchAndDisplayUserData();
      fetchAndDisplayTopArtists();
      fetchAndDisplayPlaylistData();
  }

  document.getElementById('login-button').addEventListener('click', () => {
      window.location.href = 'http://localhost:8888/login';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.hash === '#authenticated') {
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('tracks-container').style.display = 'block';
      document.getElementById('artists-container').style.display = 'block'; 
      fetchAndDisplayTopTracks();
      fetchAndDisplayTopArtists();
  }
});

function displayTracks(tracks) {
  const container = document.getElementById('tracks-container');
  container.innerHTML = '';

  tracks.forEach(track => {
      const trackDiv = document.createElement('div');
      trackDiv.className = 'track';

      const img = document.createElement('img');
      img.src = track.image;
      img.alt = `Cover of ${track.name}`;
      img.className = 'track-image';

      const infoButton = document.createElement('i');
      infoButton.className = 'track-info-bttn';
      infoButton.textContent = 'i'
      infoButton.style.display = 'none';
      infoButton.onclick = () => {
        const trackInfoUrl = `track-info.html?trackId=${encodeURIComponent(track.id)}`;
        window.open(trackInfoUrl, '_blank');
      };

      const name = document.createElement('span');
      name.textContent = track.name;
      name.className = 'track-name';

      trackDiv.appendChild(img);
      trackDiv.appendChild(name);
      trackDiv.appendChild(infoButton);
      container.appendChild(trackDiv);

      // Make sure these event listeners are correctly set
      trackDiv.onmouseenter = function() {
          infoButton.style.display = 'block'; // Show the button on mouse enter
      };
      trackDiv.onmouseleave = function() {
          infoButton.style.display = 'none'; // Hide the button on mouse leave
      };
  });
}

function fetchAndDisplayTopTracks() {
  fetch('/top-tracks') 
    .then(response => response.json())
    .then(data => {
      if (data.tracks) {
        displayTracks(data.tracks);
      }
    })
    .catch(error => console.error('Error:', error));
}

function displayArtists(artists) {
  const container = document.getElementById('artists-container');
  container.innerHTML = '';

  artists.forEach(artist => {
    const artistDiv = document.createElement('div');
    artistDiv.className = 'artist';

    const img = document.createElement('img');
    img.src = artist.image;
    img.alt = `Cover of ${artist.name}`
    img.className = 'artist-image'

    const infoButton = document.createElement('i')
    infoButton.className = 'artist-info-bttn';
    infoButton.textContent = 'i'
    infoButton.style.display = 'none';
    infoButton.onclick = () => {
      window.location.href = `artist-info.html?artistId=${artist.id}`;
    };    
    
    const name = document.createElement('span')
    name.textContent = artist.name;
    name.className = 'artist-name';

    artistDiv.appendChild(img)
    artistDiv.appendChild(name);
    artistDiv.appendChild(infoButton);
    container.appendChild(artistDiv);

    artistDiv.onmouseenter = () => infoButton.style.display = 'block';
    artistDiv.onmouseleave = () => infoButton.style.display = 'none'
  })
}

function fetchAndDisplayTopArtists() {
  fetch('/top-artists')
    .then(response => response.json())
    .then(data => {
      if (data.artists) {
        displayArtists(data.artists)
      }
    })
    .catch(error => console.error('Error:', error))
}

function fetchAndDisplayUserData() {
  fetch('/user-data') 
    .then(response => response.json())
    .then(data => {
      const profilePicUrl = data.images[1].url;
      const displayName = data.display_name;
      const userId = data.id;
      const followers = data.followers.total;
      const spotifyUrl = data.external_urls.spotify;

      document.getElementById('user-profile-picture').src = profilePicUrl;
      document.getElementById('user-profile-link').href = spotifyUrl;
      const userStatsNumber = document.querySelector('.user-stats .user-stats-number');
      userStatsNumber.textContent = followers;
      
      document.getElementById('user-details').textContent = `${displayName}`;
    })
    .catch(error => console.error('Error:', error));
}

function fetchAndDisplayPlaylistData() {
  fetch('/playlist-info') 
    .then(response => response.json())
    .then(data => {
      const totalPlaylist = data.total;
      const userStatsNumber2 = document.querySelector('.user-stats .user-stats-number2');
      userStatsNumber2.textContent = totalPlaylist;

    })
    .catch(error => console.error('Error:', error));
}

// document.getElementById('user-followers').getElementsByClassName('user-stats-number')[0].textContent = followers;
