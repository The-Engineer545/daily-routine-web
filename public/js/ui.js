import { state, recordDayCompletion } from './store.js';
import { getPetStage, PET_STAGES } from './pet.js';
import { toggleTask, editTask, deleteTask, areAllTasksCompleted } from './tasks.js';
import * as Scene from './scene.js';

// Sanitizar texto para prevenir XSS al insertar en innerHTML
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// DOM Elements
// petEmoji is rendered by the Three.js scene (scene.js)
const petName = document.getElementById('petName');
const petDescription = document.getElementById('petDescription');
const currentStreakEl = document.getElementById('currentStreak');
const longestStreakEl = document.getElementById('longestStreak');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const completeDayContainer = document.getElementById('completeDayContainer');
const dayCompletedMsg = document.getElementById('dayCompletedMsg');

export function renderUI() {
    renderPetDisplay();
    renderTasks();
    updatePetStages();
}

function renderPetDisplay() {
    const pet = getPetStage();

    // Update fallback emoji element
    const petEmojiText = document.getElementById('petEmojiText');
    if (petEmojiText) petEmojiText.textContent = pet.emoji;

    // Drive the Three.js scene safely
    try {
        if (Scene && typeof Scene.setEmoji === 'function') {
            Scene.setEmoji(pet.emoji);
        }
    } catch (e) {
        console.warn('Scene setEmoji:', e);
    }

    // Update the glass info overlay
    if (petName) petName.textContent = pet.name;
    if (petDescription) petDescription.textContent = pet.description;
    if (currentStreakEl) currentStreakEl.textContent = state.currentStreak;
    if (longestStreakEl) longestStreakEl.textContent = state.longestStreak;

    const progress = Math.min((state.currentStreak / 20) * 100, 100);
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${state.currentStreak}/20 días para evolución`;
}

export function renderTasks() {
    tasksList.innerHTML = '';
    
    if (state.tasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        
        state.tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            // Tailwind classes for a card look
            taskDiv.className = `flex items-center justify-between p-4 mb-3 rounded-2xl border-2 transition-all duration-200 ${
                task.checked 
                    ? 'bg-blue-50/50 border-blue-200 opacity-75' 
                    : 'bg-white border-blue-100 hover:border-blue-300 shadow-sm'
            }`;
            
            taskDiv.innerHTML = `
                <div class="task-content flex items-center gap-4 flex-1 cursor-pointer select-none">
                    <button class="task-checkbox flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.checked 
                            ? 'bg-blue-500 border-blue-500 text-white' 
                            : 'border-slate-300 hover:border-blue-400'
                    }" data-id="${task.id}" aria-label="Marcar tarea">
                        ${task.checked ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
                    </button>
                    <span class="text-[17px] font-medium transition-all ${
                        task.checked ? 'text-slate-400 line-through' : 'text-slate-700'
                    }">${escapeHTML(task.title)}</span>
                </div>
                <div class="flex items-center gap-2">
                    <button class="edit-btn p-2 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors" data-id="${task.id}" title="Editar tarea">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button class="delete-btn p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" data-id="${task.id}" title="Eliminar tarea">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            `;
            
            const taskContent = taskDiv.querySelector('.task-content');
            const editBtn = taskDiv.querySelector('.edit-btn');
            const deleteBtn = taskDiv.querySelector('.delete-btn');
            
            taskContent.addEventListener('click', () => {
                toggleTask(task.id);
                renderTasks();
                checkCompletion();
            });
            
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const newTitle = prompt('Editar tarea:', task.title);
                if (newTitle !== null && editTask(task.id, newTitle)) {
                    renderTasks();
                }
            });
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('¿Estás seguro de eliminar esta tarea?')) {
                    deleteTask(task.id);
                    renderTasks();
                    checkCompletion();
                }
            });
            
            tasksList.appendChild(taskDiv);
        });
    }
    
    checkCompletion();
}

function checkCompletion() {
    if (areAllTasksCompleted() && !state.dayCompleted) {
        completeDayContainer.classList.remove('hidden');
    } else {
        completeDayContainer.classList.add('hidden');
    }

    if (state.dayCompleted) {
        dayCompletedMsg.classList.remove('hidden');
    } else {
        dayCompletedMsg.classList.add('hidden');
    }
}

export function updatePetStages() {
    const petStagesContainer = document.getElementById('petStages');
    if(!petStagesContainer) return;
    petStagesContainer.innerHTML = '';
    
    PET_STAGES.forEach((stageInfo, index) => {
        const isReached = state.currentStreak >= (index * 5); // 0, 5, 10, 15, 20
        const span = document.createElement('span');
        span.className = `text-4xl transition-all duration-300 ${isReached ? 'opacity-100 scale-110 drop-shadow-md grayscale-0' : 'opacity-40 scale-90 grayscale'}`;
        span.textContent = stageInfo.emoji;
        petStagesContainer.appendChild(span);
    });
}

// Celebration animations
export function triggerConfetti() {
    if (window.confetti) {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
        }, 250);
    }
}


export function handleCompleteDay() {
    state.currentStreak++;
    if (state.currentStreak > state.longestStreak) {
        state.longestStreak = state.currentStreak;
    }
    state.dayCompleted = true;
    recordDayCompletion(); // ya llama saveState() internamente

    renderPetDisplay();
    updatePetStages();
    completeDayContainer.classList.add('hidden');
    dayCompletedMsg.classList.remove('hidden');

    // Celebración: confetti + animación 3D siempre
    triggerConfetti();
    Scene.celebrate();
}
