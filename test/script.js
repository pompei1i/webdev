document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('.row');
  const previewSection = document.querySelector('.preview');
  const phoneContainer = document.querySelector('.phone-container');
  const phone = document.querySelector('.phone');
  const glow = document.querySelector('.glow');
  const allMedia = document.querySelectorAll('.phone video, .phone img');

  // Змінні для керування циклами ефектів
  let snowInterval, fireworkInterval;

  // --- ЛОГІКА СПЕЦЕФЕКТІВ ---
  function createSnow() {
  const container = document.getElementById('snow-canvas');
  if (!container) return;
  
  const flake = document.createElement('div');
  flake.className = 'snowflake';
  
  // Явно вказуємо білий колір через JS для надійності
  flake.style.backgroundColor = '#ffffff'; 
  
  const size = Math.random() * 4 + 2 + 'px';
  flake.style.width = size;
  flake.style.height = size;
  flake.style.left = Math.random() * 100 + '%';
  flake.style.top = '-10px';
  
  container.appendChild(flake);

  const duration = Math.random() * 2000 + 3000;
  const anim = flake.animate([
    { transform: 'translateY(0)', opacity: 0.8 },
    { transform: `translateY(600px)`, opacity: 0 } // 600px — висота телефона
  ], { duration: duration, easing: 'linear' });

  anim.onfinish = () => flake.remove();
}

  function createFirework() {
    const container = document.getElementById('fireworks-canvas');
    if (!container) return;
    const x = Math.random() * 100;
    const y = Math.random() * 60; // переважно у верхній частині
    const colors = ['#ff0044', '#00ffcc', '#ffcc00', '#ffffff', '#ff00ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 15; i++) {
      const spark = document.createElement('div');
      spark.className = 'spark';
      spark.style.backgroundColor = color;
      spark.style.left = x + '%';
      spark.style.top = y + '%';
      spark.style.boxShadow = `0 0 10px ${color}`;
      container.appendChild(spark);

      const angle = (Math.PI * 2 / 15) * i;
      const velocity = Math.random() * 80 + 40;
      const anim = spark.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, opacity: 0 }
      ], { duration: 800, easing: 'ease-out' });

      anim.onfinish = () => spark.remove();
    }
  }

  // --- ОСНОВНА ЛОГІКА ---
  function setOrientation(el) {
    const width = el.videoWidth || el.naturalWidth;
    const height = el.videoHeight || el.naturalHeight;
    phoneContainer.classList.toggle('vertical', height > width);
  }

  rows.forEach((row, index) => {
    setTimeout(() => {
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    }, index * 100);
  });

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const mediaId = row.dataset.media || row.dataset.video || row.dataset.photo;
      const activeMedia = document.getElementById(mediaId);
      const color = row.dataset.glow || 'rgba(0, 180, 255, 0.55)';

      if (!activeMedia) return;

      previewSection.classList.add('active');
      phone.classList.add('active');
      glow.style.opacity = '1';
      document.documentElement.style.setProperty('--glow-color', color);

      allMedia.forEach(m => {
        m.style.display = 'none';
        if (m.tagName === 'VIDEO') m.pause();
      });

      activeMedia.style.display = 'block';

      // Перевірка орієнтації
      if (activeMedia.tagName === 'VIDEO') {
        if (activeMedia.readyState >= 1) setOrientation(activeMedia);
        else activeMedia.onloadedmetadata = () => setOrientation(activeMedia);
        activeMedia.play().catch(() => {});
      } else {
        if (activeMedia.complete) setOrientation(activeMedia);
        else activeMedia.onload = () => setOrientation(activeMedia);
      }

      // ЗАПУСК ЕФЕКТІВ ДЛЯ ГРУДНЯ (v12)
      if (mediaId === 'v12') {
        document.getElementById('snow-canvas').style.opacity = '1';
        document.getElementById('fireworks-canvas').style.opacity = '1';
        snowInterval = setInterval(createSnow, 100);
        fireworkInterval = setInterval(createFirework, 600);
      }
    });

    row.addEventListener('mouseleave', () => {
      previewSection.classList.remove('active');
      phone.classList.remove('active');
      glow.style.opacity = '0';
      
      // ЗУПИНКА ЕФЕКТІВ
      document.getElementById('snow-canvas').style.opacity = '0';
      document.getElementById('fireworks-canvas').style.opacity = '0';
      clearInterval(snowInterval);
      clearInterval(fireworkInterval);

      allMedia.forEach(m => { if (m.tagName === 'VIDEO') m.pause(); });

      setTimeout(() => {
        if (!previewSection.classList.contains('active')) {
          phoneContainer.classList.remove('vertical');
        }
      }, 400);
    });
  });
});
// 3. Генерація райдуги
const rainbowContainer = document.getElementById('rainbow-container');
if (rainbowContainer) {
  const colors = ['rgb(232 121 249)', 'rgb(96 165 250)', 'rgb(94 234 212)'];
  for (let i = 0; i < 25; i++) {
    const r = document.createElement('div');
    r.className = 'rainbow';
    r.style.animationDelay = `-${i * 1.6}s`;
    const c = colors[i % 3];
    r.style.boxShadow = `-130px 0 80px 40px white, -50px 0 50px 25px ${c}, 130px 0 80px 40px white`;
    rainbowContainer.appendChild(r);
  }
}