'use client';

import {useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ChevronRight, Edit2, Play, X, RefreshCw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const sampleAnalysis = [
  {
    "text": "Здравствуйте, мама, брат и сестра! Примите мой родной боевой с фронта и массу самых наилучших пожеланий в вашей жизни и здоровья.",
    "voice_text": "<speak>Здравствуйте, мама<break time='300ms'/>, брат и сестра! <p>Примите мой родной боевой с фронта и массу самых наилучших пожеланий в вашей жизни и здоровья.</p></speak>",
    "voice_gender": "male",
    "voice_mood": "neutral",
    "subtitles": "Здравствуйте, мама, брат и сестра!\nПримите мой родной боевой с фронта\nи массу самых наилучших пожеланий\nв вашей жизни и здоровья.",
    "photo_prompt": "A soldier in a worn uniform writing a letter by candlelight, his face showing determination and warmth. The dim light casts shadows on the wooden table. Patriotic illustration, muted lighting, size 1024x1024."
  },
  {
    "text": "Жизнь моя в настоящее время протекает хорошо. Я жив, здоров. Больше трёх лет прошло со дня страшной вашей жизни.",
    "voice_text": "<speak>Жизнь моя в настоящее время протекает хорошо. <break time='500ms'/> Я жив, здоров. <p>Больше трёх лет прошло со дня страшной вашей жизни.</p></speak>",
    "voice_gender": "male",
    "voice_mood": "neutral",
    "subtitles": "Жизнь моя в настоящее время\nпротекает хорошо. Я жив, здоров.\nБольше трёх лет прошло со дня\nстрашной вашей жизни.",
    "photo_prompt": "A soldier standing in a field, looking into the distance with a mix of relief and sorrow. The landscape is barren, with a cloudy sky overhead. Patriotic illustration, soft diffused light, size 1024x1024."
  },
  {
    "text": "Эти три с лишним года я переживал и беспокоился о вашей жизни или судьбе. Всё это время я ждал хотя бы одного вашего слова и вот радостный день настал, вы стали свободные.",
    "voice_text": "<speak>Эти три с лишним года я переживал и беспокоился о вашей жизни или судьбе. <break time='300ms'/> Всё это время я ждал хотя бы одного вашего слова <break time='200ms'/> и вот радостный день настал, <break time='300ms'/> вы стали свободные.</speak>",
    "voice_gender": "male",
    "voice_mood": "joyful",
    "subtitles": "Эти три с лишним года я переживал\nи беспокоился о вашей жизни или\nсудьбе. Всё это время я ждал хотя\nбы одного вашего слова и вот\nрадостный день настал, вы стали\nсвободные.",
    "photo_prompt": "A man in military uniform smiling faintly as he reads a letter, his eyes reflecting hope. A small window lets in a beam of sunlight. Patriotic illustration, warm sunlight, size 1024x1024."
  },
  {
    "text": "Я много послал вам писем, но ответа не одного не получил, причина этому мне не известна правда, большое спасибо сестрице Лене, сообщила о вас, а ваших писем всё нет.",
    "voice_text": "<speak>Я много послал вам писем, но ответа не одного не получил, <break time='300ms'/> причина этому мне не известна правда, <break time='200ms'/> большое спасибо сестрице Лене, сообщила о вас, <break time='300ms'/> а ваших писем всё нет.</speak>",
    "voice_gender": "male",
    "voice_mood": "strict",
    "subtitles": "Я много послал вам писем, но\nответа не одного не получил,\nпричина этому мне не известна\nправда, большое спасибо сестрице\nЛене, сообщила о вас, а ваших\nписем всё нет.",
    "photo_prompt": "A soldier sitting at a desk, his expression a mix of frustration and gratitude as he holds a letter. The room is sparsely furnished with a single lamp. Patriotic illustration, dim lighting, size 1024x1024."
  },
  {
    "text": "Я решил, что вы молчите и я буду молчать, но моё сердце не выдержало, ведь вы мои родные. Решил ещё одно написать и ждать вашего письма. Всё. До свидания.",
    "voice_text": "<speak>Я решил, что вы молчите и я буду молчать, <break time='300ms'/> но моё сердце не выдержало, ведь вы мои родные. <break time='500ms'/> Решил ещё одно написать и ждать вашего письма. <break time='700ms'/> Всё. <break time='300ms'/> До свидания.</speak>",
    "voice_gender": "male",
    "voice_mood": "neutral",
    "subtitles": "Я решил, что вы молчите и я буду\nмолчать, но моё сердце не выдержало,\nведь вы мои родные. Решил ещё одно\nнаписать и ждать вашего письма.\nВсё. До свидания.",
    "photo_prompt": "A soldier finishing a letter, his hand slightly trembling as he signs off. The background shows a simple barracks with a faint glow from a lantern. Patriotic illustration, soft warm light, size 1024x1024."
  }
];

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
  const [analysis, setAnalysis] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState(null);
  const [showSsmlHelp, setShowSsmlHelp] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    // Get analysis data from localStorage
    const analysisData = localStorage.getItem('letterAnalysis');
    if (analysisData) {
      try {
        const data = JSON.parse(analysisData);
        if (data.error) {
          setError(data.error);
        } else {
          setAnalysis(data);
        }
      } catch (e) {
        setError('Ошибка при обработке данных анализа');
      }
    } else {
      setError('Данные анализа не найдены');
    }
  }, []);

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
    // Здесь будет логика отправки запроса на перегенерацию
    setTimeout(() => {
      setIsRegenerating(false);
    }, 2000);
  };

  const handleContinue = () => {
    router.push('/makehistory/generate');
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