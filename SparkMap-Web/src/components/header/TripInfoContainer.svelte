<script>
    import { selectedVehicle } from "../../store.js";
    import { itineraryDistance } from "../../store.js";
    import { itineraryDuration } from "../../store.js";
    import { itineraryCost } from "../../store.js";
    import { sendSOAPRequest } from "../../clients/soapClient.js";

    // Méthode qui récupère la durée du trajet via un appel SOAP
    async function getItineraryDuration(distance, vehicleRange, batteryPower) {
        const result = await sendSOAPRequest("get_trip_duration", { distance: distance, vehicle_range: vehicleRange, battery_power: batteryPower });
        itineraryDuration.set(result);
    }

    // Méthode qui récupère le coût du trajet via un appel SOAP
    async function getItineraryCost(distance, vehicleRange, batteryPower) {
        const result = await sendSOAPRequest("get_trip_cost", { distance: distance, vehicle_range: vehicleRange, battery_power: batteryPower });
        itineraryCost.set(result);
    }

    $: {
        if ($selectedVehicle && $itineraryDistance) {
            const distance = $itineraryDistance;
            const vehicleRange = ($selectedVehicle.range.chargetrip_range.worst + $selectedVehicle.range.chargetrip_range.best) / 2;
            const batteryPower = $selectedVehicle.battery.usable_kwh;

            getItineraryCost(distance, vehicleRange, batteryPower);
            getItineraryDuration(distance, vehicleRange, batteryPower);
        }
    }
</script>

<style>
    .trip-info-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        font-size: 0.8rem;
        font-weight: bold;
    }
</style>

{#if $itineraryDuration && $itineraryCost }
    <div class="trip-info-container">
        <div>⌛ {$itineraryDuration}</div>
        <div>💵 {$itineraryCost}</div>
    </div>
{/if}