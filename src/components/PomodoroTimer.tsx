import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

interface PomodoroTimerProps {
  onSessionComplete: (duration: number, type: 'focus' | 'break') => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  const [completedSessions, setCompletedSessions] = useState(0);

  const focusTime = 25 * 60;
  const breakTime = 5 * 60;
  const longBreakTime = 15 * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session completed
      const duration = sessionType === 'focus' ? focusTime : 
                      completedSessions > 0 && completedSessions % 4 === 0 ? longBreakTime : breakTime;
      
      onSessionComplete(duration, sessionType);
      setIsActive(false);
      
      if (sessionType === 'focus') {
        setCompletedSessions(prev => prev + 1);
        // Auto-start break
        const nextBreakTime = (completedSessions + 1) % 4 === 0 ? longBreakTime : breakTime;
        setTimeLeft(nextBreakTime);
        setSessionType('break');
      } else {
        // Break completed, ready for next focus session
        setTimeLeft(focusTime);
        setSessionType('focus');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, sessionType, completedSessions, onSessionComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionType === 'focus' ? focusTime : breakTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = sessionType === 'focus' 
    ? ((focusTime - timeLeft) / focusTime) * 100
    : ((breakTime - timeLeft) / breakTime) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          {sessionType === 'focus' ? (
            <Brain className="w-6 h-6 text-blue-600 mr-2" />
          ) : (
            <Coffee className="w-6 h-6 text-green-600 mr-2" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            {sessionType === 'focus' ? 'Focus Session' : 'Break Time'}
          </h3>
        </div>

        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={sessionType === 'focus' ? 'text-blue-600' : 'text-green-600'}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={toggleTimer}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              isActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : sessionType === 'focus'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </button>
          
          <button
            onClick={resetTimer}
            className="flex items-center space-x-2 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p>Completed sessions: {completedSessions}</p>
          <p className="mt-1">
            {completedSessions > 0 && (completedSessions % 4 === 0) 
              ? 'Next: Long break (15 min)' 
              : sessionType === 'focus' 
                ? 'Next: Short break (5 min)'
                : 'Next: Focus session (25 min)'
            }
          </p>
        </div>
      </div>
    </div>
  );
};