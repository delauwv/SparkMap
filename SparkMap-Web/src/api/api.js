import express from "express";
import { gql } from "@apollo/client/core/index.js";
import axios from "axios";
import { sendSOAPRequest } from "../clients/soapClient.js";
import client from "../clients/graphqlClient.js";

const app = express();
const PORT = process.env.PORT;

let apiKey = "5b3ce3597851110001cf6248d87655b10a734a83883caeef98ebf801";

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

app.use(express.json());

// ========================
// Fonctions

// Calcule la durée d'un itinéraire
async function getItineraryDuration(distance, vehicleRange, batteryPower) {
    return await sendSOAPRequest("get_trip_duration", { distance: distance, vehicle_range: vehicleRange, battery_power: batteryPower });
}

// Calcule le coût d'un itinéraire
async function getItineraryCost(distance, vehicleRange, batteryPower) {
    return await sendSOAPRequest("get_trip_cost", { distance, vehicle_range: vehicleRange, battery_power: batteryPower });
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

// Récupère la borne la plus proche d'un point
async function fetchChargingStation(lat, lon, radius) {
    const url = `https://odre.opendatasoft.com/api/records/1.0/search/?dataset=bornes-irve&geofilter.distance=${lat},${lon},${radius}&rows=1`;

    return axios.get(url).then((response) => {
        console.log(response.data);
        const station = response.data.records[0];
        return station;
    }).catch((error) => {
        console.error("Erreur lors de l'appel API :", error);
        throw error; 
    });
}

// ========================
// Routes

// Route API pour récupérer la durée de l'itinéraire
app.post("/api/itinerary-duration", async (req, res) => {
    const { distance, vehicleRange, batteryPower } = req.body;

    if (!distance || !vehicleRange || !batteryPower) {
        return res.status(400).json({ error: "Veuillez fournir distance, vehicleRange et batteryPower" });
    }

    try {
        const result = await getItineraryDuration(distance, vehicleRange, batteryPower);
        res.json({ duration: result });
    } catch (error) {
        console.error(`❌ Erreur lors de la récupération de la durée :`, error);
    }
});

// Route API pour récupérer le coût de l'itinéraire
app.post("/api/itinerary-cost", async (req, res) => {
    const { distance, vehicleRange, batteryPower } = req.body;

    if (!distance || !vehicleRange || !batteryPower) {
        return res.status(400).json({ error: "Veuillez fournir distance, vehicleRange et batteryPower" });
    }

    try {
        const result = await getItineraryCost(distance, vehicleRange, batteryPower);
        res.json({ cost: result });
    } catch (error) {
        console.error(`❌ Erreur lors de la récupération du coût :`, error);
    }
});

// Route API pour récupérer un itinéraire entre deux points
app.post("/api/itinerary", async (req, res) => {
    const { latOrigin, lonOrigin, latDest, lonDest } = req.body;

    if (!latOrigin || !lonOrigin || !latDest || !lonDest) {
        return res.status(400).json({ error: "Veuillez fournir les coordonnées gps de l'itinéraire" });
    }

    try {
        const result = await calculateItinerary(latOrigin, lonOrigin, latDest, lonDest);
        res.json({ itinerary: result });
    } catch (error) {
        console.error(`❌ Erreur lors de la récupération de l'itinéraire :`, error);
    }
});

// Route API pour récupérer la borne de recharge la plus proche d'un point donné
app.post("/api/closest-station", async (req, res) => {
    const { lat, lon, radius } = req.body;

    if (!lat || !lon || !radius) {
        return res.status(400).json({ error: "Veuillez fournir les coordonnées gps et le rayon de recherche" });
    }

    try {
        const result = await fetchChargingStation(lat, lon, radius);
        res.json({ station: result });
    } catch (error) {
        console.error(`❌ Erreur lors de la récupération de la borne :`, error);
    }
});

// Route API pour récupérer la liste des véhicules
app.post("/api/vehicles", async (req, res) => {
    try {
        const result = await client.query({ query: GET_VEHICLES });
        res.json({ vehicles: result.data.vehicleList });
    } catch (error) {
        console.error(`❌ Erreur lors de la récupération des véhicules :`, error);
    }
});

// ========================
// Démarrage du serveur

app.listen(PORT, () => {});