
import React, { useState } from 'react';
import { Question } from '../types';

interface TeacherPanelProps {
  questions: Question[];
  onUpdateQuestions: (questions: Question[]) => void;
  onBack: () => void;
}

const TeacherPanel: React.FC<TeacherPanelProps> = ({ questions, onUpdateQuestions, onBack }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const handleSave = () => {
    if (!formData.text || formData.options?.some(opt => !opt)) {
      alert("Harap isi semua field!");
      return;
    }

    if (editingId) {
      onUpdateQuestions(questions.map(q => q.id === editingId ? { ...formData, id: editingId } as Question : q));
    } else {
      const newQuestion: Question = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Question;
      onUpdateQuestions([...questions, newQuestion]);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ text: '', options: ['', '', '', ''], correctAnswer: 0 });
  };

  const startEdit = (q: Question) => {
    setEditingId(q.id);
    setFormData(q);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus soal ini?")) {
      onUpdateQuestions(questions.filter(q => q.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Panel Manajemen Guru</h2>
            <p className="text-slate-500">Kelola bank soal ujian di sini</p>
          </div>
          <button 
            onClick={onBack}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-all"
          >
            ← Kembali ke Menu
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Create/Edit */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
              <h3 className="text-lg font-bold mb-4 text-emerald-600">
                {editingId ? 'Edit Soal' : 'Tambah Soal Baru'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pertanyaan</label>
                  <textarea 
                    value={formData.text}
                    onChange={e => setFormData({...formData, text: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    rows={3}
                  />
                </div>
                {formData.options?.map((opt, i) => (
                  <div key={i}>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Pilihan {String.fromCharCode(65 + i)}</label>
                    <input 
                      type="text"
                      value={opt}
                      onChange={e => {
                        const newOpts = [...(formData.options || [])];
                        newOpts[i] = e.target.value;
                        setFormData({...formData, options: newOpts});
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jawaban Benar</label>
                  <select 
                    value={formData.correctAnswer}
                    onChange={e => setFormData({...formData, correctAnswer: parseInt(e.target.value)})}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                  >
                    {formData.options?.map((_, i) => (
                      <option key={i} value={i}>Pilihan {String.fromCharCode(65 + i)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={handleSave}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all"
                  >
                    {editingId ? 'Update' : 'Simpan'}
                  </button>
                  {editingId && (
                    <button onClick={resetForm} className="px-4 py-2 border border-slate-200 rounded-xl">Batal</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Daftar Soal ({questions.length})</h3>
            {questions.map((q, index) => (
              <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-all">
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">SOAL #{index + 1}</span>
                    <p className="mt-2 text-slate-800 font-medium">{q.text}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {q.options.map((opt, i) => (
                        <div key={i} className={`text-xs p-2 rounded ${i === q.correctAnswer ? 'bg-green-50 text-green-700 border border-green-100 font-bold' : 'bg-slate-50 text-slate-500'}`}>
                          {String.fromCharCode(65 + i)}. {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => startEdit(q)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {questions.length === 0 && (
              <div className="text-center py-20 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
                <p className="text-slate-400">Belum ada soal. Silakan tambah soal baru.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;
