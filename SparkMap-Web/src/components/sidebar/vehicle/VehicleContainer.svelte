<script>
    import { onMount } from "svelte";
    import { gql } from "@apollo/client";
    import { selectedVehicle } from "../../../store.js";
    import { latOrigin, lonOrigin, latDest, lonDest } from '../../../store.js';
    import client from "../../../clients/graphqlClient.js";

    export let map;

    let vehicles = [];
    let loading = true;
    let error = null;

    const GET_VEHICLES = gql`
        query vehicleListAll {
            vehicleList(size: 100) {
                id
                naming {
                    make
                    model
                    chargetrip_version
                }
                battery {
                    usable_kwh
                }
                range {
                    chargetrip_range {
                        worst
                        best
                    }
                }
            }
        }
    `;

    // Chargement des véhicules à l'initialisation
    onMount(async () => {
        try {
            const { data } = await client.query({ query: GET_VEHICLES });
            vehicles = data.vehicleList;
            $selectedVehicle = vehicles[0];
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    });

    // Fonction pour gérer la sélection d'un véhicule
    function selectVehicle(vehicle) {
        selectedVehicle.set(vehicle);

        if ($latOrigin && $lonOrigin && $latDest && $lonDest) {
            map.calculateFullItinerary($latOrigin, $lonOrigin, $latDest, $lonDest);
        }
    }
</script>

<style>
    .vehicle-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow-y: auto;
    }
    .vehicle-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;
        padding: 16px;
        background: #212529;
        color: white;
        border-radius: 5px;
        border: 1px solid #495057;
        cursor: pointer;
    }

    .vehicle-item:hover {
        background-color: #495057;
    }

    .selected, .vehicle-item.selected:hover {
        background: #212529;
        border-color: #fc9047;
    }

    .vehicle-name {
        font-size: 1.2rem;
        font-weight: bold;
    }

    p {
        margin: 0;
    }
</style>

{#if loading}
    <p>Chargement des véhicules...</p>
{:else if error}
    <p>Erreur : {error}</p>
{:else}
    <div class="vehicle-list">
        {#each vehicles as vehicle}
            <div class="vehicle-item" 
                class:selected={$selectedVehicle === vehicle}
                on:click={() => selectVehicle(vehicle)}>
                <p class="vehicle-name">{vehicle.naming.make} {vehicle.naming.model} 🚗</p>  
                <p>Modèle : {vehicle.naming.chargetrip_version}</p>
                <p>Batterie : {vehicle.battery.usable_kwh} kWh ⚡</p>
                <p>Autonomie : {vehicle.range.chargetrip_range.worst} - {vehicle.range.chargetrip_range.best} km</p>
            </div>
        {/each}
    </div>
{/if}
