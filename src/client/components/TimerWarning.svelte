<div
    one-min-remains-warning
    class="{timer && timer.type === SPRINT_TYPE.pomodoro && timer.value <= MIN + 2 * SEC && timer.value >= MIN ? '' : 'hidden'}"
>
    <span>1 MINUTE REMAINS</span>
</div>

<style>
    [one-min-remains-warning] {
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        color: coral;
        font-size: 5vh;
        z-index: -10;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
        /* font-family: 'Bebas Neue'; */
    }
</style>
