<script>
    import ItineraryContainer from './itinerary/ItineraryContainer.svelte';
    import VehicleContainer from './vehicle/VehicleContainer.svelte';
    import SidebarButton from './SidebarButton.svelte';
    import { showSidebar } from '../../store.js';

    export let map;

    let showItinerary = true;
    let showVehicle = false;

    // Affiche le menu de l'itinéraire
    function displayItinerary() {
        showItinerary = true;
        showVehicle = false;
    }

    // Affiche la liste des véhicules
    function displayVehicle() {
        showVehicle = true;
        showItinerary = false;
    }
</script>

<style>
    .sidebar {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        width: 350px;
        height: 100%;
        background-color: #343a40;
        z-index: 1;
    }

    .sidebar-content {
        display: flex;
        flex-direction: column;
        flex: content;
        padding: 16px;
        overflow: auto;
    }

    .sidebar-buttons-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .hidden {
        display: none;
    }

    @media (max-width: 650px) {
        .sidebar {
            width: 100%;
        }
    }
</style>

<div class="sidebar" class:hidden={!$showSidebar}>
    <div class="sidebar-content">
        <div class:hidden={!showItinerary}>
            <ItineraryContainer {map} />
        </div>
        <div class:hidden={!showVehicle}>
            <VehicleContainer {map} />
        </div>        
    </div>
    <div class="sidebar-buttons-container">
        <SidebarButton buttonText="🗺️" onClick={displayItinerary} />
        <SidebarButton buttonText="🚗" onClick={displayVehicle} />
    </div>
</div>