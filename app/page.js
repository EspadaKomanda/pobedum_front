'use client';

import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
    <motion.div 
      className="flex h-full w-[300vw]"
      animate={{ x: ['0%', '-60%', '0%'] }}
      transition={{ 
        duration: 90,
        ease: "linear",
        repeat: Infinity 
      }}
    >
      {[...Array(3)].map((_, i) => (
        <div key={i} className="relative h-full w-screen">
          <div className="absolute inset-0 bg-[url('/collage.webp')] bg-cover bg-center opacity-70" />
        </div>
      ))}
    </motion.div>
    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/80 to-black/100" />
  </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Оживим письма фронтовиков вместе
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Используя современные технологии, мы превращаем письма военных лет в живые анимированные истории
          </motion.p>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              size="lg" 
              className="relative overflow-hidden group bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-800 hover:via-red-700 hover:to-red-800 text-white font-semibold px-10 py-7 text-lg rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300 ease-out hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-105"
              onClick={() => router.push('/makehistory')}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              Создать историю
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Как это работает</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: 'Загрузка',
                description: 'Загрузите фотографию или скан письма фронтовика'
              },
              {
                icon: Upload,
                title: 'Обработка',
                description: 'Искусственный интеллект анализирует и оживляет изображение'
              },
              {
                icon: Upload,
                title: 'Просмотр',
                description: 'Получите уникальную анимированную историю'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}