
import React from 'react';
import { Question } from './types';

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'Siapakah presiden pertama Indonesia?',
    options: ['Soeharto', 'Ir. Soekarno', 'B.J. Habibie', 'Abdurrahman Wahid'],
    correctAnswer: 1
  },
  {
    id: '2',
    text: 'Berapakah hasil dari 15 x 3 + 5?',
    options: ['45', '50', '55', '60'],
    correctAnswer: 1
  },
  {
    id: '3',
    text: 'Apa ibu kota dari provinsi Jawa Barat?',
    options: ['Jakarta', 'Semarang', 'Surabaya', 'Bandung'],
    correctAnswer: 3
  },
  {
    id: '4',
    text: 'Planet manakah yang dijuluki sebagai Planet Merah?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturnus'],
    correctAnswer: 1
  },
  {
    id: '5',
    text: 'Unsur kimia dengan lambang "O" adalah?',
    options: ['Emas', 'Oksigen', 'Osmium', 'Perak'],
    correctAnswer: 1
  }
];

export const Icons = {
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
};
