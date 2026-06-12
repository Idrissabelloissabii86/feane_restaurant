// Header

const header = document.getElementById('main-header');
const menuBtn = document.getElementById('menu-btn');

menuBtn.addEventListener('change', () => {
    if (menuBtn.checked) {
        header.classList.add('header-expanded');
    } else {
        header.classList.remove('header-expanded');
    }
});
// Carousel

let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const slider = document.querySelector('.slider');
const totalSlides = slides.length;

function updateSlider() {
    // Déplacement de l'ensemble du slider
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
        const isCurrent = i === currentIndex;
        
        // Ciblage du conteneur interne pour l'effet de scale
        const content = slide.querySelector('.slide-content');
        
        if (content) {
            // Application du scale pour l'effet visuel sans affecter la largeur de défilement
            content.style.transform = isCurrent ? 'scale(1)' : 'scale(0.8)';
            // Application d'une opacité pour mieux distinguer la slide active
            content.style.opacity = isCurrent ? '1' : '0.6';
        }
    });

    // Mise à jour de la couleur des points de navigation
    dots.forEach((dot, i) => {
        const isActive = i === currentIndex;
        
        // Classes Tailwind pour la couleur et l'opacité
        dot.classList.toggle('bg-yellow-400', isActive); // Point actif
        dot.classList.toggle('animate-bounce', isActive);
        dot.classList.toggle('bg-white', !isActive);     // Point inactif
        dot.classList.toggle('opacity-100', isActive);
        // dot.classList.toggle('opacity-50', !isActive);   // Assombrir les points inactifs
    });
}

function showSlide(index) {
    if (index < 0) {
        currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }
    updateSlider();
}

// Fonctions de navigation (déjà définies par l'utilisateur)
function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

function currentSlide(index) {
    showSlide(index);
}

// Initialisation et boucle automatique
updateSlider();
setInterval(nextSlide, 10000);


// Comment carousel

{
    const track = document.getElementById('testiTrack');
    const nextBtn = document.getElementById('testiNextBtn');
    const prevBtn = document.getElementById('testiPrevBtn');
    
    // On récupère les cartes originales AVANT le clonage
    const originalCards = Array.from(track.children);
    let currentIndex = originalCards.length; 
    let isTransitioning = false;
    let autoPlayInterval;

    function setupClones() {
        // Cloner les cartes pour l'effet infini
        const firstClones = originalCards.map(card => card.cloneNode(true));
        const lastClones = originalCards.map(card => card.cloneNode(true));

        lastClones.forEach(clone => track.insertBefore(clone, track.firstChild));
        firstClones.forEach(clone => track.appendChild(clone));
        
        // Positionner au début de la série originale sans animation
        requestAnimationFrame(() => {
            updatePosition(false);
        });
    }

    function updatePosition(animate = true) {
        // Calcul dynamique de la largeur d'une carte + le gap
        const gap = 16; // correspond à gap-4 (1rem)
        const cardWidth = originalCards[0].offsetWidth + gap;
        
        track.style.transition = animate ? "transform 0.5s ease-in-out" : "none";
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    function moveNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updatePosition();

        track.addEventListener('transitionend', function handleEnd() {
            if (currentIndex >= originalCards.length * 2) {
                track.style.transition = "none";
                currentIndex = originalCards.length;
                updatePosition(false);
            }
            isTransitioning = false;
            track.removeEventListener('transitionend', handleEnd);
        });
    }

    function movePrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        updatePosition();

        track.addEventListener('transitionend', function handleEnd() {
            if (currentIndex <= originalCards.length - 1) {
                track.style.transition = "none";
                currentIndex = originalCards.length * 2 - 1;
                updatePosition(false);
            }
            isTransitioning = false;
            track.removeEventListener('transitionend', handleEnd);
        });
    }

    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(moveNext, 5000);
    }

    // Lancement
    setupClones();
    startAutoPlay();

    nextBtn.addEventListener('click', () => { moveNext(); startAutoPlay(); });
    prevBtn.addEventListener('click', () => { movePrev(); startAutoPlay(); });

    // Important : Recalculer la position si on tourne le téléphone ou redimensionne
    window.addEventListener('resize', () => {
        updatePosition(false);
    });
}