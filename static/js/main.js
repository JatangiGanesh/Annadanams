// Vinayaka Chavithi Annadanam Finder - Main JS

document.addEventListener('DOMContentLoaded', function () {
    // Tooltips initialization
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Share Annadanam Event Handler
    const shareButtons = document.querySelectorAll('.btn-share-event');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const title = this.getAttribute('data-title') || 'Vinayaka Chavithi Annadanam';
            const text = this.getAttribute('data-text') || 'Find Annadanam Prasadam location near you for Vinayaka Chavithi!';
            const url = this.getAttribute('data-url') || window.location.href;

            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: text,
                    url: url
                }).catch(err => console.log('Share canceled'));
            } else {
                // Fallback to WhatsApp Web Share
                const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + url)}`;
                window.open(whatsappUrl, '_blank');
            }
        });
    });

    // Geolocation Auto-Detection on Submit Page
    const detectLocationBtn = document.getElementById('btnDetectLocation');
    if (detectLocationBtn) {
        detectLocationBtn.addEventListener('click', function () {
            const statusEl = document.getElementById('locationDetectStatus');
            const latInput = document.getElementById('latitude');
            const lngInput = document.getElementById('longitude');
            const mapUrlInput = document.getElementById('google_maps_url');

            if (!navigator.geolocation) {
                statusEl.innerHTML = '<span class="text-danger small"><i class="fa-solid fa-triangle-exclamation"></i> Geolocation is not supported by your browser.</span>';
                return;
            }

            statusEl.innerHTML = '<span class="text-primary small"><i class="fa-solid fa-spinner fa-spin"></i> Detecting your current GPS location...</span>';

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude.toFixed(6);
                    const lng = position.coords.longitude.toFixed(6);

                    if (latInput) latInput.value = lat;
                    if (lngInput) lngInput.value = lng;
                    
                    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                    if (mapUrlInput && !mapUrlInput.value) {
                        mapUrlInput.value = googleMapsUrl;
                    }

                    statusEl.innerHTML = `<span class="text-success small"><i class="fa-solid fa-circle-check"></i> Location detected! (Lat: ${lat}, Lng: ${lng})</span>`;
                },
                function (error) {
                    let errMsg = "Unable to retrieve location.";
                    if (error.code === error.PERMISSION_DENIED) {
                        errMsg = "Location permission denied. Please allow location access or enter Google Maps link manually.";
                    }
                    statusEl.innerHTML = `<span class="text-warning small"><i class="fa-solid fa-circle-info"></i> ${errMsg}</span>`;
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    }

    // Auto dismiss alerts after 6 seconds
    setTimeout(function() {
        const alerts = document.querySelectorAll('.alert-dismissible');
        alerts.forEach(function(alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 6000);
});
