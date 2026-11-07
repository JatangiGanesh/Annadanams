// Interactive Leaflet Map for Annadanam Locations

function initAnnadanamMap(containerId, filterParams = {}) {
    const mapElement = document.getElementById(containerId);
    if (!mapElement) return;

    // Default center on Telangana / Andhra Pradesh region (e.g. Hyderabad coordinates)
    const defaultCenter = [17.3850, 78.4867];
    const map = L.map(containerId).setView(defaultCenter, 7);

    // Add OpenStreetMap base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // Custom Saffron Ganesh/Prasadam Icon
    const orangeIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background: linear-gradient(135deg, #E65100, #FF6F00); color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid #FFF;">
                <i class="fa-solid fa-bowl-food" style="font-size: 16px;"></i>
               </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -20]
    });

    const servingNowIcon = L.divIcon({
        className: 'custom-map-marker-serving',
        html: `<div style="background: linear-gradient(135deg, #10B981, #059669); color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16,185,129,0.5); border: 2.5px solid #FFD54F;">
                <i class="fa-solid fa-bell-concierge" style="font-size: 18px;"></i>
               </div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -22]
    });

    // Build query URL
    const queryString = new URLSearchParams(filterParams).toString();
    const apiUrl = `/api/events${queryString ? '?' + queryString : ''}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(events => {
            const markers = [];

            events.forEach(ev => {
                if (ev.latitude && ev.longitude) {
                    const icon = ev.status === 'Serving Now' ? servingNowIcon : orangeIcon;
                    const marker = L.marker([ev.latitude, ev.longitude], { icon: icon }).addTo(map);

                    const statusBadgeClass = ev.status === 'Serving Now' ? 'bg-success' : 'bg-primary';

                    const popupContent = `
                        <div class="map-popup-header">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="badge ${statusBadgeClass} text-white">${ev.status}</span>
                                <span class="badge bg-warning text-dark">${ev.festival_day}</span>
                            </div>
                            <strong style="font-size: 1rem; color: #FFF;">${ev.organization_pandal || ev.donor_name}</strong>
                        </div>
                        <div class="map-popup-body">
                            <p class="mb-1 text-muted small"><i class="fa-solid fa-location-dot text-danger me-1"></i>${ev.village_mandal}, ${ev.district}</p>
                            <p class="mb-2 small"><strong>Food:</strong> ${ev.food_details.substring(0, 75)}...</p>
                            <p class="mb-2 small"><strong>Timing:</strong> ${ev.distribution_timings}</p>
                            <div class="d-grid gap-2">
                                <a href="${ev.google_maps_url}" target="_blank" class="btn btn-sm btn-primary">
                                    <i class="fa-solid fa-diamond-turn-right me-1"></i> Get Directions
                                </a>
                                <a href="/event/${ev.id}" class="btn btn-sm btn-outline-secondary">
                                    View Full Details
                                </a>
                            </div>
                        </div>
                    `;

                    marker.bindPopup(popupContent, { maxWidth: 280 });
                    markers.push([ev.latitude, ev.longitude]);
                }
            });

            // If markers exist, fit map bounds
            if (markers.length > 0) {
                map.fitBounds(markers, { padding: [50, 50], maxZoom: 14 });
            }
        })
        .catch(err => {
            console.error('Error loading map points:', err);
        });

    return map;
}
