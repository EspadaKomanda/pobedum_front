'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = 'http://45.153.188.80:8081/api/v1';

const CodeBlock = ({ code }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Код скопирован в буфер обмена');
    } catch (err) {
      toast.error('Не удалось скопировать код');
    }
  };

  return (
    <div className="relative">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={copyToClipboard}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function Documentation() {
  const endpoints = [
    {
      title: 'Получение JWT токена',
      method: 'POST',
      url: '/auth/login',
      description: 'Аутентификация пользователя и получение JWT токена.',
      code: `curl -X POST ${API_BASE_URL}/auth/login \\
  -H 'Content-Type: application/json' \\
  -d '{
    "userName": "your_username",
    "password": "Your_Password123"
}'`,
      response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}`,
      params: [
        { name: 'userName', type: 'string', description: 'Имя пользователя' },
        { name: 'password', type: 'string', description: 'Пароль (минимум 8 символов, должен содержать заглавные и строчные буквы, цифры)' }
      ],
      responseParams: [
        { name: 'token', type: 'string', description: 'JWT токен для авторизации' },
        { name: 'expiresIn', type: 'number', description: 'Время жизни токена в секундах' }
      ],
      auth: false
    },
    {
      title: 'Создание запроса на генерацию',
      method: 'POST',
      url: '/video-generation',
      description: 'Создает новый запрос на генерацию видео из текста письма.',
      code: `curl -X POST ${API_BASE_URL}/video-generation \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: YOUR_JWT_TOKEN' \\
  -d '{
    "text": "Текст письма на русском языке",
    "colorScheme": "color",
    "resolution": "512x512",
    "frameTime": 5,
    "model": "remote"
}'`,
      response: `{
  "taskId": "550e8400-e29b-41d4-a716-446655440000"
}`,
      params: [
        { name: 'text', type: 'string', description: 'Текст письма для генерации' },
        { name: 'colorScheme', type: 'string', description: 'Цветовая схема (color/bw)' },
        { name: 'resolution', type: 'string', description: 'Разрешение видео (512x512/1024x1024)' },
        { name: 'frameTime', type: 'number | null', description: 'Время на кадр в секундах 1-20 сек' },
        { name: 'model', type: 'string', description: 'Модель для генерации remote/custom' }
      ],
      auth: true
    },
    {
      title: 'Получение статуса генерации',
      method: 'GET',
      url: '/video-generation/status/{videoId}',
      description: 'Возвращает текущий статус генерации видео.',
      code: `curl -X GET ${API_BASE_URL}/video-generation/status/550e8400-e29b-41d4-a716-446655440000 \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: YOUR_JWT_TOKEN'`,
      response: `{
  "status": "CREATING_IMAGES",
  "progress": 50,
  "eta": 120
}`,
      params: [
        { name: 'videoId', type: 'string', description: 'Идентификатор видео (UUID)' }
      ],
      responseParams: [
        { name: 'status', type: 'string', description: 'Статус генерации (ANALYZE_LETTER, CREATING_IMAGES, CREATING_AUDIO, MAKING_VIDEOS, ADD_SOUND, MERGE_VIDEOS, FINAL_PROCESS)' },
        { name: 'progress', type: 'number', description: 'Прогресс в процентах (0-100)' },
        { name: 'eta', type: 'number', description: 'Примерное время до завершения в секундах' }
      ],
      auth: true
    },
    {
      title: 'Получение позиции в очереди',
      method: 'GET',
      url: '/video-generation/queue-position/{videoId}',
      description: 'Возвращает текущую позицию в очереди на генерацию.',
      code: `curl -X GET ${API_BASE_URL}/video-generation/queue-position/550e8400-e29b-41d4-a716-446655440000 \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: YOUR_JWT_TOKEN'`,
      response: `5`,
      params: [
        { name: 'videoId', type: 'string', description: 'Идентификатор видео (UUID)' }
      ],
      responseParams: [
        { name: 'position', type: 'number', description: 'Позиция в очереди (целое число)' }
      ],
      auth: true
    },
    {
      title: 'Получение информации о видео',
      method: 'GET',
      url: '/videos/{videoId}',
      description: 'Возвращает информацию о сгенерированном видео.',
      code: `curl -X GET ${API_BASE_URL}/videos/550e8400-e29b-41d4-a716-446655440000 \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: YOUR_JWT_TOKEN'`,
      response: `{
  "videoId": "550e8400-e29b-41d4-a716-446655440000",
  "videoUrl": "https://storage.example.com/videos/550e8400.mp4",
  "videoPreviewUrl": "https://storage.example.com/videos/550e8400.png",
  "durationSeconds": 120,
  "resolution": "1920x1080",
  "sizeMB": 45.7,
  "letterId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2023-05-15T14:30:00"
}`,
      params: [
        { name: 'videoId', type: 'string', description: 'Идентификатор видео (UUID)' }
      ],
      responseParams: [
        { name: 'videoId', type: 'string', description: 'UUID видео' },
        { name: 'videoUrl', type: 'string', description: 'Ссылка для скачивания видео' },
        { name: 'videoPreviewUrl', type: 'string', description: 'Ссылка на превью видео' },
        { name: 'durationSeconds', type: 'number', description: 'Длительность видео в секундах' },
        { name: 'resolution', type: 'string', description: 'Разрешение видео (например, 1920x1080)' },
        { name: 'sizeMB', type: 'number', description: 'Размер файла в мегабайтах' },
        { name: 'letterId', type: 'string', description: 'UUID связанного письма' },
        { name: 'createdAt', type: 'string', description: 'Дата и время создания видео в формате ISO' }
      ],
      auth: true
    }
  ];

  return (
    <main className="min-h-screen bg-muted py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-8">API Документация</h1>

          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Базовый URL</h2>
            <p className="text-muted-foreground mb-4">
              Все запросы к API должны быть отправлены на базовый URL:
            </p>
            <CodeBlock code={API_BASE_URL} />
          </Card>

          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Аутентификация</h2>
            <p className="text-muted-foreground mb-4">
              Все запросы к API должны содержать JWT токен в заголовке Authorization.
              Получить токен можно в личном кабинете.
            </p>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Формат заголовка</h3>
              <CodeBlock code="Authorization: YOUR_JWT_TOKEN" />
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-yellow-700">
                Замените YOUR_JWT_TOKEN на действительный JWT токен, полученный при аутентификации.
              </p>
            </div>
          </Card>
          
          <div className="space-y-8">
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      endpoint.method === 'POST' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <h2 className="text-2xl font-semibold">{endpoint.title}</h2>
                  </div>

                  <p className="text-muted-foreground mb-4">{endpoint.description}</p>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Endpoint</h3>
                    <code className="bg-muted px-2 py-1 rounded">{endpoint.url}</code>
                  </div>

                  {endpoint.params.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Параметры запроса</h3>
                      <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                        <div className="font-medium">Название</div>
                        <div className="font-medium">Тип</div>
                        <div className="font-medium">Описание</div>
                        {endpoint.params.map((param, i) => (
                          <>
                            <div>{param.name}</div>
                            <div className="font-mono text-sm">{param.type}</div>
                            <div>{param.description}</div>
                          </>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Пример запроса</h3>
                    <CodeBlock code={endpoint.code} />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Пример ответа</h3>
                    <CodeBlock code={endpoint.response} />
                  </div>

                  {endpoint.responseParams && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Параметры ответа</h3>
                      <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                        <div className="font-medium">Название</div>
                        <div className="font-medium">Тип</div>
                        <div className="font-medium">Описание</div>
                        {endpoint.responseParams.map((param, i) => (
                          <>
                            <div>{param.name}</div>
                            <div className="font-mono text-sm">{param.type}</div>
                            <div>{param.description}</div>
                          </>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}