'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">О проекте</h3>
            <p className="text-gray-400">
              Проект разработан для студенческого Хакатона Победы
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Команда</h3>
            <p className="text-gray-400">
              Над проектом работала команда Эспада
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Документация</h3>
            <Link 
              href="/docs" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              API документация
            </Link>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Правовая информация</h3>
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Пользовательское соглашение
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© 2025 Письма фронтовиков. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}