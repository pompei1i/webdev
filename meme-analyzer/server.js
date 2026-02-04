import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Для поддержки __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Проверка API ключа
if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY не установлен. Создайте файл .env');
} else {
    console.log('✅ API ключ найден');
}

// API endpoint для анализа текста
app.post('/api/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        
        console.log('📥 Получен запрос:', { text: text?.substring(0, 50) });
        
        if (!text) {
            console.error('❌ Текст не предоставлен');
            return res.status(400).json({ error: 'Текст не предоставлен' });
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            console.error('❌ API ключ не настроен');
            return res.status(500).json({ 
                error: 'API ключ не настроен. Добавьте ANTHROPIC_API_KEY в файл .env',
                demo: true 
            });
        }

        console.log('📝 Анализирую текст:', text.substring(0, 50) + '...');
        console.log('🔑 API ключ длина:', process.env.ANTHROPIC_API_KEY?.length);

        // Используем встроенный fetch (доступен в Node.js 18+)
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1500,
                messages: [{
                    role: 'user',
                    content: `Проанализируй этот текст и подбери 5-6 подходящих мемов или постироничных образов. 
                    
Текст: "${text}"

Ответь ТОЛЬКО в JSON формате без markdown кода и других символов. Структура:
{
  "analysis": "краткий анализ настроения, темы и контекста текста (2-3 предложения)",
  "mood": "настроение (позитивное/негативное/ироничное/саркастичное/нейтральное)",
  "themes": ["тема1", "тема2"],
  "memes": [
    {
      "query": "поисковый запрос для изображения на английском (короткий, 2-4 слова)",
      "title": "название мема или ситуации",
      "description": "почему этот мем подходит к тексту",
      "vibe": "настроение мема (relatable/funny/ironic/wholesome/chaotic)"
    }
  ]
}

Важно: подбирай популярные мемы, которые точно отражают смысл текста. Для постиронии используй более абсурдные и нелогичные ассоциации.`
                }]
            })
        });

        console.log('📡 Claude API ответ статус:', response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Ошибка Claude API:', {
                status: response.status,
                statusText: response.statusText,
                body: errorData.substring(0, 500)
            });
            
            // Проверяем конкретные ошибки
            if (response.status === 401) {
                return res.status(401).json({ 
                    error: 'Неверный API ключ. Проверьте ANTHROPIC_API_KEY в .env файле' 
                });
            }
            
            if (response.status === 429) {
                return res.status(429).json({ 
                    error: 'Превышен лимит запросов. Подождите немного и попробуйте снова.' 
                });
            }
            
            return res.status(response.status).json({ 
                error: `Ошибка Claude API: ${response.status}`,
                details: errorData.substring(0, 200)
            });
        }

        const data = await response.json();
        console.log('📦 Получены данные от Claude API');
        
        const content = data.content?.find(c => c.type === 'text')?.text || '';
        
        if (!content) {
            console.error('❌ Пустой ответ от Claude');
            return res.status(500).json({ 
                error: 'Получен пустой ответ от Claude API' 
            });
        }
        
        // Очищаем ответ от markdown блоков
        let cleanContent = content.trim();
        cleanContent = cleanContent.replace(/```json\n?/g, '');
        cleanContent = cleanContent.replace(/```\n?/g, '');
        cleanContent = cleanContent.trim();
        
        console.log('🧹 Очищенный ответ (первые 100 символов):', cleanContent.substring(0, 100));
        
        // Парсим JSON
        let result;
        try {
            result = JSON.parse(cleanContent);
        } catch (parseError) {
            console.error('❌ Ошибка парсинга JSON:', parseError.message);
            console.error('📄 Контент который пытались парсить:', cleanContent.substring(0, 500));
            return res.status(500).json({ 
                error: 'Ошибка парсинга ответа от Claude',
                details: parseError.message
            });
        }
        
        console.log('✅ Успешно проанализировано. Найдено мемов:', result.memes?.length || 0);
        
        res.json(result);

    } catch (error) {
        console.error('❌ Общая ошибка при анализе:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            error: 'Ошибка при анализе текста',
            details: error.message 
        });
    }
});

// Endpoint для получения случайной картинки (fallback)
app.get('/api/random-image', (req, res) => {
    const query = req.query.q || 'meme';
    const imageUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(query)}`;
    res.json({ url: imageUrl });
});

// Healthcheck
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        hasApiKey: !!process.env.ANTHROPIC_API_KEY,
        apiKeyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
    });
});

// Обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint не найден' });
});

// Обработка общих ошибок
app.use((err, req, res, next) => {
    console.error('💥 Необработанная ошибка:', err);
    res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        details: err.message 
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║            🧠 МЕМ-АНАЛИЗАТОР ЗАПУЩЕН                       ║
╠════════════════════════════════════════════════════════════╣
║  🌐 URL:        http://localhost:${PORT}                    ║
║  📝 API:        http://localhost:${PORT}/api/analyze        ║
║  ${process.env.ANTHROPIC_API_KEY ? '✅ API ключ:   Настроен' : '⚠️  API ключ:   НЕ настроен'}                            ║
║  🔧 Node.js:    ${process.version}                              ║
╚════════════════════════════════════════════════════════════╝
    `);
});