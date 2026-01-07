
import React from 'react';
import { Icons } from '../constants';

interface ExamHeaderProps {
  title: string;
  studentName: string;
  timeLeft: number;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({ title, studentName, timeLeft }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 text-white p-2 rounded-lg">
          <Icons.Check />
        </div>
        <div>
          <h1 className="font-bold text-xl text-slate-800">{title}</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <Icons.User /> {studentName}
          </p>
        </div>
      </div>
      
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg font-bold border ${timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
        <Icons.Clock />
        {formatTime(timeLeft)}
      </div>
    </header>
  );
};

export default ExamHeader;
