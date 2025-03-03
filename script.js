// Spotify API Configuration
const clientId = 'd64b1697bba9461e9729c2dc50cf8024';
const clientSecret = 'cf051dfcfb394d6a93c82853079d4870';

// Animation for elements with fade-in class
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Apply fade-in animation to elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => observer.observe(element));

    // Add smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Get Spotify access token
async function getSpotifyToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
}

// Fetch all releases
async function getAllReleases() {
    try {
        const token = await getSpotifyToken();
        const response = await fetch('https://api.spotify.com/v1/artists/58nAeyetvPztEQw79pXVoN/albums?limit=50', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching releases:', error);
        return null;
    }
}

// Fetch latest release
async function getLatestRelease() {
    try {
        const releases = await getAllReleases();
        return releases ? releases[0] : null;
    } catch (error) {
        console.error('Error fetching latest release:', error);
        return null;
    }
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
}); 