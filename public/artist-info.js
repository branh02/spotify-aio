function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function capitalizeWords(str) {
  return str.replace(/\b(\w)/g, s => s.toUpperCase());
}

function shortenText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}
  
  const artistId = getQueryParam('artistId');
  
  fetch(`/artist-info/${artistId}`)
    .then(response => response.json())
    .then(artist => {
      const container = document.getElementById('artist-info-container');
  
      const img = document.createElement('img');
      img.src = artist.images[0].url;
      img.className = 'artist-info-image';
  
      const name = document.createElement('h1');
      name.textContent = artist.name;
      name.className = 'artist-info-name';
  
      // Stats container
      const statsContainer = document.createElement('div');
      statsContainer.className = 'stats-container';
  
      // Followers
      const followersStat = document.createElement('div');
      followersStat.className = 'stat';
      const followersNumber = document.createElement('strong');
      followersNumber.textContent = artist.followers.total.toLocaleString();
      const followersLabel = document.createElement('span');
      followersLabel.textContent = 'Followers';
      followersStat.appendChild(followersNumber);
      followersStat.appendChild(followersLabel);
  
      // Genres
      const genresStat = document.createElement('div');
      genresStat.className = 'stat';
      const genresText = document.createElement('strong');
      genresText.textContent = capitalizeWords(artist.genres.join(', '));
      const genresLabel = document.createElement('span');
      genresLabel.textContent = 'Genres';
      genresStat.appendChild(genresText);
      genresStat.appendChild(genresLabel);
      genresText.textContent = shortenText(genresText.textContent, 100);
      genresText.className = 'genres-text';
      genresText.title = genresText.textContent;
      // Popularity
      const popularityStat = document.createElement('div');
      popularityStat.className = 'stat';
      const popularityNumber = document.createElement('strong');
      popularityNumber.textContent = `${artist.popularity}%`;
      const popularityLabel = document.createElement('span');
      popularityLabel.textContent = 'Popularity';
      popularityStat.appendChild(popularityNumber);
      popularityStat.appendChild(popularityLabel);
  
      // Append all stats
      statsContainer.appendChild(followersStat);
      statsContainer.appendChild(genresStat);
      statsContainer.appendChild(popularityStat);
  
      // Append elements to the container
      container.appendChild(img);
      container.appendChild(name);
      container.appendChild(statsContainer);
    })
    .catch(error => console.error('Error:', error));
  