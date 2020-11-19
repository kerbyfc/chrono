<script>
    import {timeRemains, warningTime, sprint, isSprintActive} from '../store';
    import {SPRINT_TYPE} from '../constants';
</script>

{#if $isSprintActive}
    <div timer
        class="{$warningTime && $sprint.type === SPRINT_TYPE.pomodoro ? 'attention' : ''}"
    >
        {$timeRemains}
    </div>
{/if}

<style>
    [timer] {
        position: fixed;
        background: white;
        padding: 4px;
        bottom: 8px;
        border-radius: 0 8px 0 0;
        opacity: 0.6;
        width: 50px;
        justify-content: flex-start;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
    }

    [timer].attention {
        opacity: 0.9;
        color: coral;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
    }
</style>
