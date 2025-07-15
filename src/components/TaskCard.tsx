import React from 'react';
import { Calendar, Clock, BookOpen, GraduationCap, FileText, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';
import { formatDate, getDaysUntilDue, getUrgencyLevel } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

const categoryIcons = {
  assignment: FileText,
  exam: GraduationCap,
  project: BookOpen,
  reading: BookOpen,
  research: Search
};

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200'
};

const statusColors = {
  'todo': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'completed': 'bg-green-100 text-green-700'
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const IconComponent = categoryIcons[task.category];
  const daysUntil = getDaysUntilDue(task.dueDate);
  const urgency = getUrgencyLevel(task.dueDate);
  const progress = (task.completedHours / task.estimatedHours) * 100;

  const handleStatusChange = () => {
    const statusOrder = ['todo', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length] as Task['status'];
    
    onUpdate({ 
      ...task, 
      status: nextStatus,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <IconComponent className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
            <p className="text-gray-600 text-sm capitalize">{task.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[urgency]}`}>
            {urgency}
          </span>
          <button
            onClick={handleStatusChange}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${statusColors[task.status]}`}
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-4 h-4 inline mr-1" />
            ) : task.status === 'in-progress' ? (
              <Clock className="w-4 h-4 inline mr-1" />
            ) : (
              <AlertCircle className="w-4 h-4 inline mr-1" />
            )}
            {task.status.replace('-', ' ')}
          </button>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{task.description}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(task.dueDate)}</span>
            <span className={`ml-2 ${daysUntil < 0 ? 'text-red-600' : daysUntil <= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
              {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days left`}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{task.completedHours}/{task.estimatedHours} hours</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={() => onUpdate({ 
            ...task, 
            completedHours: Math.min(task.completedHours + 0.5, task.estimatedHours),
            updatedAt: new Date().toISOString()
          })}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          + 30 min
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
};