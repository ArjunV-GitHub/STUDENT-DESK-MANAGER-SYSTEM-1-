import React, { useState } from 'react';
import { Plus, Target, Calendar, CheckCircle2, Trash2 } from 'lucide-react';
import { Goal } from '../types';
import { formatDate } from '../utils/dateUtils';

interface GoalsProps {
  goals: Goal[];
  onUpdate: (goals: Goal[]) => void;
}

export const Goals: React.FC<GoalsProps> = ({ goals, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        targetDate: formData.targetDate,
        progress: 0,
        category: formData.category
      };
      onUpdate([...goals, newGoal]);
      setFormData({ title: '', description: '', targetDate: '', category: '' });
      setShowForm(false);
    }
  };

  const updateProgress = (id: string, progress: number) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, progress: Math.min(Math.max(progress, 0), 100) } : goal
    );
    onUpdate(updatedGoals);
  };

  const deleteGoal = (id: string) => {
    onUpdate(goals.filter(goal => goal.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Study Goals</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Goal</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Goal title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <textarea
              placeholder="Describe your goal..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Category (e.g., Academic, Personal)"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Goal
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  {goal.category && (
                    <p className="text-sm text-gray-600">{goal.category}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-gray-700 mb-4">{goal.description}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(goal.targetDate)}</span>
                </div>
                {goal.progress === 100 && (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => updateProgress(goal.id, goal.progress + 10)}
                  className="flex-1 text-sm bg-purple-50 text-purple-700 py-1 px-3 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  +10%
                </button>
                <button
                  onClick={() => updateProgress(goal.id, goal.progress + 25)}
                  className="flex-1 text-sm bg-purple-50 text-purple-700 py-1 px-3 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  +25%
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Target className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">No goals set yet. Create your first study goal!</p>
        </div>
      )}
    </div>
  );
};