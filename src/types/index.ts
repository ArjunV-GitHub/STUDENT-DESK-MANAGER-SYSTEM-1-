export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'assignment' | 'exam' | 'project' | 'reading' | 'research';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  estimatedHours: number;
  completedHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  taskId: string;
  duration: number;
  startTime: string;
  endTime: string;
  type: 'focus' | 'break';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  category: string;
}