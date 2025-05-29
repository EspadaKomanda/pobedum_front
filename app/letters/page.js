'use client';

import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {
    ArrowUp,
    ChevronLeft,
    ChevronRight,
    Copy,
    Download,
    Filter, Flag,
    Globe,
    Heart,
    History,
    Share2,
    Upload,
    User,
    X
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {useRouter} from 'next/navigation';
import {API_BASE_URL} from "@/app/config";
import {toast} from "sonner";

export default function Letters() {
    const router = useRouter();
    const [letters, setLetters] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newLetter, setNewLetter] = useState({title: '', content: '', date: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const loadMoreRef = useRef(null);
    const [currentPage, setCurrentPage] = useState({
        number: -1,
        size: 30,
        totalElements: 0,
        totalPages: 0
    });
    const [filters, setFilters] = useState({
        onlyFavorites: false,
        onlyLong: false,
        onlyMine: false,
        resource: null
    });
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportData, setReportData] = useState({
        letterId: null,
        reason: '',
        evidence: null
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && !isLoading && currentPage.number < currentPage.totalPages) {
                    loadMore();
                }
            },
            {
                rootMargin: '100px',
            }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [currentPage, isLoading]);

    useEffect(() => {
        loadMore(true)
    }, [filters]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    async function handleResponse(response) {
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Произошла ошибка');
        }
        if (response.status === 401) {
            router.push('/login');
            return;
        }
        if (response.status === 403) {
            router.push('/forbidden');
            return;
        }
        if (response.status === 404) {
            router.push('/404');
            return;
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return 'ok';
        }
    }

    async function getLetters(page) {
        const params = new URLSearchParams();
        if (filters.onlyFavorites !== false) params.append('isFavorite', filters.onlyFavorites);
        if (filters.onlyMine !== false) params.append('isOwn', filters.onlyMine);
        if (filters.resource) params.append('resource', filters.resource);
        if (filters.onlyLong !== false) params.append('onlyLong', filters.onlyLong);
        if (page) params.append('page', page.page);
        if (page) params.append('size', page.size);

        const response = await fetch(`${API_BASE_URL}/letters?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return handleResponse(response);
    }

    function loadMore(first = false) {
        setIsLoading(true);
        getLetters(first ? {
            page: 0,
            size: currentPage.size
        } : {
            page: currentPage.number + 1,
            size: currentPage.size
        }).then(
            (data) => {
                first ? setLetters(data.content) : setLetters([...letters, ...data.content]);
                setCurrentPage(data.page);
                setIsLoading(false);
            },
            (error) => {
                toast.error(error);
                setIsLoading(false);
            }
        );
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/plain') {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setNewLetter({...newLetter, content});
            };
            reader.readAsText(file);
            setIsUploading(false);
        }
    };

    async function createLetter() {
        const response = await fetch(`${API_BASE_URL}/letters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newLetter),
        });

        return handleResponse(response);
    }

    const handleSaveLetter = () => {
        if (newLetter.title && newLetter.content) {
            createLetter().then(
                (data) => {
                    setLetters([...letters, data]);
                    setShowUploadModal(false);
                },
                (error) => {
                    toast.error(error);
                }
            )
            setShowUploadModal(false);
        }
    };

    const toggleFavorite = (id) => {
        let flag = false;
        if (flag) {
            // Добавление в избранное
            async function addToFavorites(id) {
                const response = await fetch(`${API_BASE_URL}/letters/${id}/favorite`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (await handleResponse(response) === 'ok') {
                    setLetters(letters.map(letter => {
                            if (letter.id === id) {
                                return {...letter, isFavorite: true};
                            } else {
                                return letter;
                            }
                        }
                    ));
                }
                return 'ok';
            }

            addToFavorites(id)
        } else {

            // Удаление из избранного
            async function removeFromFavorites(id) {
                const response = await fetch(`${API_BASE_URL}/letters/${id}/favorite`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (await handleResponse(response) === 'ok') {
                    setLetters(letters.map(letter => {
                            if (letter.id === id) {
                                return {...letter, isFavorite: false};
                            } else {
                                return letter;
                            }
                        }
                    ));
                }
                return 'ok';
            }

            removeFromFavorites(id)
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Текст скопирован в буфер обмена');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const downloadLetter = (text, title) => {
        const blob = new Blob([text], {type: 'text/plain'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleGenerateStory = (letter) => {
        router.push(`/makehistory?content=${encodeURIComponent(letter.content)}`);
    };

    const handleScrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleReportFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReportData({ ...reportData, evidence: file });
        }
    };

    const handleReport = (letterId) => {
        setReportData({ letterId, reason: '', evidence: null });
        setShowReportModal(true);
    };

    const handleSubmitReport = async () => {
        try {
            // Here you would typically send the report to your backend
            // For now, we'll just show a success message
            toast.success('Жалоба отправлена');
            setShowReportModal(false);
            setReportData({ letterId: null, reason: '', evidence: null });
        } catch (error) {
            toast.error('Ошибка при отправке жалобы');
        }
    };

    return (
        <main className="min-h-screen bg-muted py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold">Письма</h1>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex gap-2">
                            <Button
                                variant={filters.resource ? "default" : "outline"}
                                onClick={() => setFilters(f => ({
                                    ...f,
                                    resource: !f.resource ? "pismapobedy.ru" : null
                                }))}
                                className="flex items-center gap-2"
                            >
                                <Globe className="w-4 h-4"/>
                                pismapobedy.ru
                            </Button>
                            <Button
                                variant={filters.onlyFavorites ? "default" : "outline"}
                                onClick={() => setFilters(f => ({...f, onlyFavorites: !f.onlyFavorites}))}
                                className="flex items-center gap-2"
                            >
                                <Heart className="w-4 h-4" fill={filters.onlyFavorites ? "currentColor" : "none"}/>
                                Избранное
                            </Button>
                            <Button
                                variant={filters.onlyLong ? "default" : "outline"}
                                onClick={() => setFilters(f => ({...f, onlyLong: !f.onlyLong}))}
                                className="flex items-center gap-2"
                            >
                                <Filter className="w-4 h-4"/>
                                Длинные
                            </Button>
                            <Button
                                variant={filters.onlyMine ? "default" : "outline"}
                                onClick={() => setFilters(f => ({...f, onlyMine: !f.onlyMine}))}
                                className="flex items-center gap-2"
                            >
                                <User className="w-4 h-4"/>
                                Мои
                            </Button>
                        </div>
                        <Button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Загрузить письмо
                        </Button>
                    </div>
                </div>

                {letters.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-lg text-muted-foreground">Писем не найдено</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {letters.map((letter) => (
                                <motion.div
                                    key={letter.id}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.3}}
                                >
                                    <Card className="p-6 h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2">{letter.title}</h3>
                                                <p className="text-sm text-muted-foreground">{letter.date}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleGenerateStory(letter)}
                                                    className="text-primary"
                                                >
                                                    <History className="w-5 h-5"/>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleFavorite(letter.id)}
                                                    className={letter.isFavorite ? 'text-red-500' : ''}
                                                >
                                                    <Heart className="w-5 h-5"
                                                           fill={letter.isFavorite ? 'currentColor' : 'none'}/>
                                                </Button>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground mb-6 line-clamp-3">{letter.content}</p>

                                        <div className="mt-auto flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedLetter(letter)}
                                            >
                                                Читать
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copyToClipboard(letter.content)}
                                            >
                                                <Copy className="w-4 h-4"/>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => downloadLetter(letter.content, letter.title)}
                                            >
                                                <Download className="w-4 h-4"/>
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Share2 className="w-4 h-4"/>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleReport(letter.id)}
                                                className="text-destructive"
                                            >
                                                <Flag className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                        {/* Loading indicator and intersection observer target */}
                        {currentPage.number < currentPage.totalPages && (
                            <div
                                ref={loadMoreRef}
                                className="flex justify-center py-8"
                            >
                                <div className="animate-pulse flex space-x-2">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Scroll to top button */}
                <AnimatePresence>
                    {showScrollTop && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="fixed bottom-8 right-8 z-50"
                        >
                            <Button
                                size="icon"
                                className="w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
                                onClick={handleScrollTop}
                            >
                                <ArrowUp className="w-12 h-12 p-3" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Upload Modal */}
                <AnimatePresence>
                    {showUploadModal && (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        >
                            <motion.div
                                initial={{scale: 0.95}}
                                animate={{scale: 1}}
                                exit={{scale: 0.95}}
                                className="bg-card w-full max-w-lg rounded-lg p-6 relative"
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-4"
                                    onClick={() => setShowUploadModal(false)}
                                >
                                    <X className="w-4 h-4"/>
                                </Button>

                                <h2 className="text-2xl font-bold mb-6">Загрузить письмо</h2>

                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="title">Название</Label>
                                        <Input
                                            id="title"
                                            value={newLetter.title}
                                            className="outline-none rounded"
                                            onChange={(e) => setNewLetter({...newLetter, title: e.target.value})}
                                            placeholder="Введите название письма"
                                        />
                                    </div>

                                    <div>
                                        <Label>Текст письма</Label>
                                        <div
                                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors mb-4">
                                            <input
                                                type="file"
                                                accept=".txt"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="letter-upload"
                                            />
                                            <label
                                                htmlFor="letter-upload"
                                                className="cursor-pointer flex flex-col items-center"
                                            >
                                                <Upload className="h-12 w-12 mb-4 text-muted-foreground"/>
                                                <span className="text-sm text-muted-foreground">
                          Загрузить .txt файл
                        </span>
                                            </label>
                                        </div>
                                        <Textarea
                                            value={newLetter.content}
                                            onChange={(e) => setNewLetter({...newLetter, content: e.target.value})}
                                            placeholder="Или введите текст письма здесь..."
                                            className="min-h-[200px] outline-none rounded-lg p-1"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                                            Отмена
                                        </Button>
                                        <Button onClick={handleSaveLetter}
                                                disabled={!newLetter.title || !newLetter.content}>
                                            Сохранить
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Report Modal */}
                <AnimatePresence>
                    {showReportModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={() => setShowReportModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.95 }}
                                className="bg-card w-full max-w-lg rounded-lg p-6 relative"
                                onClick={e => e.stopPropagation()}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-4"
                                    onClick={() => setShowReportModal(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>

                                <h2 className="text-2xl font-bold mb-6">Отправить жалобу</h2>

                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="reason">Причина жалобы</Label>
                                        <Textarea
                                            id="reason"
                                            value={reportData.reason}
                                            onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
                                            placeholder="Опишите причину жалобы..."
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <div>
                                        <Label>Подтверждающие материалы</Label>
                                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                                            <input
                                                type="file"
                                                onChange={handleReportFileUpload}
                                                className="hidden"
                                                id="evidence-upload"
                                            />
                                            <label
                                                htmlFor="evidence-upload"
                                                className="cursor-pointer flex flex-col items-center"
                                            >
                                                <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">
                          {reportData.evidence ? reportData.evidence.name : 'Загрузить файл'}
                        </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button variant="outline" onClick={() => setShowReportModal(false)}>
                                            Отмена
                                        </Button>
                                        <Button
                                            onClick={handleSubmitReport}
                                            disabled={!reportData.reason}
                                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                        >
                                            Отправить жалобу
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Letter View Modal */}
                <AnimatePresence>
                    {selectedLetter && (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={() => setSelectedLetter(null)}
                        >
                            <motion.div
                                initial={{scale: 0.95}}
                                animate={{scale: 1}}
                                exit={{scale: 0.95}}
                                className="bg-card w-full max-w-2xl rounded-lg p-6 relative"
                                onClick={e => e.stopPropagation()}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-4"
                                    onClick={() => setSelectedLetter(null)}
                                >
                                    <X className="w-4 h-4"/>
                                </Button>

                                <h2 className="text-2xl font-bold mb-2">{selectedLetter.title}</h2>
                                <p className="text-sm text-muted-foreground mb-6">{selectedLetter.date}</p>

                                <div className="prose max-w-none mb-6">
                  <pre className="whitespace-pre-wrap font-sans text-base">
                    {selectedLetter.content}
                  </pre>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        className={"flex flex-row gap-2 mr-2"}
                                        variant="outline"
                                        onClick={() => copyToClipboard(selectedLetter.content)}
                                    >
                                        <Copy className="w-4 h-4 mr-2"/>
                                        Копировать
                                    </Button>
                                    <Button
                                        className={"flex flex-row gap-2 mr-2"}
                                        variant="outline"
                                        onClick={() => downloadLetter(selectedLetter.content, selectedLetter.title)}
                                    >
                                        <Download className="w-4 h-4 mr-2"/>
                                        Скачать
                                    </Button>
                                    <Button
                                        className={"flex flex-row gap-2 mr-2"}
                                        variant="default"
                                        onClick={() => {
                                            handleGenerateStory(selectedLetter);
                                            setSelectedLetter(null);
                                        }}
                                    >
                                        <History className="w-4 h-4 mr-2"/>
                                        Создать историю
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}