<script>
    import LocationInput from './LocationInput.svelte';
    import { latOrigin, lonOrigin, latDest, lonDest } from '../../../store.js';

    export let map;

    let placeholderDepart = "Chercher un point de départ..";
    let placeholderDestination = "Chercher une destination..";

    $: if ($latOrigin && $lonOrigin && $latDest && $lonDest) {
        map.calculateFullItinerary($latOrigin, $lonOrigin, $latDest, $lonDest);
    }
</script>

<style>
    div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>

<div>
    <LocationInput bind:placeholderText={placeholderDepart} bind:lat={$latOrigin} bind:lon={$lonOrigin} />
    <LocationInput bind:placeholderText={placeholderDestination} bind:lat={$latDest} bind:lon={$lonDest} />
</div>