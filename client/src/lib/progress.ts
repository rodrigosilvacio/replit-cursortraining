import { useState, useEffect } from 'react';

const PROGRESS_KEY = 'cursor_course_progress';

export function getCompletedModules(): number[] {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function markModuleCompleted(moduleId: number) {
  const completed = getCompletedModules();
  if (!completed.includes(moduleId)) {
    const updated = [...completed, moduleId];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    // Dispatch event so other components can sync
    window.dispatchEvent(new Event('course-progress-updated'));
  }
}

export function useCourseProgress() {
  const [completedModules, setCompletedModules] = useState<number[]>(getCompletedModules());

  useEffect(() => {
    const handleUpdate = () => setCompletedModules(getCompletedModules());
    window.addEventListener('course-progress-updated', handleUpdate);
    return () => window.removeEventListener('course-progress-updated', handleUpdate);
  }, []);

  const isCompleted = (moduleId: number) => completedModules.includes(moduleId);

  return {
    completedModules,
    isCompleted,
    markCompleted: markModuleCompleted,
  };
}
