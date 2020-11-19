import {
    IDLE_WARNING_DURATION,
    MIN,
    REMAIN_WARNING_TIME,
    SEC,
    SPRINT_CAPACITY,
    SPRINT_TYPE,
    STOP_TRIGGER,
} from './constants';
import { customStore, derivedStore, isLongRestNeeded } from './helpers';

export const sprint = customStore({
    type: null,
    startAt: Date.now(),
    active: false,
    history: [],
}, {
    start(state) {
        return {
            ...state,
            active: true,
            type: SPRINT_TYPE.pomodoro,
            startAt: Date.now(),
        };
    },

    stop(state, initiator) {
        if (state.active === true) {
            const interrapted = initiator === STOP_TRIGGER.user;
            const now = Date.now();

            const lastSprint = {
                type: state.type,
                startAt: state.startAt,
                time: now - state.startAt,
                interrapted,
            };

            const history = [...state.history, lastSprint];

            if (state.type === SPRINT_TYPE.pomodoro) {
                const longRestNeeded = isLongRestNeeded(history);

                return {
                    ...state,
                    history,
                    type: longRestNeeded ? SPRINT_TYPE.longRest : SPRINT_TYPE.rest,
                    startAt: now,
                    active: true,
                };
            }

            return {
                ...state,
                history,
                startAt: now,
                active: false,
            };
        }

        return state;
    },
});

export const elapsedSeconds = derivedStore(0, sprint, ($sprint, set) => {
    const calc = () => (
        $sprint.active
            ? Math.floor(Math.max(0, ($sprint.startAt + SPRINT_CAPACITY[$sprint.type]) - Date.now()) / SEC)
            : 0
    );

    const interval = setInterval(() => {
        set(calc());
    }, 1000);

    set(calc());

    return () => {
        clearInterval(interval);
    };
});

export const idleTime = derivedStore(0, sprint, ($sprint, set) => {
    const calc = () => (
        $sprint.active
            ? 0
            : Date.now() - $sprint.startAt
    );

    const interval = setInterval(() => {
        set(calc());
    }, 1000);

    set(calc());

    return () => {
        clearInterval(interval);
    };
});

export const isSprintActive = derivedStore(false, [sprint, elapsedSeconds], ([$sprint, $elapsedSeconds]) => {
    if ($sprint.active && $elapsedSeconds === 0 && (Date.now() - $sprint.startAt) > SEC) {
        sprint.stop();
    }

    return $sprint.active;
});

export const isLongIdle = derivedStore(false, idleTime, ($idleTime) => $idleTime > IDLE_WARNING_DURATION);

export const isPomodoroSprint = derivedStore(false, sprint, ($sprint) => $sprint.type === SPRINT_TYPE.pomodoro);

export const sprintBurndownPercentage = derivedStore(0, [sprint, elapsedSeconds], ([$sprint, $elapsedSeconds]) => (
    $sprint.active ? Math.floor(100 - (($elapsedSeconds * SEC / SPRINT_CAPACITY[$sprint.type]) * 100)) : 0
));

export const timeRemains = derivedStore('', [elapsedSeconds, isSprintActive], ([$elapsedSeconds, $isSprintActive]) => {
    if (!$isSprintActive) {
        return '';
    }

    return [
        `${Math.floor($elapsedSeconds * SEC / MIN)}`.padStart(2, '0'),
        `${Math.floor($elapsedSeconds * SEC - Math.floor($elapsedSeconds * SEC / MIN) * MIN) / SEC}`.padStart(2, '0'),
    ].join(':');
});

export const warningTime = derivedStore(false, elapsedSeconds, ($elapsedSeconds) => {
    return $elapsedSeconds < REMAIN_WARNING_TIME / SEC;
});
