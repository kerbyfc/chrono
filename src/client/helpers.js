import _ from 'lodash';
import { derived, writable } from 'svelte/store';
import { EFFECTIVE_SPRINT_RATIO, POMODORO_SESSION_LENGTH, SPRINT_CAPACITY, SPRINT_TYPE } from './constants';

export const customStore = (initialState, actionHandlers) => {
    const store = writable(initialState);
    const {update} = store;
    let evaluation = false;

    Object.keys(actionHandlers).forEach(handlerKey => {
        store[handlerKey] = (...args) => {
            if (evaluation) {
                throw new Error('Can`t evaluate action from state reducer');
            }
            evaluation = true;
            update(state => {
                const result = actionHandlers[handlerKey].apply(null, [state, ...args]);
                console.log(result);
                return result;
            });
            evaluation = false;
        };
    });

    return store;
};

export const derivedStore = (initialState, ...argsRest) => derived(...argsRest, initialState);

const isEffectiveSprint = (sprint) => {
	if (!sprint.time) {
		throw new Error('Sprint is not ended');
	}

	return sprint.time > SPRINT_CAPACITY[sprint.type] * EFFECTIVE_SPRINT_RATIO[sprint.type];
}

export const isLongRestNeeded = (history) => {
	const effectivePomodoroSprints = history
		.filter(entry => entry.type === SPRINT_TYPE.pomodoro)
		.slice(0, POMODORO_SESSION_LENGTH)
		.filter(entry => isEffectiveSprint(entry));

	const restHistory = _(history)
		.filter(entry => entry.type !== SPRINT_TYPE.pomodoro)
		.takeRight(entry => entry.type === SPRINT_TYPE.rest)
        .value();

	const isEffectiveSession = effectivePomodoroSprints.length >= POMODORO_SESSION_LENGTH;

	return isEffectiveSession && restHistory.length >= POMODORO_SESSION_LENGTH.length - 1;
}
