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

// Beat visualizer animation
function initBeatVisualizer() {
    const container = document.getElementById('beatVisualizer');
    if (!container) return;

    const numBars = window.innerWidth < 480 ? 24 : 32;
    
    // Create bars with random heights
    for (let i = 0; i < numBars; i++) {
        const bar = document.createElement('div');
        bar.className = 'beat-bar';
        bar.style.setProperty('--i', i);
        bar.style.setProperty('--random-height', Math.random() * 40 + 'px');
        container.appendChild(bar);
    }
}

// Handle window resize for beat visualizer
function handleResize() {
    const container = document.getElementById('beatVisualizer');
    if (!container) return;

    const numBars = window.innerWidth < 480 ? 24 : 32;
    
    // Update beat visualizer if needed
    if (container.children.length !== numBars) {
        container.innerHTML = '';
        for (let i = 0; i < numBars; i++) {
            const bar = document.createElement('div');
            bar.className = 'beat-bar';
            bar.style.setProperty('--i', i);
            bar.style.setProperty('--random-height', Math.random() * 40 + 'px');
            container.appendChild(bar);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Set active nav link based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });

    // Initialize beat visualizer
    initBeatVisualizer();

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

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
            body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(e.target) && 
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            });
        });
    }

    // Initialize stats animation
    const statItems = document.querySelectorAll('.stat-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove the observer after first animation
                observer.unobserve(entry.target);
                
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                if (entry.target.querySelector('.stat-number')) {
                    const finalNumber = parseInt(entry.target.querySelector('.stat-number').dataset.value);
                    animateNumber(entry.target.querySelector('.stat-number'), finalNumber);
                }
            }
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => observer.observe(item));

    // Initialize YouTube functionality if on music page
    if (document.querySelector('.music-container')) {
        initYouTube();
    }

    // Initialize stats if on about page
    if (document.querySelector('.about-container')) {
        fetchSpotifyStats();
    }
});

function animateNumber(element, final, showPlus = false) {
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * final);
        
        element.textContent = current.toLocaleString() + (showPlus ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// About page scripts
document.addEventListener('DOMContentLoaded', () => {
    // Track card hover effects
    const trackCards = document.querySelectorAll('.track-card');
    trackCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.track-overlay').style.opacity = '0.3';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.track-overlay').style.opacity = '1';
        });
    });
});

// Stats functionality for About page
async function fetchSpotifyStats() {
    try {
        const monthlyListeners = document.getElementById('monthly-listeners');
        if (!monthlyListeners) return;

        // Set initial value and data attribute
        monthlyListeners.textContent = '0';
        monthlyListeners.dataset.value = '15000';

        // Show stat item with fade-in
        const statItem = monthlyListeners.closest('.stat-item');
        if (statItem) {
            setTimeout(() => {
                statItem.style.opacity = '1';
                statItem.style.transform = 'translateY(0)';
                // Animate to 15,000+
                animateNumber(monthlyListeners, 15000, true);
            }, 100);
        }
    } catch (error) {
        console.error('Error with stats:', error);
        const monthlyListeners = document.getElementById('monthly-listeners');
        if (monthlyListeners) {
            monthlyListeners.textContent = '15,000+';
            const statItem = monthlyListeners.closest('.stat-item');
            if (statItem) {
                statItem.style.opacity = '1';
                statItem.style.transform = 'translateY(0)';
            }
        }
    }
}

// Music page scripts
document.addEventListener('DOMContentLoaded', () => {
    // Track card hover effects
    const trackCards = document.querySelectorAll('.track-card');
    trackCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.track-overlay').style.opacity = '0.3';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.track-overlay').style.opacity = '1';
        });
    });

    // Platform link hover effects
    const platformLinks = document.querySelectorAll('.platform-link');
    platformLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'scale(1.05)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'scale(1)';
        });
    });

    // Initialize music player controls
    const controlButtons = document.querySelectorAll('.control-button');
    controlButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            // Add your music control logic here
        });
    });

    // Timeline interaction
    const timelines = document.querySelectorAll('.timeline');
    timelines.forEach(timeline => {
        timeline.addEventListener('click', (e) => {
            const rect = timeline.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            const percentage = (x / width) * 100;
            // Add your timeline seek logic here
        });
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// YouTube API Configuration
let player;
const YOUTUBE_CHANNEL_ID = 'UCZEMgri_jc2g_szBLEUzQWQ';
const API_KEY = 'AIzaSyAZHDOejgnSkMUofRvwi7dg0s9s8npX0rc'; // Restored original API key

// Initialize YouTube functionality
function initYouTube() {
    if (typeof YT !== 'undefined' && YT.loaded) {
        createPlayer();
    } else {
        // If the API isn't loaded yet, wait for it
        window.onYouTubeIframeAPIReady = createPlayer;
    }
}

function createPlayer() {
    player = new YT.Player('audio-player', {
        height: '0',
        width: '0',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Player is ready
    loadChannelVideos();
}

function onPlayerStateChange(event) {
    // Handle player state changes
    const controls = document.querySelectorAll('.control-button');
    const currentCard = document.querySelector(`[data-video-id="${player.getVideoData().video_id}"]`);
    
    if (event.data === YT.PlayerState.PLAYING) {
        // Update play button to pause
        controls.forEach(control => {
            if (control.dataset.videoId === player.getVideoData().video_id) {
                control.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                `;
            }
        });

        // Start progress update
        updateProgress();
    } else {
        // Update pause button to play
        controls.forEach(control => {
            if (control.dataset.videoId === player.getVideoData().video_id) {
                control.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                `;
            }
        });
    }

    // Update duration display
    if (currentCard) {
        const durationElement = currentCard.querySelector('.duration');
        const totalDuration = player.getDuration();
        durationElement.textContent = formatTime(totalDuration);
    }
}

function updateProgress() {
    if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
        const currentCard = document.querySelector(`[data-video-id="${player.getVideoData().video_id}"]`);
        if (currentCard) {
            const progress = currentCard.querySelector('.progress');
            const durationElement = currentCard.querySelector('.duration');
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            const percentage = (currentTime / duration) * 100;
            
            progress.style.width = `${percentage}%`;
            durationElement.textContent = formatTime(duration - currentTime);
        }
        requestAnimationFrame(updateProgress);
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function loadChannelVideos() {
    const tracksContainer = document.getElementById('tracks-container');
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');

    if (!tracksContainer) return;

    try {
        if (!API_KEY) {
            throw new Error('YouTube API key is not configured');
        }

        loadingState.style.display = 'block';
        errorState.style.display = 'none';
        tracksContainer.innerHTML = ''; // Clear previous content

        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`);
        
        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            throw new Error('No videos found for this channel');
        }

        loadingState.style.display = 'none';

        data.items.forEach((item, index) => {
            if (item.id.videoId) {
                const trackCard = createTrackCard(item, index);
                tracksContainer.appendChild(trackCard);
            }
        });

        // Initialize track controls
        initializeTrackControls();

    } catch (error) {
        console.error('Error loading videos:', error);
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        errorState.textContent = `Unable to load tracks: ${error.message}`;
    }
}

function createTrackCard(video, index) {
    const card = document.createElement('div');
    card.className = 'track-card';
    card.dataset.videoId = video.id.videoId;
    card.dataset.index = index;

    card.innerHTML = `
        <div class="track-thumbnail-container">
            <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}" class="track-thumbnail">
            <div class="track-overlay"></div>
        </div>
        <div class="track-info">
            <h3 class="track-title">${video.snippet.title}</h3>
            <p class="track-date">${new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
        </div>
        <div class="track-controls">
            <button class="control-button" data-action="play" data-video-id="${video.id.videoId}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </button>
            <div class="timeline">
                <div class="progress" style="width: 0%"></div>
            </div>
            <div class="duration">0:00</div>
        </div>
    `;

    // Add timeline click handler
    const timeline = card.querySelector('.timeline');
    const progress = card.querySelector('.progress');
    const duration = card.querySelector('.duration');

    timeline.addEventListener('click', (e) => {
        e.stopPropagation();
        if (player && player.getPlayerState() !== -1) {
            const rect = timeline.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            const videoDuration = player.getDuration();
            player.seekTo(videoDuration * clickPosition, true);
        }
    });

    return card;
}

function initializeTrackControls() {
    const controls = document.querySelectorAll('.control-button');
    controls.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const videoId = button.dataset.videoId;
            if (player.getVideoData().video_id === videoId) {
                if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                    player.pauseVideo();
                } else {
                    player.playVideo();
                }
            } else {
                player.loadVideoById(videoId);
                player.playVideo();
            }
        });
    });
}

// Spotify API Configuration
const SPOTIFY_CLIENT_ID = 'd64b1697bba9461e9729c2dc50cf8024';
const SPOTIFY_CLIENT_SECRET = 'cf051dfcfb394d6a93c82853079d4870';
const SPOTIFY_ARTIST_ID = '58nAeyetvPztEQw79pXVoN';

async function getSpotifyToken() {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error getting Spotify token:', error);
        throw error;
    }
} 