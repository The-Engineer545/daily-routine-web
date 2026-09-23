import { state } from './store.js';

export const PET_STAGES = [
    { stage: 1, name: "Bebé", emoji: "🥚", description: "¡Acabo de nacer!" },
    { stage: 2, name: "Cría", emoji: "🐣", description: "¡Estoy aprendiendo!" },
    { stage: 3, name: "Joven", emoji: "🐥", description: "¡Voy creciendo!" },
    { stage: 4, name: "Adulto", emoji: "🐓", description: "¡Soy fuerte!" },
    { stage: 5, name: "Élite", emoji: "🦅", description: "¡Soy invencible!" },
];

export function getPetStage() {
    if (state.currentStreak >= 20) return PET_STAGES[4];
    if (state.currentStreak >= 15) return PET_STAGES[3];
    if (state.currentStreak >= 10) return PET_STAGES[2];
    if (state.currentStreak >= 5) return PET_STAGES[1];
    return PET_STAGES[0];
}

export function isEvolutionDay() {
    return [5, 10, 15, 20].includes(state.currentStreak);
}
