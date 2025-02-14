<script>
  import { onMount } from "svelte";
  import { itineraryDistance } from "../../store.js";
  import { selectedVehicle } from "../../store.js";
  import * as turf from "@turf/turf";
  import L from "leaflet";
  import axios from "axios";

  let mapContainer;
  let map;
  let radius = 10000;
  let apiKey = "5b3ce3597851110001cf6248d87655b10a734a83883caeef98ebf801";

  // Initialisation de la map
  onMount(() => {
    map = L.map(mapContainer, {zoomControl: false}).setView([47, -0.0], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.scale({ position: "bottomleft" }).addTo(map);
  });

  // Réinitialise l'affichage de la map
  function resetMap() {
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
    });
  }

  const errorIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const stationIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const locationIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // Ajoute un marqueur avec l'icône personnalisée
  function addMarker(lat, lon, icon = blueIcon) {
      L.marker([lat, lon], { icon: icon }).addTo(map);
  }

  // Dessine une polyline sur la map
  function drawRoute(route) {
    let polyline = L.polyline(route, {color: "orange", weight: 4}).addTo(map);
    map.fitBounds(polyline.getBounds(), {padding: [50,50]})
  }

  // Calcule un itinéraire entre deux points et retourne sa polyline
  function calculateItinerary(latOrigin, lonOrigin, latDest, lonDest) {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${lonOrigin},${latOrigin}&end=${lonDest},${latDest}`;

    return axios.get(url).then((response) => {
      const coordinates = response.data.features[0].geometry.coordinates;
      const route = coordinates.map((coord) => [coord[1], coord[0]]);
      return route;
    }).catch((error) => {
      console.error("Erreur lors de l'appel API :", error);
      throw error; 
    });
  }

  // Calcule un itinéraire complet entre deux points en passant par des bornes de recharge et dessine le trajet
  export async function calculateFullItinerary(latOrigin, lonOrigin, latDest, lonDest) {
    resetMap();

    try {
      const initialRoute = await calculateItinerary(latOrigin, lonOrigin, latDest, lonDest);
      let finalRoute = [];

      let pointsRecharge = [];
      let chargingStations = [];

      if ($selectedVehicle) {
        pointsRecharge = getPointsEveryXKm(initialRoute, $selectedVehicle.range.chargetrip_range.worst);
        chargingStations = await getChargingStations(pointsRecharge, radius);
      }
      
      let coords = [];

      coords.push([latOrigin, lonOrigin]);
      addMarker(latOrigin, lonOrigin, locationIcon);

      chargingStations.forEach(point => {
        coords.push(point);
        addMarker(point[0], point[1], stationIcon);
      });
      
      coords.push([latDest, lonDest]);
      addMarker(latDest, lonDest, locationIcon);

      for (let i = 0; i < coords.length - 1; i++) {
        let lat_a = coords[i][0];
        let lon_a = coords[i][1];
        let lat_b = coords[i+1][0];
        let lon_b = coords[i+1][1];

        let route = await calculateItinerary(lat_a, lon_a, lat_b, lon_b);
        finalRoute.push(route);
      }

      drawRoute(finalRoute);

    } catch (error) {
      console.error("Erreur dans le calcul de l'itinéraire complet:", error);
    }
  }

  // Récupère les points tous les X km sur un itinéraire
  function getPointsEveryXKm(coords, distanceKm) {
    let line = turf.lineString(coords.map(coord => [coord[1], coord[0]]));
    let length = turf.length(line, { units: "kilometers" });
    let numPoints = Math.floor(length / distanceKm);

    $itineraryDistance = turf.length(line, { units: 'kilometers' });

    let sampledPoints = [];

    for (let i = 1; i <= numPoints; i++) {
      let point = turf.along(line, i * distanceKm, { units: "kilometers" });
      sampledPoints.push([point.geometry.coordinates[1], point.geometry.coordinates[0]]);
    }

    return sampledPoints;
  }

  // Récupère les bornes de recharge les plus proches de chaque point
  async function getChargingStations(coords, radius) {
    let chargingStations = [];

    for (let coord of coords) {
      let station = await fetchChargingStation(coord[0], coord[1], radius);
      if (station) {
        chargingStations.push(station);
      }
    }

    return chargingStations;
  }

  // Récupère la borne la plus proche d'un point
  async function fetchChargingStation(lat, lon, radius) {
    const url = `https://odre.opendatasoft.com/api/records/1.0/search/?dataset=bornes-irve&geofilter.distance=${lat},${lon},${radius}&rows=1`;

    try {
      const response = await axios.get(url);
      const data = response.data;
      if (data.records && data.records.length > 0) {
        const station = data.records[0].fields;
        const stationLat = station.ylatitude;
        const stationLon = station.xlongitude;

        return [stationLat, stationLon];
      } else {
        addMarker(lat, lon, errorIcon);
        return null;
      }
    } catch (error) {
      console.error('Erreur :', error);
      return null;
    }
  }

</script>

<style>
  div {
    display: flex;
    flex-grow: 1;
    z-index: 0;
  }

  :global(.leaflet-control-zoom-in), :global(.leaflet-control-zoom-out) {
    color: #dee2e6 !important;
    background-color: #212529 !important;
    border: none !important;
    border-radius: 100% !important;
  }

  :global(.leaflet-control-zoom-in):hover, :global(.leaflet-control-zoom-out):hover {
    color: #fc9047 !important;
  }

  :global(.leaflet-control-zoom) {
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
    border: none !important;
  }
</style>

<div bind:this={mapContainer}></div>
