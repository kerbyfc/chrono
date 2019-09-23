<style>
    [bar] {
        position: fixed;
        width: 100%;
        height: 4px;
        bottom: 0;
        background: white;
        border-top: 1px solid gainsboro;
    }

    [progress] {
        height: 100%;
        background: lightskyblue;
    }

    [center] {
        position: fixed;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
    }

    [center].dim {
        background: #bddb62;
    }

    [timer] {
        position: fixed;
        bottom: 8px;
        left: 4px;
        text-shadow: 0 0 15px rgba(255,255,255,.5), 0 0 10px rgba(255,255,255,.5), 2px 2px 0px rgba(206,206,206,0.53);
    }

    [main-button].hidden {
        display: none;
    }

    [timer-button] {
        width: 122px;
        padding: 6px;
        height: 50px;
        color: steelblue;
        font-size: 2.5em;
        position:absolute;
        border: steelblue 2px solid;
        overflow:hidden;
        justify-content: center;

        transition: all 0.6s cubic-bezier(.55,0,.1,1);

        cursor: pointer;
        box-shadow: 0px 0px 0px steelblue;

        margin-left: -61px;
        margin-top: -25px;
    }

    [timer-button]:hover {
        text-shadow: 0px 3px 2px rgba(0,0,0,0.9);
        box-shadow: 8px 8px 0px steelblue, -8px -8px 0px steelblue;
    }

    [timer-button]:hover .one {
        opacity:1;
        transform: translate3d(0px ,0px ,0px);
    }
    [timer-button]:hover .two {

        transform: translate3d(0px ,0px ,0px);
    }
    [timer-button]:hover .three {
        transform: translate3d(0px ,0px ,0px);
    }
    [timer-button]:hover .four {
        transform: translate3d(0px ,0px ,0px);
    }

    .ring {
        width: 100%;
        height: 100%;
        position: absolute;
        background: transparent;
        top:0;
        left:0;
        transform: translate3d(0px ,90px ,0px);
    }
    .one {
        background-color: lightblue;
        transition: all 1s cubic-bezier(.55,0,.1,1);
        z-index: -4;
    }
    .two {
        background-color: lightskyblue;
        transition: all 2s cubic-bezier(.55,0,.1,1);
        z-index: -3;
    }
    .three {
        background-color: lightyellow;
        z-index: -2;
        transition: all 3s cubic-bezier(.55,0,.1,1);
    }

    .four {
        background-color: white;
        z-index: -1;
        transition: all 4s cubic-bezier(.55,0,.1,1);
    }
</style>

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
        };

        if (window.electron) {
            window.electron.send('started', {type});
        }
    }

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
    }

    const decTimer = () => {
        if (timer !== null && timer.value >= 1) {
            timer.value = timer.value -= 1 * SEC;
            timer.timeout = setTimeout(decTimer, SEC);
        } else {
            stop();
        }
    }

    const calcCurrentPercentage = () => timer ? 100 - (timer.value / TIME_CAPACITY[timer.type] * 100) : 0;

    if (window.electron) {
        window.electron.on('focusChanged', (event, isFocused) => {
            windowIsFocused = isFocused;
        });
    }

    $: isDimmed = timer === null || timer.type === TIMER_TYPE.rest
</script>

<div center class={isDimmed ? 'dim' : ''}>
    <div main-button class={!windowIsFocused ? 'hidden' : ''}>
        {#if isDimmed}
             <div timer-button on:click={() => start(TIMER_TYPE.pomodoro)}>
                 START
                 <div class="ring one"></div>
                 <div class="ring two"></div>
                 <div class="ring three"></div>
                <div class="ring four"></div>
            </div>
        {:else}
            <div timer-button on:click={() => stop(STOP_TRIGGER.user)}>
                STOP
                <div class="ring one"></div>
                <div class="ring two"></div>
                <div class="ring three"></div>
                <div class="ring four"></div>
            </div>
        {/if}
    </div>
</div>

{#if timer}
    <div timer>
        {`${Math.floor(timer.value / MIN)}`.padStart(2, '0')}:{`${Math.floor((timer.value - Math.floor(timer.value / MIN) * MIN) / SEC)}`.padStart(2, '0')}
    </div>

    <div bar>
        <div progress style={timer ? `width: ${calcCurrentPercentage()}%` : ''}></div>
    </div>
{/if}

