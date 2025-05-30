'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {useRouter, useSearchParams} from 'next/navigation';
import { AlertTriangle, ChevronRight, Edit2, Play, X, RefreshCw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner';
import {API_BASE_URL, API_PYTHON_URL} from "@/app/config";

const ssmlTags = [
  { tag: 'break', description: 'Добавить паузу' },
  { tag: 'p', description: 'Добавить паузу между параграфами' },
  { tag: 'phoneme', description: 'Использовать фонетическое произношение' },
  { tag: 'speak', description: 'Корневой тег для текста в формате SSML' },
  { tag: 's', description: 'Добавить паузу между предложениями' },
  { tag: 'sub', description: 'Произношение аббревиатур' }
];

export default function Analyze() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState(null);
  const [showSsmlHelp, setShowSsmlHelp] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');

  useEffect(() => {
    let isMounted = true; // Флаг для отслеживания mounted состояния

    const fetchAnalysis = async () => {
      try {
        const response = await fetch(API_PYTHON_URL + "/prompt/" + taskId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!isMounted) return; // Не обновлять состояние, если компонент размонтирован

        if (response.ok) {
          const data = await response.json();
          setAnalysis(data.content);
        } else {
          setError('Данные анализа не найдены');
        }
      } catch (e) {
        if (isMounted) {
          setError('Ошибка при обработке данных анализа');
        }
      }
    };

    fetchAnalysis();

    // Функция очистки эффекта
    return () => {
      isMounted = false;
    };
  }, [taskId]); // Добавил taskId в зависимости, чтобы эффект запускался при его изменении

  const handleSubtitlesChange = (index, newSubtitles) => {
    const newAnalysis = [...analysis];
    newAnalysis[index] = { ...newAnalysis[index], subtitles: newSubtitles };
    setAnalysis(newAnalysis);
  };

  const handleVoiceTextChange = (index, newVoiceText) => {
    const newAnalysis = [...analysis];
    newAnalysis[index] = { ...newAnalysis[index], voice_text: newVoiceText };
    setAnalysis(newAnalysis);
  };

  const handleVoiceGenderChange = (index, newGender) => {
    const newAnalysis = [...analysis];
    newAnalysis[index] = { ...newAnalysis[index], voice_gender: newGender };
    setAnalysis(newAnalysis);
  };

  const handleVoiceMoodChange = (index, newMood) => {
    const newAnalysis = [...analysis];
    newAnalysis[index] = { ...newAnalysis[index], voice_mood: newMood };
    setAnalysis(newAnalysis);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const response = await fetch(API_PYTHON_URL + "/prompt", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysis)
      });

      const data = await response.json();
      if (response.ok) {
        setAnalysis(data);
        toast.success('Анализ успешно обновлен');
      } else {
        toast.error(data.error || 'Ошибка при обновлении анализа');
      }
    } catch (error) {
      toast.error('Ошибка подключения к серверу');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleContinue = async () => {
    const response = await fetch(API_BASE_URL + "/VideoGeneration", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify({
        "taskId": taskId,
        "text": "string",
        "colorScheme": "string",
        "resolution": "string",
        "model": "string",
        "frameRate": 0
      })
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('videoId', data.pipelineId);
      router.push('/makehistory/generate');
    } else {
      toast.error('Произошла ошибка при генерации видео, попробуйте еще раз');
      router.push('/makehistory');
    }
  };

  if (error) {
    return (
      <main className="min-h-screen bg-muted py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-8 bg-destructive/5 border-destructive">
              <div className="flex items-center gap-4 mb-6">
                <AlertTriangle className="w-12 h-12 text-destructive" />
                <h1 className="text-2xl font-bold text-destructive">Ошибка анализа</h1>
              </div>
              <p className="text-lg mb-6">{error}</p>
              <Button onClick={() => router.back()} variant="outline">
                Вернуться назад
              </Button>
            </Card>
          </motion.div>
        </div>
      </main>
    );
  }

  if (!analysis) {
    return (
      <main className="min-h-screen bg-muted py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Анализ письма</h1>
            <Button
              onClick={() => setShowSsmlHelp(!showSsmlHelp)}
              variant="outline"
            >
              Справка по тегам SSML
            </Button>
          </div>

          {showSsmlHelp && (
            <Card className="p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Доступные теги SSML</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSsmlHelp(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ssmlTags.map((tag) => (
                  <div key={tag.tag} className="flex items-start gap-2">
                    <code className="px-2 py-1 bg-muted rounded text-sm">
                      &lt;{tag.tag}&gt;
                    </code>
                    <span className="text-sm text-muted-foreground">
                      {tag.description}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="space-y-6">
            {analysis.map((scene, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Настройки голоса
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Пол голоса</Label>
                          <RadioGroup
                            value={scene.voice_gender}
                            onValueChange={(value) => handleVoiceGenderChange(index, value)}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id={`male-${index}`} />
                              <Label htmlFor={`male-${index}`}>Мужской</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id={`female-${index}`} />
                              <Label htmlFor={`female-${index}`}>Женский</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label>Окраска голоса</Label>
                          <RadioGroup
                            value={scene.voice_mood}
                            onValueChange={(value) => handleVoiceMoodChange(index, value)}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="neutral" id={`neutral-${index}`} />
                              <Label htmlFor={`neutral-${index}`}>Нейтральный</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="joyful" id={`joyful-${index}`} />
                              <Label htmlFor={`joyful-${index}`}>Радостный</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="strict" id={`strict-${index}`} />
                              <Label htmlFor={`strict-${index}`}>Строгий</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Текст для озвучки
                      </h3>
                      {editingIndex === index ? (
                        <Textarea
                          value={scene.voice_text}
                          onChange={(e) => handleVoiceTextChange(index, e.target.value)}
                          className="font-mono text-sm"
                          rows={5}
                        />
                      ) : (
                        <pre className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">
                          {scene.voice_text}
                        </pre>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Субтитры
                      </h3>
                      {editingIndex === index ? (
                        <Textarea
                          value={scene.subtitles}
                          onChange={(e) => handleSubtitlesChange(index, e.target.value)}
                          className="font-mono text-sm"
                          rows={5}
                        />
                      ) : (
                        <pre className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">
                          {scene.subtitles}
                        </pre>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Описание для генерации
                      </h3>
                      <p className="text-sm bg-muted p-3 rounded">
                        {scene.photo_prompt}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Button
              onClick={handleRegenerate}
              variant="outline"
              disabled={isRegenerating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Перегенерация...' : 'Перегенерировать'}
            </Button>
            
            <Button
              onClick={handleContinue}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <Play className="w-4 h-4" />
              Начать генерацию
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}