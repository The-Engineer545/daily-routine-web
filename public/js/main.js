import { loadState, saveState, resetState } from './store.js';
import { addTask } from './tasks.js';
import { renderUI, handleCompleteDay, renderTasks } from './ui.js';
import { init as initScene } from './scene.js';
import { getPetStage } from './pet.js';

document.addEventListener('DOMContentLoaded', () => {
    // Load initial state
    loadState();

    // Init Three.js scene into the container div
    const sceneContainer = document.getElementById('petSceneContainer');
    if (sceneContainer) {
        const pet = getPetStage();
        initScene(sceneContainer, pet.emoji);
    }

    // Initial Render
    renderUI();
    
    // Bind global events
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addTaskForm = document.getElementById('addTaskForm');
    const newTaskInput = document.getElementById('newTaskInput');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');
    const completeDayBtn = document.getElementById('completeDayBtn');
    const resetBtn = document.getElementById('resetBtn');

    function toggleAddTaskForm() {
        addTaskBtn.classList.toggle('hidden');
        addTaskForm.classList.toggle('hidden');
        if (!addTaskForm.classList.contains('hidden')) {
            newTaskInput.focus();
        }
    }

    function handleAddNewTask() {
        const success = addTask(newTaskInput.value);
        if (success) {
            newTaskInput.value = '';
            toggleAddTaskForm();
            renderTasks();
        }
    }

    addTaskBtn.addEventListener('click', toggleAddTaskForm);
    cancelTaskBtn.addEventListener('click', () => {
        newTaskInput.value = '';
        toggleAddTaskForm();
    });
    
    saveTaskBtn.addEventListener('click', handleAddNewTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddNewTask();
    });

    completeDayBtn.addEventListener('click', handleCompleteDay);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de reiniciar todo? Se perderá todo tu progreso de racha.')) {
                resetState();
                renderUI();
            }
        });
    }
});
