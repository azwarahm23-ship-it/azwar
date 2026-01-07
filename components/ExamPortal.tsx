
import React, { useState, useEffect, useCallback } from 'react';
import { ExamStatus, Question, ExamResult } from '../types';
import { SAMPLE_QUESTIONS } from '../constants';
import ExamHeader from './ExamHeader';
import TeacherPanel from './TeacherPanel';
import { analyzeExamResults } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const EXAM_DURATION = 600; // 10 minutes

const ExamPortal: React.FC = () => {
  const [status, setStatus] = useState<ExamStatus>(ExamStatus.IDLE);
  const [studentName, setStudentName] = useState('');
  const [questions, setQuestions] = useState<Question[]>(SAMPLE_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startExam = () => {
    if (questions.length === 0) return alert('Belum ada soal tersedia. Hubungi Guru.');
    if (!studentName.trim()) return alert('Masukkan nama Anda');
    setStatus(ExamStatus.ONGOING);
    setTimeLeft(EXAM_DURATION);
  };

  const finishExam = useCallback(async () => {
    setIsLoading(true);
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
    const feedback = await analyzeExamResults(finalScore, 100, "Ujian EduQuest");

    setResult({
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      score: Math.round(finalScore),
      aiFeedback: feedback
    });
    setStatus(ExamStatus.COMPLETED);
    setIsLoading(false);
  }, [answers, questions]);

  useEffect(() => {
    let timer: number;
    if (status === ExamStatus.ONGOING && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === ExamStatus.ONGOING) {
      finishExam();
    }
    return () => clearInterval(timer);
  }, [status, timeLeft, finishExam]);

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  if (status === ExamStatus.TEACHER) {
    return (
      <TeacherPanel 
        questions={questions} 
        onUpdateQuestions={setQuestions} 
        onBack={() => setStatus(ExamStatus.IDLE)} 
      />
    );
  }

  if (status === ExamStatus.IDLE) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
        {/* Background blobs for aesthetics */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block bg-indigo-100 p-3 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">EduQuest</h2>
            <p className="text-slate-500 mt-1 font-medium italic">Empowering Digital Learning</p>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Login Siswa</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Masukkan Nama Lengkap..."
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              />
              <button
                onClick={startExam}
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200"
              >
                Mulai Ujian
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Atau</span></div>
            </div>

            <button
              onClick={() => setStatus(ExamStatus.TEACHER)}
              className="w-full flex items-center justify-center gap-2 border-2 border-slate-100 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-all group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Masuk Panel Guru
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === ExamStatus.ONGOING) {
    const currentQ = questions[currentQuestionIndex];
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <ExamHeader title="Sesi Ujian Aktif" studentName={studentName} timeLeft={timeLeft} />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                Nomor {currentQuestionIndex + 1} / {questions.length}
              </span>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div key={i} className={`w-8 h-1 rounded-full ${i === currentQuestionIndex ? 'bg-indigo-600' : 'bg-slate-100'}`} />
                ))}
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">
              {currentQ.text}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(currentQ.id, idx)}
                  className={`p-5 text-left rounded-2xl border-2 transition-all group relative overflow-hidden ${
                    answers[currentQ.id] === idx 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg border-2 ${
                      answers[currentQ.id] === idx ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className={`text-lg ${answers[currentQ.id] === idx ? 'text-indigo-900 font-bold' : 'text-slate-600 font-medium'}`}>
                      {option}
                    </span>
                  </div>
                  {answers[currentQ.id] === idx && (
                    <div className="absolute top-0 right-0 p-3 text-indigo-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 -mr-4 -mt-4 opacity-10" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="px-6 py-2 rounded-xl font-bold text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              Sebelumnya
            </button>
            
            <div className="hidden sm:flex gap-1.5">
               {questions.map((q, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setCurrentQuestionIndex(idx)}
                   className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                     currentQuestionIndex === idx ? 'bg-indigo-600 text-white' : 
                     answers[q.id] !== undefined ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400'
                   }`}
                 >
                   {idx + 1}
                 </button>
               ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={finishExam}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-100 active:scale-95"
              >
                Selesaikan Ujian
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
              >
                Selanjutnya
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (status === ExamStatus.COMPLETED && result) {
    const data = [
      { name: 'Benar', value: result.correctAnswers },
      { name: 'Salah', value: result.totalQuestions - result.correctAnswers }
    ];

    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-slate-800 relative z-10 tracking-tight">Hasil Ujian</h2>
            <p className="text-slate-400 mt-2 font-medium relative z-10 uppercase tracking-widest text-sm">Review Performa Siswa</p>
            <div className="absolute top-0 right-0 opacity-5 -mr-10 -mt-10">
               <svg className="w-64 h-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#4F46E5" d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.6,-31.3,86.9,-15.6,85.3,-0.9C83.7,13.8,77.3,27.6,68.9,39.2C60.5,50.8,50.1,60.2,38.1,67.7C26.1,75.2,12.6,80.8,-1.2,82.9C-15,84.9,-30,83.4,-43.3,77C-56.6,70.5,-68.2,59.1,-75.8,45.5C-83.3,31.9,-86.8,16,-86.4,0.2C-86.1,-15.5,-81.8,-31.1,-73.4,-44.1C-65,-57.1,-52.4,-67.5,-38.5,-74.3C-24.5,-81.1,-12.3,-84.3,1.4,-86.7C15.1,-89.1,31.2,-83.6,44.7,-76.4Z" transform="translate(100 100)" /></svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center group hover:border-indigo-200 transition-all">
              <p className="text-slate-400 font-bold mb-4 uppercase tracking-[0.2em] text-xs">Nilai Akhir</p>
              <div className="text-8xl font-black text-indigo-600 mb-2 drop-shadow-sm group-hover:scale-110 transition-transform">{result.score}</div>
              <p className="text-slate-500 font-medium">Berdasarkan {result.totalQuestions} soal</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Distribusi Jawaban</h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}} />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/10 p-3 rounded-2xl group-hover:bg-indigo-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold tracking-tight">Analisis AI EduQuest</h4>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Personalized Mentorship</p>
                </div>
              </div>
              <p className="text-slate-200 text-xl leading-relaxed italic font-light">
                "{isLoading ? 'Menghubungi AI untuk evaluasi...' : result.aiFeedback}"
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-5 bg-white border-2 border-slate-200 text-slate-800 font-black rounded-3xl hover:bg-slate-50 transition-all text-lg shadow-sm active:scale-[0.98]"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ExamPortal;
