<script>
    import {SPRINT_TYPE as POMODORO_TYPE} from '../constants';
    import {isSprintActive, sprint} from '../store';
</script>


{#if $isSprintActive && $sprint.type === POMODORO_TYPE.rest}
    <div screensaver>
        <video loop muted autoplay>
            <source src="http://localhost:3443/screensaver" type="video/webm" />
        </video>
    </div>
{/if}

<style>
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
