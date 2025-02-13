from spyne import *
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication
from wsgiref.simple_server import make_server
from constants import AVERAGE_SPEED, STATION_POWER, CHARGE_UNIT_COST
from headersHandler import HeaderHandler
import os

# Calcul du nombre de recharges nécessaires
def get_charge_number(distance, vehicle_range):
    charge_number = distance // vehicle_range
    if distance % vehicle_range == 0:
        charge_number -= 1

    return charge_number

# Classe contenant les méthodes SOAP pour les estimations sur le trajet
class TripInfoService(ServiceBase):

    # Calcule une estimation de durée pour un trajet en voiture electrique
    @rpc(Float, Float, Float, _returns=String)
    def get_trip_duration(ctx, distance, vehicle_range, battery_power):
        charge_number = get_charge_number(distance, vehicle_range)

        # Calcul de la durée de trajet sans rechargement en heures
        initial_trip_duration = distance / AVERAGE_SPEED

        # Temps de chargement en heures
        charging_duration = charge_number * (battery_power / STATION_POWER)

        # Durée totale du trajet en prenant en compte les temps de chargement
        total_trip_duration = initial_trip_duration + charging_duration

        # Conversion en heures et minutes
        total_hours = int(total_trip_duration)
        total_minutes = int((total_trip_duration - total_hours) * 60)

        return f"{total_hours:02d}h{total_minutes:02d}"

    # Calcule une estimation de coût pour un trajet en voiture electrique
    @rpc(Float, Float, Float, _returns=String)
    def get_trip_cost(ctx, distance, vehicle_range, battery_power):
        charge_number = get_charge_number(distance, vehicle_range)
        final_cost = charge_number * (CHARGE_UNIT_COST * battery_power)

        return f"{final_cost:.2f} €"

application = Application([TripInfoService], 'sparkmap.soap',
    in_protocol=Soap11(validator='lxml'),
    out_protocol=Soap11()
)

wsgi_application = HeaderHandler(WsgiApplication(application))

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 6262))
    print(f"Serving on http://0.0.0.0:{port}")
    server = make_server('0.0.0.0', port, wsgi_application)
    server.serve_forever()