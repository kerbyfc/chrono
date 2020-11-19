export const SEC = 1000;
export const MIN = 60 * 1000;

export const IDLE_WARNING_DURATION = 5 * MIN;

export const SPRINT_TYPE = {
    pomodoro: 'pomodoro',
    rest: 'rest',
    longRest: 'longRest',
};

export const STOP_TRIGGER = {
    user: 'user',
    timer: 'timer',
};

export const SPRINT_CAPACITY = {
    [SPRINT_TYPE.pomodoro]: 25 * MIN,
    [SPRINT_TYPE.rest]: 5 * MIN,
    [SPRINT_TYPE.longRest]: 15 * MIN,
};

export const POMODORO_SESSION_LENGTH = 3;

export const EFFECTIVE_SPRINT_RATIO = {
    [SPRINT_TYPE.pomodoro]: 0.8,
    [SPRINT_TYPE.rest]: 0.8,
    [SPRINT_TYPE.longRest]: 0.8,
};

export const REMAIN_WARNING_TIME = 5 * MIN + 5 * SEC;
