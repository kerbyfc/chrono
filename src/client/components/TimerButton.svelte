<script>
    import {
        sprint,
        isPomodoroSprint,
        isSprintActive,
        isLongIdle,
    } from '../store';

    function handleClick() {
        if ($isSprintActive && $isPomodoroSprint) {
            sprint.stop();
        } else {
            sprint.start();
        }
    }
</script>

<div timer-button on:click={handleClick} class={
    ($isSprintActive ? 'dimmed' : '') + ($isLongIdle ? 'idle' : '')
}>
    {#if !$isSprintActive || !$isPomodoroSprint}START{:else}STOP{/if}
</div>

<style>
    [timer-button] {
        position: fixed;
        bottom: 16px;
        right: 8px;

        width: 60px;
        padding: 6px;
        height: 20px;
        font-size: 14px;
        border: steelblue 2px solid;
        overflow: hidden;
        justify-content: center;

        opacity: 0.85;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);

        cursor: pointer;
        box-shadow: 0px 0px 0px white;

        color: white;
        background: steelblue;
    }

    [timer-button]:hover,
    [timer-button].dimmed:hover {
        opacity: 1;
    }

    [timer-button].idle {
        opacity: 1;
        background: indianred;
        border-color: indianred;

        animation: pulse 0.9s infinite ease-out;
    }

    [timer-button].dimmed {
        opacity: 0.4;

        color: steelblue;
        background: transparent;
    }

    @keyframes pulse {
        0% {
            background: indianred;
            border-color: indianred;
        }
        50% {
           background: red;
           border-color: red;
        }
        100% {
            background: indianred;
            border-color: indianred;
        }
    }
</style>
