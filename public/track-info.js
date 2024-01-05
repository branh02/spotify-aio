// track-info.js
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const trackId = getQueryParam('trackId');

fetch(`/track-info/${trackId}`)
    .then(response => response.json())
    .then(data => {
        const trackFeatures = data; // Assuming your data structure matches the one you provided
        const container = document.getElementById('track-info-container');
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container';
        container.innerHTML = ''; // Clear previous data

        // Extract the necessary data
        const duration = trackFeatures.track.duration;
        const durationMin = duration / 60;
        const key = trackFeatures.track.key;
        const mode = trackFeatures.track.mode === 0 ? 'Minor' : 'Major';
        const timeSig = trackFeatures.track.time_signature;

        // Count the array lengths
        const numBars = trackFeatures.bars.length;
        const numBeats = trackFeatures.beats.length;
        const numSections = trackFeatures.sections.length;
        const numSegments = trackFeatures.segments.length;

        // Create elements to display the data
        const infoElements = [
        { label: 'Duration', value: `${durationMin.toFixed(2)} min` },
        { label: 'Key', value: key },
        { label: 'Mode', value: mode },
        { label: 'Time Signature', value: timeSig },
        { label: 'Bars', value: numBars },
        { label: 'Beats', value: numBeats },
        { label: 'Sections', value: numSections },
        { label: 'Segments', value: numSegments }
        ];

        // Append new grid items
        infoElements.forEach(info => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.textContent = `${info.label}: ${info.value}`;
        gridContainer.appendChild(gridItem);
        });

        container.appendChild(gridContainer);
        return fetch(`/track-details/${trackId}`);
    })
    .then(response => response.json())
    .then(trackDetails => {
        const cContainer = document.getElementById('track-data-container');
        cContainer.innerHTML = '';
    
        // Create a container for the track details
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'track-details-container';

        const textContainer = document.createElement('div')
        textContainer.className = 'text-container'
    
        // Now you have the track details like name and images
        const trackName = trackDetails.name;
        const trackImage = trackDetails.album.images[0].url;
        const trackArtist = trackDetails.artists[0].name
        const trackAlbumName = trackDetails.album.name
    
        // Create the name element
        const nameElement = document.createElement('h1');
        nameElement.textContent = trackName;

        nameElement.style.fontSize = '2rem'
        nameElement.style.whiteSpace = 'nowrap'

        nameElement.className = 'track-info-name';
    
        // Create the image object
        const imageElement = new Image();
        imageElement.src = trackImage;

        imageElement.style.borderRadius = '50%';
        imageElement.style.marginBottom = '2rem';
        imageElement.style.objectFit = 'cover';

        imageElement.className = 'track-info-image'; // Apply the CSS class

        const artistElement = document.createElement('h1');
        artistElement.textContent = trackArtist;

        artistElement.style.fontSize = '1.25rem'
        artistElement.style.whiteSpace = 'nowrap'
        artistElement.className = 'track-artist-name'
    
        // Append elements to the details container
        textContainer.appendChild(nameElement);
        textContainer.appendChild(artistElement)
        detailsContainer.appendChild(imageElement);
        detailsContainer.appendChild(textContainer)
        // detailsContainer.appendChild(nameElement);
        // detailsContainer.appendChild(artistElement)
    
        // Append the details container to the cContainer
        cContainer.appendChild(detailsContainer);
        return fetch(`/track-audio-features/${trackId}`)
    })
    .then(response => response.json())
    .then(audioData => {

    })
    .catch(error => console.error('Error:', error));

