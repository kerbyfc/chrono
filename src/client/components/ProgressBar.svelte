<script>
    import {isSprintActive, warningTime, sprintBurndownPercentage} from '../store';
    import {SPRINT_TYPE} from '../constants.js';
</script>


{#if $isSprintActive}
    <div bar class="{$warningTime ? 'warning' : ''}">
        <div progress style="{`width: ${$sprintBurndownPercentage}%`}" />
    </div>
{/if}

<style>
    [bar] {
        position: fixed;
        width: 100%;
        height: 8px;
        bottom: 0;
        background: white;
        opacity: 0.6;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
    }

    [bar].warning {
        opacity: 0.9;
        background: coral;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
    }

    [progress] {
        height: 100%;
        background: lightskyblue;

        transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
    }
</style>
