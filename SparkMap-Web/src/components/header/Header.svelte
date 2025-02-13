<script>
    import TripInfoContainer from './TripInfoContainer.svelte';
    import { showSidebar } from '../../store.js';

    function toggleSidebar() {
        showSidebar.update((value) => !value);
    }
</script>

<style>
    .app-header {
        display: flex;
        gap: 64px;
        background-color: #212529;
        color: #fff;
        padding: 16px;
    }

    .app-title {
        display: flex;
        flex: content;
        font-size: 1.2rem;
        font-weight: bold;
    }

    .sidebar-toggler {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        color: #fff;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        font-weight: bold;
    }

    .sidebar-toggler:hover {
        color: #fc9047;
    }

    @media (max-width: 500px) {
        div {
            gap: 16px;
        }
    }

</style>

<div class="app-header">
    <div class="app-title">⚡SparkMap</div>
    <TripInfoContainer />
    <button class="sidebar-toggler" on:click={toggleSidebar}>☰</button>
</div>