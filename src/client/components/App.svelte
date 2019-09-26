<script>
    const SEC = 1000;
    const MIN = 60 * 1000;

    const TIMER_TYPE = {
        pomodoro: 'pomodoro',
        rest: 'rest',
    };

    const STOP_TRIGGER = {
        user: 'user',
        timer: 'timer',
    };

    const TIME_CAPACITY = {
        [TIMER_TYPE.pomodoro]: 25 * MIN,
        [TIMER_TYPE.rest]: 5 * MIN,
    };

    let windowIsFocused = true;
    let timer = null;

    const start = (type) => {
        if (timer) {
            clearTimeout(timer.timeout);
        }

        timer = {
            type,
            value: TIME_CAPACITY[type],
            timeout: setTimeout(decTimer, SEC),
            screensaver: type === TIMER_TYPE.rest,
        };

        if (window.electron) {
            window.electron.send('started', {type});
        }
    };

    const stop = (initiator) => {
        if (timer) {
            if (timer.type === 'pomodoro') {
                if (initiator !== STOP_TRIGGER.user) {
                    return start(TIMER_TYPE.rest);
                }
            }

            clearTimeout(timer.timeout);
            timer = null;
        }
    };

    const decTimer = () => {
        if (timer !== null && timer.value >= 1) {
            timer.value = timer.value -= 1 * SEC;
            timer.timeout = setTimeout(decTimer, SEC);
        } else {
            stop();
        }
    };

    const calcCurrentPercentage = () =>
        timer ? 100 - (timer.value / TIME_CAPACITY[timer.type]) * 100 : 0;

    if (window.electron) {
        window.electron.on('focusChanged', (event, isFocused) => {
            windowIsFocused = isFocused;
        });
    }

    const onTimeButtonClick = () =>
        isDimmed ? start(TIMER_TYPE.pomodoro) : stop(STOP_TRIGGER.user);

    $: isDimmed = timer === null || timer.type === TIMER_TYPE.rest;
</script>

<div
    timer-button
    on:click="{() => onTimeButtonClick()}"
    class="{!windowIsFocused ? 'hidden' : ''}"
>
    {#if isDimmed}START{:else}STOP{/if}
    <div class="ring one"></div>
    <div class="ring two"></div>
    <div class="ring three"></div>
    <div class="ring four"></div>
</div>

{#if timer && timer.screensaver}
    <div screensaver>
        <video loop muted autoplay>
            <source src="http://localhost:3443/screensaver" type="video/webm" />
        </video>
    </div>
{/if}

{#if !timer}
    <div background></div>
{/if}

{#if timer}
    <div
        timer
        class="{timer.value < MIN && timer.type === TIMER_TYPE.pomodoro ? 'attention' : ''}"
    >
        {`${Math.floor(timer.value / MIN)}`.padStart(2, '0')}:{`${Math.floor((timer.value - Math.floor(timer.value / MIN) * MIN) / SEC)}`.padStart(2, '0')}
    </div>

    <div
        bar
        class="{timer.value < MIN && timer.type === TIMER_TYPE.pomodoro ? 'attention' : ''}"
    >
        <div
            progress
            style="{timer ? `width: ${calcCurrentPercentage()}%` : ''}"
        ></div>
    </div>
{/if}

<style>
    [background] {
        position: fixed;
        height: 100%;
        width: 100%;
        background: lightblue;
        z-index: -10;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
    }

    [bar] {
        position: fixed;
        width: 100%;
        height: 8px;
        bottom: 0;
        background: white;
        opacity: 0.6;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
    }

    [bar].attention {
        opacity: 0.9;
        background: coral;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
    }

    [progress] {
        height: 100%;
        background: lightskyblue;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
    }

    [timer] {
        position: fixed;
        background: white;
        padding: 4px;
        bottom: 8px;
        border-radius: 0 8px 0 0;
        opacity: 0.6;
        width: 46px;
        justify-content: center;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
    }

    [timer].attention {
        opacity: 0.9;
        color: coral;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
    }

    [timer-button] {
        position: fixed;
        top: 5vh;
        right: 5vh;

        width: 122px;
        padding: 6px;
        height: 50px;
        color: steelblue;
        font-size: 2.5em;
        border: steelblue 2px solid;
        overflow: hidden;
        justify-content: center;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);

        cursor: pointer;
        box-shadow: 0px 0px 0px white;
    }

    [timer-button].hidden {
        display: none;
    }

    [timer-button]:hover {
        box-shadow: 8px 8px 0px #6593f5, -8px -8px 0px #6593f5;
    }

    [timer-button]:hover .one {
        opacity: 1;
        transform: translate3d(0px, 0px, 0px);
    }
    [timer-button]:hover .two {
        transform: translate3d(0px, 0px, 0px);
    }
    [timer-button]:hover .three {
        transform: translate3d(0px, 0px, 0px);
    }
    [timer-button]:hover .four {
        transform: translate3d(0px, 0px, 0px);
    }

    .ring {
        width: 100%;
        height: 100%;
        position: absolute;
        background: transparent;
        top: 0;
        left: 0;
        transform: translate3d(0px, 90px, 0px);
    }
    .one {
        background-color: #fcfcee;
        transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
        z-index: -4;
    }
    .two {
        background-color: #57a0d3;
        transition: all 2s cubic-bezier(0.55, 0, 0.1, 1);
        z-index: -3;
    }
    .three {
        background-color: #89cff0;
        z-index: -2;
        transition: all 3s cubic-bezier(0.55, 0, 0.1, 1);
    }

    .four {
        background: #fcfcee;
        z-index: -1;
        transition: all 4s cubic-bezier(0.55, 0, 0.1, 1);
    }

    [screensaver] {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        z-index: -100;
    }

    [screensaver] video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    @media (min-aspect-ratio: 16/9) {
        [screensaver] video {
            height: 300%;
            top: -100%;
        }
    }

    @media (max-aspect-ratio: 16/9) {
        [screensaver] video {
            width: 300%;
            left: -100%;
        }
    }
</style>
