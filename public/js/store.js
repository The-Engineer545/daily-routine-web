export const DEFAULT_TASKS = [
    { id: 1, title: "Ejercicio matutino", checked: false },
    { id: 2, title: "Leer 20 páginas", checked: false },
    { id: 3, title: "Aprender algo nuevo", checked: false },
    { id: 4, title: "Meditar", checked: false },
];

export const state = {
    tasks: DEFAULT_TASKS.map(t => ({ ...t })),
    currentStreak: 0,
    longestStreak: 0,
    dayCompleted: false,
    lastCompletedDate: null,
    history: [] // Format: { date: 'YYYY-MM-DD', status: 0|1 }
};

export function saveState() {
    try {
        localStorage.setItem('dailyRoutine_tasks', JSON.stringify(state.tasks));
        localStorage.setItem('dailyRoutine_currentStreak', state.currentStreak.toString());
        localStorage.setItem('dailyRoutine_longestStreak', state.longestStreak.toString());
        localStorage.setItem('dailyRoutine_dayCompleted', JSON.stringify(state.dayCompleted));
        localStorage.setItem('dailyRoutine_lastCompletedDate', state.lastCompletedDate || '');
        localStorage.setItem('dailyRoutine_history', JSON.stringify(state.history));
    } catch (e) {
        console.error("Error saving state to localStorage:", e);
    }
}

export function loadState() {
    try {
        const savedTasks = localStorage.getItem('dailyRoutine_tasks');
        const savedCurrentStreak = localStorage.getItem('dailyRoutine_currentStreak');
        const savedLongestStreak = localStorage.getItem('dailyRoutine_longestStreak');
        const savedLastDate = localStorage.getItem('dailyRoutine_lastCompletedDate');
        const savedHistory = localStorage.getItem('dailyRoutine_history');

        if (savedTasks) {
            const parsed = JSON.parse(savedTasks);
            if (Array.isArray(parsed)) state.tasks = parsed;
        }
        if (savedCurrentStreak) state.currentStreak = parseInt(savedCurrentStreak, 10) || 0;
        if (savedLongestStreak) state.longestStreak = parseInt(savedLongestStreak, 10) || 0;
        if (savedHistory) {
            const parsed = JSON.parse(savedHistory);
            if (Array.isArray(parsed)) state.history = parsed;
        }
        state.lastCompletedDate = savedLastDate || null;
    } catch (e) {
        console.error("Error loading state from localStorage, using defaults", e);
    }

    const today = new Date().toISOString().split('T')[0];

    // Verificar si el estado completado corresponde al día de hoy
    if (state.lastCompletedDate === today) {
        state.dayCompleted = true;
    } else {
        state.dayCompleted = false;

        // Si es un nuevo día y había tareas completadas, resetear checks para el nuevo día
        if (state.lastCompletedDate && state.lastCompletedDate !== today) {
            if (Array.isArray(state.tasks)) {
                state.tasks = state.tasks.map(t => ({ ...t, checked: false }));
            }

            // Comprobar si la racha continúa (se completó ayer)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (state.lastCompletedDate !== yesterdayStr) {
                state.currentStreak = 0;
            }
            saveState();
        }
    }
}

export function resetState() {
    state.tasks = DEFAULT_TASKS.map(t => ({ ...t, checked: false }));
    state.currentStreak = 0;
    state.longestStreak = 0;
    state.dayCompleted = false;
    state.lastCompletedDate = null;
    state.history = [];
    saveState();
}

// Utility for history
export function recordDayCompletion() {
    const today = new Date().toISOString().split('T')[0];
    state.lastCompletedDate = today;
    state.dayCompleted = true;
    
    // Check if today already exists
    const existingIndex = state.history.findIndex(h => h.date === today);
    if (existingIndex >= 0) {
        state.history[existingIndex].status = 1;
    } else {
        state.history.push({ date: today, status: 1 });
    }
    
    // Keep only last 30 days
    if (state.history.length > 30) {
        state.history.shift();
    }
    saveState();
}

// Helper to get last 7 days history strictly
export function getWeeklyHistory() {
    const week = [];
    const today = new Date();
    // Generate last 7 days including today
    for(let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        const record = state.history.find(h => h.date === dateStr);
        week.push({
            date: dateStr,
            dayName: d.toLocaleDateString('es-ES', { weekday: 'short' })[0].toUpperCase(),
            completed: record ? record.status === 1 : false
        });
    }
    return week;
}
