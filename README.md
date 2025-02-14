## Structure du projet

Le projet est divisé en plusieurs sous-projets :

- **SparkMap-Web** : Application web développée avec Svelte.
- **SparkMap-Soap** : Service SOAP développé en Python avec Spyne.
- **SparkMap-Api** : Service REST développé avec Express.

## Installation

### Prérequis
- Node.js
- Python 3.10

#### SparkMap-Web
```sh
cd SparkMap-Web
npm install
```

#### SparkMap-Soap
```sh
cd SparkMap-Soap
pip install -r requirements.txt
```

### Démarrage

#### Lancer SparkMap-Web
```sh
cd SparkMap-Web
npm run dev
```

#### Lancer SparkMap-Soap
```sh
cd SparkMap-Soap
python app.py
```

## API

### Durée de l'itinéraire

#### Endpoint
`GET https://sparkmap-api.onrender.com/api/itinerary-duration`

#### Requête
```json
{
    "distance": 750,
    "vehicleRange": 350,
    "batteryPower": 50 
}
```

#### Réponse
```json
{
    "duration": "13h20"
}
```

### Coût de l'itinéraire

#### Endpoint
`GET https://sparkmap-api.onrender.com/api/itinerary-cost`

#### Requête
```json
{
    "distance": 750,
    "vehicleRange": 350,
    "batteryPower": 50 
}
```

#### Réponse
```json
{
    "cost": "25.00 €"
}
```

### Itinéraire

#### Endpoint
`GET https://sparkmap-api.onrender.com/api/itinerary`

#### Requête
```json
{
	"latOrigin": 48.853495,
	"lonOrigin": 2.348392,
	"latDest": 45.899235,
	"lonDest": 6.128885
}
```

#### Réponse
```json
{
	"itinerary": [
		[
			48.853712,
			2.348479
		],
		[
			48.853932,
			2.347773
		],
        ...
    ]
}
```

### Borne

#### Endpoint
`GET https://sparkmap-api.onrender.com/api/closest-station`

#### Requête
```json
{
	"lat": 48.853495,
	"lon": 2.348392,
	"radius": 1000
}
```

#### Réponse
```json
{
	"station": {
		"datasetid": "bornes-irve",
		"recordid": "d8f04fb3a4df3eb66d162428f49d95c20715ddf6",
		"fields": {
			"xlongitude": 2.34556,
			"id_station": "FR*V75*P9001*01",
			"acces_recharge": "payant",
			"date_maj": "2021-07-01",
			"n_station": "Paris | Quai du Marché Neuf 4",
			"n_amenageur": "TOTAL MARKETING FRANCE",
			"code_insee": 75101,
			"accessibilite": "7/7-24/24",
			"source": "https://www.data.gouv.fr/fr/datasets/belib-points-de-recharge-pour-vehicules-electriques-donnees-statiques/#resource-d7326edf-9943-4c41-803a-739008e08434",
			"departement": "Paris",
			"n_enseigne": "Belib'",
			"region": "Île-de-France",
			"observations": "https://belib.paris",
			"ad_station": "4 Quai du Marché Neuf, 75001 Paris",
			"id_pdc": "FR*V75*E9001*01*1",
			"n_operateur": "TOTAL MARKETING FRANCE",
			"type_prise": "CHADEMO-COMBO-T3-T2-EF",
			"code_insee_commune": "75056",
			"nbre_pdc": 3,
			"puiss_max": 22,
			"geo_point_borne": [
				48.854057,
				2.34556
			],
			"ylatitude": 48.854057,
			"dist": "216.42502993591845"
		},
		"geometry": {
			"type": "Point",
			"coordinates": [
				2.34556,
				48.854057
			]
		},
		"record_timestamp": "2024-03-31T22:59:03.09Z"
	}
}
```

### Véhicules

#### Endpoint
`GET https://sparkmap-api.onrender.com/api/vehicles`

#### Réponse
```json
{
	"vehicles": [
		{
			"__typename": "VehicleList",
			"id": "5f043d88bc262f1627fc032b",
			"naming": {
				"__typename": "VehicleListNaming",
				"make": "Audi",
				"model": "e-tron Sportback",
				"chargetrip_version": "50 quattro (2020 - 2022)"
			},
			"battery": {
				"__typename": "VehicleListBattery",
				"usable_kwh": 64.7
			},
			"range": {
				"__typename": "VehicleListRange",
				"chargetrip_range": {
					"__typename": "ChargetripRange",
					"worst": 277,
					"best": 309
				}
			}
		},
        ...
    ]
}
```

## Déploiement

### Vercel

#### Site web

[https://sparkmap.vercel.app/](https://sparkmap.vercel.app/)

### Render

#### Service SOAP

[https://sparkmap.onrender.com](https://sparkmap.onrender.com)

#### API

[https://sparkmap-api.onrender.com](https://sparkmap-api.onrender.com)
```