from qr_app import models

class FlightSession:

    def __init__(self):
        self.flight_id = None
        self.current_flight = None

    def set(self, flight):
        self.flight_id = flight.id
        self.current_flight = flight

    def get_team_name(self):
        return self.current_flight.team_name

    def get_current_flight(self):
        return models.Flight.query.get(self.flight_id)

    def unset(self):
        self.flight_id = None

    def alive(self):
        return self.flight_id != None
