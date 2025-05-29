'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Download, Play, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/app/config';

function formatStatus(status) {
    const statusMap = {
        WAITING: "Ожидание",
        VALIDATION: "Валидация",
        ANALYZE_LETTER: "Анализ письма",
        CREATING_IMAGES: "Создание изображений",
        CREATING_AUDIO: "Генерация аудио",
        MAKING_VIDEOS: "Сборка видео",
        ADD_SOUND: "Добавление звука",
        MERGE_VIDEOS: "Объединение сцен",
        FINAL_PROCESS: "Финальная обработка",
        SUCCESS: "Готово",
        ERROR: "Ошибка",
    };
    return statusMap[status] || status;
}

const fetchStatus = async () => {
    const result = await fetch(API_BASE_URL + '/video-generation/status/' + localStorage.getItem('videoId'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!result.ok) {
        throw new Error('Error fetching status');
    }
    return await result.json();
};

const fetchQueuePosition = async () => {
    const result = await fetch(API_BASE_URL + '/video-generation/queue-position/' + localStorage.getItem('videoId'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!result.ok) {
        throw new Error('Error fetching queue position');
    }
    return await result.json();
};

export default function Generate() {
    const [status, setStatus] = useState('WAITING');
    const [progress, setProgress] = useState(0);
    const [queuePosition, setQueuePosition] = useState(null);
    const [result, setResult] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [envelopes, setEnvelopes] = useState([]);
    const containerRef = useRef(null);

    const flyingImages = ['/let1.jpg', '/let2.jpg', '/let3.jpg'];

    useEffect(() => {
        const interval = setInterval(async () => {
            const { status: newStatus, progress: newProgress } = await fetchStatus();
            if (status === 'WAITING') {
                const position = await fetchQueuePosition();
                setQueuePosition(position);
            }

            setStatus(newStatus);
            setProgress(newProgress);
            if ((newStatus === 'SUCCESS' || newStatus === 'ERROR') && newProgress >= 95) {
                clearInterval(interval);
                const result = await fetch(API_BASE_URL + '/videos/' + localStorage.getItem('videoId'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (result.ok) {
                    setResult(await result.json());
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Envelope animation logic
    useEffect(() => {
        if (result) return;
        const spawn = setInterval(() => {
            const id = Date.now() + Math.random();
            const side = Math.floor(Math.random() * 4);
            let x, y;
            const width = window.innerWidth;
            const height = window.innerHeight;
            switch (side) {
                case 0: x = Math.random() * width; y = -50; break;
                case 1: x = width + 50; y = Math.random() * height; break;
                case 2: x = Math.random() * width; y = height + 50; break;
                case 3: x = -50; y = Math.random() * height; break;
            }

            const bar = containerRef.current?.querySelector('.progress-bar');
            if (!bar) return;
            const barRect = bar.getBoundingClientRect();
            const targetX = barRect.left + (barRect.width * (progress / 100));
            const targetY = barRect.top + barRect.height / 2;

            const img = flyingImages[Math.floor(Math.random() * flyingImages.length)];
            const newEnv = { id, x, y, targetX, targetY, img };
            setEnvelopes(envs => [...envs, newEnv]);
            setTimeout(() => {
                setEnvelopes(envs => envs.filter(e => e.id !== id));
            }, 2000);
        }, 300);

        return () => clearInterval(spawn);
    }, [progress, result]);

    const handleShare = () => setShowShareModal(true);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Ссылка скопирована в буфер обмена");
            setShowShareModal(false);
        } catch (err) {
            toast.error("Не удалось скопировать ссылку");
        }
    };

    const handleDownload = () => {
        toast.success("Начинаем скачивание");
    };

    return (
        <main className="min-h-screen bg-muted pt-24 relative" ref={containerRef}>
            <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
                <AnimatePresence mode="wait">
                    {!result && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl font-bold mb-4">
                                {status === 'WAITING'
                                    ? `Ваша позиция в очереди: ${queuePosition ?? 'Рассчитываем))'}`
                                    : formatStatus(status)
                                }
                            </h2>
                            <div className="relative w-96 bg-muted-foreground/20 h-2 rounded-full overflow-hidden mb-8 progress-bar">
                                <motion.div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${progress}%` }}
                                    transition={{ ease: 'linear', duration: 0.4 }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-4xl"
                        >
                            <Card className="p-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="relative aspect-video rounded-xl overflow-hidden">
                                        <img
                                            src="https://images.pexels.com/photos/6499765/pexels-photo-6499765.jpeg"
                                            alt="Generated Video Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white"
                                            >
                                                <Play className="w-8 h-8" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-3xl font-bold mb-4">Генерация завершена</h2>
                                        <p className="text-muted-foreground mb-6">
                                            Ваша история успешно создана. Теперь вы можете посмотреть результат, скачать видео или поделиться им.
                                        </p>

                                        <div className="space-y-4">
                                            <Button className="w-full flex items-center justify-center gap-2 bg-primary">
                                                <Play className="w-4 h-4" />
                                                Смотреть видео
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full flex items-center justify-center gap-2"
                                                onClick={handleDownload}
                                            >
                                                <Download className="w-4 h-4" />
                                                Скачать
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full flex items-center justify-center gap-2"
                                                onClick={handleShare}
                                            >
                                                <Share2 className="w-4 h-4" />
                                                Поделиться
                                            </Button>
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="font-semibold mb-2">Информация</h3>
                                            <dl className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">Длительность:</dt>
                                                    <dd>{result.durationSeconds} сек</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">Разрешение:</dt>
                                                    <dd>{result.resolution}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">Размер файла:</dt>
                                                    <dd>{result.sizeMB} MB</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Flying animations */}
                {!result && envelopes.map(env => (
                    <motion.img
                        key={env.id}
                        src={env.img}
                        alt="animated shape"
                        className="fixed w-20 h-20 pointer-events-none"
                        style={{ left: env.x, top: env.y }}
                        animate={{ left: env.targetX, top: env.targetY, opacity: [1, 0] }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                    />
                ))}

                <AnimatePresence>
                    {showShareModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={() => setShowShareModal(false)}
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
                                    onClick={() => setShowShareModal(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>

                                <h2 className="text-2xl font-bold mb-6">Поделиться</h2>

                                <Button
                                    onClick={handleCopyLink}
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    Скопировать ссылку
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
