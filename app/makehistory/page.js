'use client';

import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {Upload} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {CustomSlider} from '@/components/ui/custom-slider';
import {useRouter, useSearchParams} from 'next/navigation';
import {API_BASE_URL} from "@/app/config";
import {toast} from "sonner";

const CustomSelector = ({options, value, onChange, label}) => {
    return (
        <div className="space-y-3">
            <h3 className="text-lg font-medium">{label}</h3>
            <div className="grid grid-cols-2 gap-3">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className="relative group"
                    >
                        <div className={`
              p-4 rounded-xl border-2 transition-all duration-300
              ${value === option.value
                            ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(0,0,0,0.1)]'
                            : 'border-muted hover:border-primary/50'}
            `}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{option.label}</span>
                                {value === option.value && (
                                    <motion.div
                                        initial={{scale: 0}}
                                        animate={{scale: 1}}
                                        className="w-2 h-2 rounded-full bg-primary"
                                    />
                                )}
                            </div>
                            {option.description && (
                                <p className="text-sm text-muted-foreground text-start">{option.description}</p>
                            )}
                        </div>
                        <motion.div
                            initial={false}
                            animate={{
                                scale: value === option.value ? 1.05 : 1,
                                opacity: value === option.value ? 1 : 0
                            }}
                            className="absolute -inset-px bg-gradient-to-r from-primary/20 to-primary/20 rounded-xl -z-10"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function MakeHistory() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        model: 'remote',
        colorScheme: 'color',
        resolution: '512x512',
        useFrameTime: 'false',
        frameTime: 5
    });

    useEffect(() => {
        const content = searchParams.get('content');
        if (content) {
            setText(decodeURIComponent(content));
        }
    }, [searchParams]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/plain') {
            setFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setText(e.target.result);
            };
            reader.readAsText(file);
        } else if (file) {
            alert('Пожалуйста, загрузите только .txt файл');
            e.target.value = '';
            setFile(null);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        const result = await fetch(API_BASE_URL + "/video-generation", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                colorScheme: settings.colorScheme,
                resolution: settings.resolution,
                frameTime: settings.useFrameTime === 'true' ? settings.frameTime : null,
                model: settings.model,
            })
        })

        if (!result.ok) {
            throw new Error('Error fetching status');
        }
        const data = await result.json();
        if (result.ok) {
            localStorage.setItem('letterAnalysis', JSON.stringify(data));
            router.push('/makehistory/analyze');
        } else {
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.error('Произошла ошибка при анализе письма');
            }
        }
    };

    return (
        <main className="min-h-screen bg-muted py-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                >
                    <Card className="max-w-2xl mx-auto p-6 bg-card">
                        <h1 className="text-3xl font-bold mb-6 text-center">Создание истории</h1>

                        <Tabs defaultValue="content" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="content"
                                             className="text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
                                    Содержание
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        initial={false}
                                        animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0}}
                                    />
                                </TabsTrigger>
                                <TabsTrigger value="settings"
                                             className="text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
                                    Настройки
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        initial={false}
                                        animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0}}
                                    />
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="content" className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Загрузить файл (.txt)</label>
                                    <div
                                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                                        <input
                                            type="file"
                                            accept=".txt"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <Upload className="h-12 w-12 mb-4 text-muted-foreground"/>
                                            <span className="text-sm text-muted-foreground">
                        {file ? file.name : 'Перетащите .txt файл сюда или нажмите для выбора'}
                      </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-muted-foreground/25"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-card text-muted-foreground">или</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Текст письма</label>
                                    <Textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Вставьте текст письма здесь..."
                                        className="min-h-[200px] outline-none rounded p-2"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="settings" className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-6 pb-6 border-b border-muted-foreground/25">
                                        <CustomSelector
                                            label="Модель"
                                            value={settings.model}
                                            onChange={(value) => {
                                                if (value === 'custom') {
                                                    setSettings({...settings, model: value, resolution: "512x512"})
                                                } else {
                                                    setSettings({...settings, model: value})
                                                }
                                            }}
                                            options={[
                                                {
                                                    value: 'custom',
                                                    label: 'Собственная (не доступно)',
                                                    description: 'Более быстрая простая генерация, на основе stable diffusion v1.5'
                                                },
                                                {
                                                    value: 'remote',
                                                    label: 'Внешняя',
                                                    description: 'Медленная, но более точная генерация, на основе DALLE'
                                                }
                                            ]}
                                        />
                                    </div>
                                    <div className="space-y-6 pb-6 border-b border-muted-foreground/25">
                                        <CustomSelector
                                            label="Цветовая гамма"
                                            value={settings.colorScheme}
                                            onChange={(value) => setSettings({...settings, colorScheme: value})}
                                            options={[
                                                {
                                                    value: 'color',
                                                    label: 'Цветное',
                                                    description: 'Генерация в полноцветном режиме'
                                                },
                                                {
                                                    value: 'bw',
                                                    label: 'Черно-белое',
                                                    description: 'Стилизация под старые фотографии'
                                                }
                                            ]}
                                        />

                                        <CustomSelector
                                            label="Разрешение"
                                            value={settings.resolution}
                                            onChange={(value) => setSettings({...settings, resolution: value})}
                                            options={
                                            settings.model === 'custom' ? [
                                                {
                                                    value: '512x512',
                                                    label: '512x512',
                                                    description: 'Стандартное качество'
                                                }
                                            ] : [
                                                {
                                                    value: '512x512',
                                                    label: '512x512',
                                                    description: 'Стандартное качество'
                                                },
                                                {
                                                    value: '1024x1024',
                                                    label: '1024x1024',
                                                    description: 'Высокое качество'
                                                }
                                            ]}
                                        />

                                    </div>
                                    <div className={`space-y-6 pb-6 border-muted-foreground/25 ${settings.useFrameTime === 'true' ? 'border-b' : ''}`}>
                                        <CustomSelector
                                            label="Использовать время на кадр"
                                            value={settings.useFrameTime}
                                            onChange={(value) => setSettings({...settings, useFrameTime: value})}
                                            options={[
                                                {
                                                    value: 'true',
                                                    label: 'Да',
                                                    description: 'Кадры будут меняться с заданым промежутком (не рекомендуется)'
                                                },
                                                {
                                                    value: 'false',
                                                    label: 'Нет',
                                                    description: 'Кадры будут меняться согласно логике озвучки'
                                                }
                                            ]}
                                        />

                                        {
                                            settings.useFrameTime === 'true' &&
                                            <div>
                                                <h3 className="text-lg font-medium mb-3">Время на кадр (секунды)</h3>
                                                <div className="space-y-3">
                                                    <CustomSlider
                                                        value={settings.frameTime}
                                                        onChange={(value) => setSettings({...settings, frameTime: value})}
                                                        min={1}
                                                        max={20}
                                                        step={1}
                                                    />
                                                    <p className="text-sm text-muted-foreground text-right">
                                                        {settings.frameTime} сек
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="pt-6">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center relative overflow-hidden group bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-800 hover:via-red-700 hover:to-red-800 text-white font-semibold py-7 text-lg rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300 ease-out hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-105"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <motion.div
                                            className="flex space-x-2"
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                        >
                                            {[0, 1, 2].map((index) => (
                                                <motion.div
                                                    key={index}
                                                    className="w-3 h-3 bg-white rounded-full"
                                                    animate={{
                                                        y: ["0%", "-50%", "0%"],
                                                        opacity: [1, 0.5, 1],
                                                    }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        delay: index * 0.2,
                                                    }}
                                                />
                                            ))}
                                        </motion.div>
                                        <span className="ml-3">Генерация...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                                        <span>Начать генерацию</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </main>
    );
}