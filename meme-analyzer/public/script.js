// API Configuration
const API_URL = window.location.origin;

// Проверка статуса сервера при загрузке
async function checkServerStatus() {
    const statusEl = document.getElementById('status');
    
    try {
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();
        
        if (data.status === 'ok') {
            statusEl.className = 'status online';
            statusEl.querySelector('.status-text').textContent = 
                data.hasApiKey ? '✅ Сервер работает' : '⚠️ API ключ не настроен';
        }
    } catch (error) {
        statusEl.className = 'status offline';
        statusEl.querySelector('.status-text').textContent = '❌ Сервер недоступен';
        console.error('Server check failed:', error);
    }
}

// Установка примера текста
function setExample(text) {
    document.getElementById('textInput').value = text;
    document.getElementById('textInput').focus();
}

// Основная функция анализа
async function analyzeText() {
    const text = document.getElementById('textInput').value.trim();
    
    if (!text) {
        showError('Пожалуйста, введите текст для анализа!');
        return;
    }
    
    const btn = document.getElementById('analyzeBtn');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const error = document.getElementById('error');
    
    // Подготовка UI
    btn.disabled = true;
    loading.style.display = 'block';
    results.style.display = 'none';
    error.style.display = 'none';
    
    try {
        console.log('📤 Отправляю запрос на анализ...');
        
        const response = await fetch(`${API_URL}/api/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📥 Получен ответ:', result);
        
        // Отображаем результаты
        displayResults(result);
        
        results.style.display = 'block';
        
        // Плавная прокрутка к результатам
        setTimeout(() => {
            results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
    } catch (err) {
        console.error('❌ Ошибка:', err);
        showError(err.message || 'Произошла ошибка при анализе текста');
    } finally {
        btn.disabled = false;
        loading.style.display = 'none';
    }
}

// Отображение результатов
function displayResults(data) {
    // Анализ текста
    const analysisText = document.getElementById('analysisText');
    analysisText.textContent = data.analysis;
    
    // Настроение
    const moodTag = document.getElementById('moodTag');
    const moodEmoji = getMoodEmoji(data.mood);
    moodTag.textContent = `${moodEmoji} ${data.mood || 'нейтральное'}`;
    
    // Темы
    const themesContainer = document.getElementById('themesContainer');
    themesContainer.innerHTML = '';
    if (data.themes && data.themes.length > 0) {
        data.themes.forEach(theme => {
            const tag = document.createElement('span');
            tag.className = 'theme-tag';
            tag.textContent = `#${theme}`;
            themesContainer.appendChild(tag);
        });
    }
    
    // Мемы
    const memesContainer = document.getElementById('memes');
    memesContainer.innerHTML = '';
    
    if (data.memes && data.memes.length > 0) {
        data.memes.forEach((meme, index) => {
            const card = createMemeCard(meme, index);
            memesContainer.appendChild(card);
        });
    } else {
        memesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #6b7280;">Мемы не найдены</p>';
    }
}

// Создание карточки мема
function createMemeCard(meme, index) {
    const card = document.createElement('div');
    card.className = 'meme-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Генерируем URL изображения
    const imageUrl = getImageUrl(meme.query);
    
    card.innerHTML = `
        <img 
            src="${imageUrl}" 
            alt="${meme.title}" 
            class="meme-image"
            loading="lazy"
            onerror="this.src='https://via.placeholder.com/400x400/667eea/ffffff?text=Мем'"
        >
        <div class="meme-info">
            <div class="meme-title">${escapeHtml(meme.title)}</div>
            <div class="meme-description">${escapeHtml(meme.description)}</div>
            ${meme.vibe ? `<span class="meme-vibe">${getVibeEmoji(meme.vibe)} ${meme.vibe}</span>` : ''}
        </div>
    `;
    
    return card;
}

// Получение URL изображения
function getImageUrl(query) {
    // Используем разные источники изображений для разнообразия
    const sources = [
        `https://source.unsplash.com/400x400/?${encodeURIComponent(query)}`,
        `https://picsum.photos/400/400?random=${Math.random()}`,
    ];
    
    // Возвращаем Unsplash как основной источник
    return sources[0];
}

// Получение эмодзи для настроения
function getMoodEmoji(mood) {
    const moods = {
        'позитивное': '😊',
        'негативное': '😔',
        'ироничное': '😏',
        'саркастичное': '🙄',
        'нейтральное': '😐',
        'веселое': '😄',
        'грустное': '😢',
        'злое': '😠',
        'удивленное': '😲'
    };
    
    return moods[mood.toLowerCase()] || '🤔';
}

// Получение эмодзи для вайба
function getVibeEmoji(vibe) {
    const vibes = {
        'relatable': '🎯',
        'funny': '😂',
        'ironic': '🤡',
        'wholesome': '🥰',
        'chaotic': '🌪️',
        'cringe': '😬',
        'cursed': '👻'
    };
    
    return vibes[vibe.toLowerCase()] || '✨';
}

// Показать ошибку
function showError(message) {
    const errorEl = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    errorEl.style.display = 'flex';
    
    // Автоматически скрыть через 5 секунд
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}

// Экранирование HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Обработчик Enter для отправки
document.getElementById('textInput').addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        analyzeText();
    }
});

// Проверка статуса при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    checkServerStatus();
    
    // Повторная проверка каждые 30 секунд
    setInterval(checkServerStatus, 30000);
});
