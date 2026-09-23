import { state, saveState } from './store.js';

export function toggleTask(taskId) {
    state.tasks = state.tasks.map(task => 
        task.id === taskId ? { ...task, checked: !task.checked } : task
    );
    saveState();
}

export function addTask(title) {
    const trimmed = title.trim();
    if (!trimmed || trimmed.length > 60) return false;
    const newTask = {
        id: Date.now(),
        title: trimmed,
        checked: false
    };
    state.tasks.push(newTask);
    saveState();
    return true;
}

export function editTask(taskId, newTitle) {
    if (newTitle && newTitle.trim()) {
        state.tasks = state.tasks.map(t => 
            t.id === taskId ? { ...t, title: newTitle.trim() } : t
        );
        saveState();
        return true;
    }
    return false;
}

export function deleteTask(taskId) {
    state.tasks = state.tasks.filter(task => task.id !== taskId);
    saveState();
}

export function areAllTasksCompleted() {
    return state.tasks.length > 0 && state.tasks.every(task => task.checked);
}
