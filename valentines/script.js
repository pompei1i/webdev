// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".yes-btn");
const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalContent = document.getElementById("final-content");
const hoverMessage = document.getElementById("hover-message");
const noCounter = document.getElementById("no-counter");
const noCount = document.getElementById("no-count");
const loadingScreen = document.getElementById("loading-screen");
const doodleHearts = document.querySelector(".doodle-hearts");
const confettiContainer = document.getElementById("confetti-container");

// Mini-game elements
const minigame1 = document.getElementById("minigame1-container");
const minigame2 = document.getElementById("minigame2-container");
const mathAnswer = document.getElementById("math-answer");
const mathSubmit = document.getElementById("math-submit");
const mathFeedback = document.getElementById("math-feedback");
const word1 = document.getElementById("word1");
const word2 = document.getElementById("word2");
const lyricsSubmit = document.getElementById("lyrics-submit");
const lyricsFeedback = document.getElementById("lyrics-feedback");

// Variables
let noClickCount = 0;
let yesScale = 1;
let isYesGrowing = false;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Hide loading screen and show first mini-game
setTimeout(() => {
    loadingScreen.style.display = 'none';
    minigame1.style.display = 'flex';
}, 2300);

// Create floating doodle hearts
function createFloatingDoodleHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart-doodle';
    const heartSymbols = ['♡', '❤', '💕', '💗', '💖'];
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 25 + 20) + 'px';
    heart.style.animationDuration = (Math.random() * 12 + 18) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    doodleHearts.appendChild(heart);

    setTimeout(() => heart.remove(), 30000);
}

// Generate doodle hearts
setInterval(createFloatingDoodleHeart, 1000);
for (let i = 0; i < 8; i++) {
    setTimeout(createFloatingDoodleHeart, i * 400);
}

// Mini-game 1: Math Problem
mathSubmit.addEventListener("click", () => {
    const answer = mathAnswer.value.trim().toLowerCase();
    
    // Accept various forms of "бєлка" or squirrel
    const correctAnswers = ['бєлка', 'белка', 'бєлочка', 'білка', 'bilka'];
    const isCorrect = correctAnswers.some(correct => answer.includes(correct));
    
    if (isCorrect) {
        mathFeedback.textContent = '✧ так! правильна відповідь! ✧';
        mathFeedback.className = 'feedback-message correct';
        
        setTimeout(() => {
            minigame1.style.display = 'none';
            minigame2.style.display = 'flex';
        }, 1500);
    } else {
        // Check if they entered a number like 1.2
        if (answer === '1.2' || answer === '1,2' || answer === '12') {
            mathFeedback.textContent = 'ну, математично харош, але тут інша відповідь (рижий пухнастий друган 🐿️)';
            mathFeedback.className = 'feedback-message incorrect';
        } else {
            mathFeedback.textContent = 'треш... давай по новой!';
            mathFeedback.className = 'feedback-message incorrect';
        }
    }
});

// Enter key for math answer
mathAnswer.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        mathSubmit.click();
    }
});

// Mini-game 2: Song Lyrics
// Correct answers: "завтра" and "назад"
lyricsSubmit.addEventListener("click", () => {
    const answer1 = word1.value.trim().toLowerCase();
    const answer2 = word2.value.trim().toLowerCase();
    
    const correct1 = answer1 === 'завтра';
    const correct2 = answer2 === 'назад';
    
    if (correct1 && correct2) {
        lyricsFeedback.textContent = '✧ гаддем! обидва слова правильні!';
        lyricsFeedback.className = 'feedback-message correct';
        
        setTimeout(() => {
            minigame2.style.display = 'none';
            envelope.style.display = 'block';
        }, 1500);
    } else if (!correct1 && !correct2) {
        lyricsFeedback.textContent = 'оба нє!!! ура. спробуй ще раз))';
        lyricsFeedback.className = 'feedback-message incorrect';
    } else if (!correct1) {
        lyricsFeedback.textContent = 'перше слово нє, друге да! ✓';
        lyricsFeedback.className = 'feedback-message incorrect';
    } else {
        lyricsFeedback.textContent = 'друге слово нє, перше да! ✓';
        lyricsFeedback.className = 'feedback-message incorrect';
    }
});

// Enter key for lyrics (when pressing enter in second input)
word2.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        lyricsSubmit.click();
    }
});

// Click Envelope
envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letter.style.display = "flex";

    setTimeout(() => {
        document.querySelector(".letter-window").classList.add("open");
    }, 50);
});

// Move NO button function
let currentX = 0;
let currentY = 0;

function moveNoButton() {
    // Small incremental movement
    const moveDistance = isMobile ? 50 : 70;
    const angle = Math.random() * Math.PI * 2;
    
    currentX += Math.cos(angle) * moveDistance;
    currentY += Math.sin(angle) * moveDistance;
    
    // Limit total displacement - VERY SMALL for mobile
    const maxDisplacement = isMobile ? 60 : 100;
    currentX = Math.max(-maxDisplacement, Math.min(maxDisplacement, currentX));
    currentY = Math.max(-maxDisplacement, Math.min(maxDisplacement, currentY));

    noBtn.style.transition = "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
    noBtn.style.transform = `translate(${currentX}px, ${currentY}px)`;
}

// Move NO button on hover (desktop)
if (!isMobile) {
    noBtn.addEventListener("mouseover", moveNoButton);
    
    noBtn.addEventListener("mouseout", () => {
        hoverMessage.classList.remove('show');
    });
}

// Move NO button on touch start (mobile)
if (isMobile) {
    noBtn.addEventListener("touchstart", (e) => {
        moveNoButton();
    }, { passive: true });
}

// Grow YES button when NO clicked
noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    noClickCount++;
    noCount.textContent = noClickCount;
    
    if (noClickCount === 1) {
        noCounter.style.display = 'block';
    }
    
    yesScale += 0.25;
    
    if (!isYesGrowing) {
        isYesGrowing = true;
        yesBtn.classList.add('growing');
        yesBtn.style.position = "fixed";
        yesBtn.style.top = "50%";
        yesBtn.style.left = "50%";
        yesBtn.style.transformOrigin = "center center";
    }
    
    yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
    
    // Shake animation
    noBtn.style.animation = 'shake 0.3s';
    setTimeout(() => {
        noBtn.style.animation = '';
    }, 300);
});

// Shake keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(-5px, 0) rotate(-5deg); }
        75% { transform: translate(5px, 0) rotate(5deg); }
    }
`;
document.head.appendChild(style);

// Kawaii confetti
function createKawaiiConfetti() {
    const symbols = ['♡', '❤', '✿', '✧', '☆', '★', '♪', '(ノ◕ヮ◕)ノ*:・゚✧'];
    const colors = ['#ffb3d9', '#ff69b4', '#ffd6e8', '#ff91c7', '#ffc0e3'];
    
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.animationDelay = (Math.random() * 0.5) + 's';
            
            confettiContainer.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 6000);
        }, i * 30);
    }
}

// Kawaii fireworks
function createKawaiiFirework(x, y) {
    const symbols = ['♡', '✧', '☆', '✿'];
    const colors = ['#ffb3d9', '#ff69b4', '#ffd6e8', '#ff91c7'];
    const particles = 25;
    
    for (let i = 0; i < particles; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        firework.style.color = colors[Math.floor(Math.random() * colors.length)];
        firework.style.left = x + 'px';
        firework.style.top = y + 'px';
        
        const angle = (Math.PI * 2 * i) / particles;
        const velocity = Math.random() * 120 + 60;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        const animation = firework.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px)`, opacity: 0 }
        ], {
            duration: 1200,
            easing: 'cubic-bezier(0, 0.9, 0.57, 1)'
        });
        
        confettiContainer.appendChild(firework);
        
        animation.onfinish = () => firework.remove();
    }
}

// Launch multiple kawaii fireworks
function launchKawaiiFireworks() {
    const positions = [
        { x: window.innerWidth * 0.25, y: window.innerHeight * 0.25 },
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.2 },
        { x: window.innerWidth * 0.75, y: window.innerHeight * 0.25 },
        { x: window.innerWidth * 0.35, y: window.innerHeight * 0.5 },
        { x: window.innerWidth * 0.65, y: window.innerHeight * 0.5 }
    ];
    
    positions.forEach((pos, index) => {
        setTimeout(() => {
            createKawaiiFirework(pos.x, pos.y);
        }, index * 250);
    });
}

// YES clicked - kawaii celebration!
yesBtn.addEventListener("click", () => {
    title.innerHTML = '<span class="title-doodle">~</span> ура!! (。♥‿♥。) <span class="title-doodle">~</span>';
    catImg.src = "image2.jpeg";
    
    document.querySelector(".letter-window").classList.add("final");
    
    buttons.style.display = "none";
    noCounter.style.display = "none";
    finalContent.style.display = "block";
    
    // Kawaii celebration effects
    createKawaiiConfetti();
    launchKawaiiFireworks();
    
    setTimeout(launchKawaiiFireworks, 1800);
    setTimeout(createKawaiiConfetti, 2000);
    
    // Screen wiggle
    document.body.style.animation = 'screen-wiggle 0.6s';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 600);
    
    // Show final GIF after 5 seconds
    setTimeout(() => {
        const finalGifContainer = document.getElementById('final-gif-container');
        finalGifContainer.style.display = 'block';
    }, 5000);
});

// Screen wiggle animation
const wiggleStyle = document.createElement('style');
wiggleStyle.textContent = `
    @keyframes screen-wiggle {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        10%, 30%, 50%, 70%, 90% { transform: translate(-4px, 4px) rotate(-1deg); }
        20%, 40%, 60%, 80% { transform: translate(4px, -4px) rotate(1deg); }
    }
`;
document.head.appendChild(wiggleStyle);

// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);