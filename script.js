// Karte Anzeigen zentriert auf Deutschland

var map = L.map('map').setView([50.3019, 9.7494], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Marker hinzufügen

function onMapClick(e) {
    var marker = L.marker(e.latlng).addTo(map);
    var userComment = prompt("Bitte gib einen Kommentar ein: ")

    if (userComment === null || userComment.trim() === '') {
        userComment = ' ';
    }
    
    const popupContent = `${userComment}<br><button onclick="deleteMarker(${e.latlng.lat}, ${e.latlng.lng}, this)">Entfernen</button>`;
    marker.bindPopup(popupContent).openPopup();
    saveMarkers(e.latlng, userComment);
}

map.on('click', onMapClick);

// Marker speichern

function saveMarkers(latlng, userComment) {
    var storedMarkers = JSON.parse(localStorage.getItem('markers')) || [];

    storedMarkers.push({
        lat: latlng.lat,
        lng: latlng.lng,
        comment: userComment
    });

    localStorage.setItem('markers', JSON.stringify(storedMarkers));
}

function loadMarkers() {
    var storedMarkers = JSON.parse(localStorage.getItem('markers')) || [];

    storedMarkers.forEach(function (markerData) {
        var marker = L.marker([markerData.lat, markerData.lng]).addTo(map);
        const popupContent = `${markerData.comment}<br><button onclick="deleteMarker(${markerData.lat}, ${markerData.lng}, this)">Entfernen</button>`;

        if (markerData.comment) {
            marker.bindPopup(popupContent);
        }
    })
}

loadMarkers();

// Marker löschen

function deleteMarker(lat, lng, buttonElement) {
    var storedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
    storedMarkers = storedMarkers.filter(m => !(m.lat === lat && m.lng === lng));
    localStorage.setItem('markers', JSON.stringify(storedMarkers));

    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            var position = layer.getLatLng();
            if (position.lat === lat && position.lng === lng) {
                map.removeLayer(layer);
            }
        }
    })
}