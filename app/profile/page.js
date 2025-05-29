'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Download, Share2, FileText, X, Copy, Key, Plus, Trash2, Pause, Maximize, Minimize } from 'lucide-react';
import { toast } from 'sonner';

const generatedMovies = [
  {
    id: 1,
    title: 'Тест 1',
    videoUrl: '/gen_test_007.mp4',
    thumbnail: '019.png',
    date: '26.05.2025',
    duration: '0:59',
    text: `Кому: Дятковой Наталье П.

От: Дяткова Андрея Ивановича

10.08.44 г.   
Здравствуйте, мама, брат и сестра!\t
Примите мой родной боевой с фронта и массу самых наилучших пожеланий в вашей жизни и здоровья.
Жизнь моя в настоящее время протекает хорошо. Я жив, здоров. Больше трёх лет прошло со дня страшной вашей жизни. Эти три с лишним года я переживал и беспокоился о вашей жизни или судьбе. Всё это время я ждал хотя бы одного вашего слова и вот радостный день настал, вы стали свободные. Я много послал вам писем, но ответа не одного не получил, причина этому мне не известна правда, большое спасибо сестрице Лене, сообщила о вас, а ваших писем всё нет. Я решил, что вы молчите и я буду молчать, но моё сердце не выдержало, ведь вы мои родные. Решил ещё одно написать и ждать вашего письма. Всё. 
До свидания.`
  },
  {
    id: 2,
    title: 'Тест 2',
    videoUrl: '/gen_test_018.mp4',
    thumbnail: '019.png',
    date: '26.05.2025',
    duration: '0:59',
    text: `Кому: Дятковой Наталье П.

От: Дяткова Андрея Ивановича

10.08.44 г.   
Здравствуйте, мама, брат и сестра!\t
Примите мой родной боевой с фронта и массу самых наилучших пожеланий в вашей жизни и здоровья.
Жизнь моя в настоящее время протекает хорошо. Я жив, здоров. Больше трёх лет прошло со дня страшной вашей жизни. Эти три с лишним года я переживал и беспокоился о вашей жизни или судьбе. Всё это время я ждал хотя бы одного вашего слова и вот радостный день настал, вы стали свободные. Я много послал вам писем, но ответа не одного не получил, причина этому мне не известна правда, большое спасибо сестрице Лене, сообщила о вас, а ваших писем всё нет. Я решил, что вы молчите и я буду молчать, но моё сердце не выдержало, ведь вы мои родные. Решил ещё одно написать и ждать вашего письма. Всё. 
До свидания.`
  },
  {
    id: 3,
    title: 'Тест 3',
    videoUrl: '/gen_test_021.mp4',
    thumbnail: '019.png',
    date: '26.05.2025',
    duration: '0:59',
    text: `Кому: Дятковой Наталье П.

От: Дяткова Андрея Ивановича

10.08.44 г.   
Здравствуйте, мама, брат и сестра!\t
Примите мой родной боевой с фронта и массу самых наилучших пожеланий в вашей жизни и здоровья.
Жизнь моя в настоящее время протекает хорошо. Я жив, здоров. Больше трёх лет прошло со дня страшной вашей жизни. Эти три с лишним года я переживал и беспокоился о вашей жизни или судьбе. Всё это время я ждал хотя бы одного вашего слова и вот радостный день настал, вы стали свободные. Я много послал вам писем, но ответа не одного не получил, причина этому мне не известна правда, большое спасибо сестрице Лене, сообщила о вас, а ваших писем всё нет. Я решил, что вы молчите и я буду молчать, но моё сердце не выдержало, ведь вы мои родные. Решил ещё одно написать и ждать вашего письма. Всё. 
До свидания.`
  },
];

const pricingPlans = {
  website: [
    {
      name: 'Базовый',
      price: 990,
      credits: 10,
      features: [
        'Генерация до 10 видео',
        'Стандартное качество',
        'Поддержка по email'
      ]
    },
    {
      name: 'Продвинутый',
      price: 2490,
      credits: 30,
      features: [
        'Генерация до 30 видео',
        'Высокое качество',
        'Приоритетная поддержка'
      ]
    },
    {
      name: 'Профессиональный',
      price: 4990,
      credits: 100,
      features: [
        'Генерация до 100 видео',
        'Максимальное качество',
        '24/7 поддержка'
      ]
    }
  ],
  api: [
    {
      name: 'API Старт',
      price: 4990,
      requests: 1000,
      features: [
        '1000 API запросов',
        'Базовая скорость',
        'Документация'
      ]
    },
    {
      name: 'API Бизнес',
      price: 9990,
      requests: 5000,
      features: [
        '5000 API запросов',
        'Повышенная скорость',
        'Техническая поддержка'
      ]
    },
    {
      name: 'API Корпоративный',
      price: 24990,
      requests: 20000,
      features: [
        '20000 API запросов',
        'Максимальная скорость',
        'Выделенная поддержка'
      ]
    }
  ]
};

const mockApiKeys = [
];

export default function Profile() {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [balance, setBalance] = useState(1500);
  const [topupAmount, setTopupAmount] = useState('');
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState({});
  const [isFullscreen, setIsFullscreen] = useState({});

  const toggleVideo = (movieId) => {
    const video = document.getElementById(`video-${movieId}`);
    if (video) {
      if (isPlaying[movieId]) {
        video.pause();
        setIsPlaying({ ...isPlaying, [movieId]: false });
      } else {
        // Pause all other videos
        Object.keys(isPlaying).forEach(id => {
          if (id !== movieId.toString()) {
            const otherVideo = document.getElementById(`video-${id}`);
            if (otherVideo) {
              otherVideo.pause();
              setIsPlaying(prev => ({ ...prev, [id]: false }));
            }
          }
        });
        video.play();
        setIsPlaying({ ...isPlaying, [movieId]: true });
      }
    }
  };

  const toggleFullscreen = async (movieId) => {
    const video = document.getElementById(`video-${movieId}`);
    if (!video) return;

    try {
      if (!document.fullscreenElement) {
        await video.requestFullscreen();
        setIsFullscreen({ ...isFullscreen, [movieId]: true });
      } else {
        await document.exitFullscreen();
        setIsFullscreen({ ...isFullscreen, [movieId]: false });
      }
    } catch (err) {
      toast.error('Ошибка при переключении полноэкранного режима');
    }
  };

  const downloadVideo = async (videoUrl, title) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Видео успешно скачано');
    } catch (error) {
      toast.error('Ошибка при скачивании видео');
    }
  };

  const downloadLetter = (text, title) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleTopup = () => {
    const amount = parseInt(topupAmount);
    if (amount > 0) {
      setBalance(prev => prev + amount);
      setTopupAmount('');
      setShowTopupModal(false);
      toast.success(`Баланс успешно пополнен на ${amount} ₽`);
    }
  };

  const handleCreateApiKey = () => {
    if (newKeyName.trim()) {
      const newKey = {
        id: apiKeys.length + 1,
        name: newKeyName,
        key: `sk_${Math.random().toString(36).substr(2, 32)}`,
        created: new Date().toISOString().split('T')[0],
        lastUsed: '-'
      };
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName('');
      setShowNewKeyModal(false);
      toast.success('Новый API ключ создан');
    }
  };

  const handleDeleteApiKey = (id) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast.success('API ключ удален');
  };

  const copyApiKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success('API ключ скопирован в буфер обмена');
    } catch (err) {
      toast.error('Не удалось скопировать API ключ');
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen({});
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <main className="min-h-screen bg-muted py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Профиль</h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Баланс</p>
                <p className="text-2xl font-bold">{balance} ₽</p>
              </div>
              <Button onClick={() => setShowTopupModal(true)}>
                Пополнить
              </Button>
            </div>
          </div>

          <Tabs defaultValue="videos" className="space-y-8">
            <div className="border-b">
              <TabsList className="w-full h-auto p-0 bg-transparent space-x-8">
                {[
                  { value: 'videos', label: 'Мои видео', icon: Play },
                  { value: 'pricing', label: 'Тарифы', icon: FileText },
                  { value: 'api', label: 'API', icon: Key }
                ].map(tab => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="relative px-4 py-6 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none group"
                    >
                      <div className="flex items-center gap-2">
                        <tab.icon className="w-5 h-5" />
                        <span className="text-lg font-medium">{tab.label}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-data-[state=active]:scale-x-100 transition-transform" />
                      <div className="absolute inset-0 rounded-lg transition-colors duration-200 bg-muted/50 group-hover:bg-muted/0 group-data-[state=active]:bg-muted/0" />
                    </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="videos" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedMovies.map((movie) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="overflow-hidden bg-card">
                      <div className="relative aspect-video">
                        <video
                          id={`video-${movie.id}`}
                          src={movie.videoUrl}
                          className="w-full h-full object-cover"
                          poster={movie.thumbnail}
                          onClick={() => toggleVideo(movie.id)}
                          controls
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleVideo(movie.id);
                              }}
                            >
                              {isPlaying[movie.id] ? (
                                <Pause className="w-8 h-8" />
                              ) : (
                                <Play className="w-8 h-8" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFullscreen(movie.id);
                              }}
                            >
                              {isFullscreen[movie.id] ? (
                                <Minimize className="w-8 h-8" />
                              ) : (
                                <Maximize className="w-8 h-8" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-sm px-2 py-1 rounded">
                          {movie.duration}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{movie.date}</p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => downloadVideo(movie.videoUrl, movie.title)}
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Скачать видео
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => downloadLetter(movie.text, movie.title)}
                              className="flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4" />
                              Скачать текст
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            Поделиться
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Тарифы для сайта</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {pricingPlans.website.map((plan, index) => (
                    <Card key={index} className="p-6">
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{plan.price} ₽</span>
                        <span className="text-muted-foreground">/месяц</span>
                      </div>
                      <div className="space-y-2 mb-6">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full">Выбрать</Button>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Тарифы API</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {pricingPlans.api.map((plan, index) => (
                    <Card key={index} className="p-6">
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{plan.price} ₽</span>
                        <span className="text-muted-foreground">/месяц</span>
                      </div>
                      <div className="space-y-2 mb-6">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full">Выбрать</Button>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">API ключи</h2>
                <Button onClick={() => setShowNewKeyModal(true)}>
                  Создать ключ
                </Button>
              </div>

              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <Card key={apiKey.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{apiKey.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {apiKey.key}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyApiKey(apiKey.key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                          Создан: {apiKey.created} • Последнее использование: {apiKey.lastUsed}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteApiKey(apiKey.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <AnimatePresence>
            {selectedLetter && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={() => setSelectedLetter(null)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-card max-w-2xl w-full rounded-lg p-6 relative"
                  onClick={e => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => setSelectedLetter(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <h3 className="text-2xl font-bold mb-4">{selectedLetter.title}</h3>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-base">
                      {selectedLetter.text}
                    </pre>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => downloadLetter(selectedLetter.text, selectedLetter.title)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Скачать письмо
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTopupModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={() => setShowTopupModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-card w-full max-w-md rounded-lg p-6 relative"
                  onClick={e => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => setShowTopupModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  <h2 className="text-2xl font-bold mb-6">Пополнение баланса</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Сумма</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={topupAmount}
                        onChange={(e) => setTopupAmount(e.target.value)}
                        placeholder="Введите сумму"
                        min="1"
                      />
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleTopup}
                      disabled={!topupAmount || parseInt(topupAmount) <= 0}
                    >
                      Пополнить
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showNewKeyModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={() => setShowNewKeyModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-card w-full max-w-md rounded-lg p-6 relative"
                  onClick={e => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => setShowNewKeyModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  <h2 className="text-2xl font-bold mb-6">Создать API ключ</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="keyName">Название ключа</Label>
                      <Input
                        id="keyName"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Введите название ключа"
                      />
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleCreateApiKey}
                      disabled={!newKeyName.trim()}
                    >
                      Создать
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}