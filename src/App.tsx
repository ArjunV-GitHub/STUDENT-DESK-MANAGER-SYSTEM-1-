import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { PomodoroTimer } from './components/PomodoroTimer';
import { Analytics } from './components/Analytics';
import { Notes } from './components/Notes';
import { Goals } from './components/Goals';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, StudySession, Note, Goal } from './types';
import { Plus, Filter, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
  
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [studySessions, setStudySessions] = useLocalStorage<StudySession[]>('studySessions', []);
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSessionComplete = (duration: number, type: 'focus' | 'break') => {
    if (type === 'focus') {
      const newSession: StudySession = {
        id: Date.now().toString(),
        taskId: '',
        duration,
        startTime: new Date(Date.now() - duration * 1000).toISOString(),
        endTime: new Date().toISOString(),
        type
      };
      setStudySessions([...studySessions, newSession]);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const urgentTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 3 && task.status !== 'completed';
  });

  const completedToday = tasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.updatedAt).toDateString();
    return task.status === 'completed' && taskDate === today;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Tasks</p>
              <p className="text-3xl font-bold">{tasks.filter(t => t.status !== 'completed').length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Completed Today</p>
              <p className="text-3xl font-bold">{completedToday.length}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Urgent Tasks</p>
              <p className="text-3xl font-bold">{urgentTasks.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex space-x-2">
            {(['all', 'todo', 'in-progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Tasks' : status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">
            {filter === 'all' ? 'No tasks yet. Create your first task!' : `No ${filter.replace('-', ' ')} tasks.`}
          </p>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Task
          </button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'analytics':
        return <Analytics tasks={tasks} studySessions={studySessions} />;
      case 'timer':
        return (
          <div className="max-w-md mx-auto">
            <PomodoroTimer onSessionComplete={handleSessionComplete} />
          </div>
        );
      case 'notes':
        return <Notes notes={notes} onUpdate={setNotes} />;
      case 'goals':
        return <Goals goals={goals} onUpdate={setGoals} />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTask={() => setShowTaskForm(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {showTaskForm && (
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
}

export default App;