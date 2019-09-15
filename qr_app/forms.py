import flask_wtf
from qr_app import models
import wtforms
from wtforms import validators as val
from sqlalchemy.inspection import inspect

class NewFlight(flask_wtf.FlaskForm):

    soldier1        = wtforms.IntegerField("Commander id")
    soldier2        = wtforms.IntegerField("Pilot id")
    coordinates     = wtforms.SelectField("Departure waypoint", choices=[
                                                                                    ((1,2), "tel aviv"),
                                                                                    ((3,4), "barcelone"),
    ])
    submit          = wtforms.SubmitField("Add flight")

    def update_coordinates(self):
        self.coordinates.choices = [((coord.x, coord.y), coord.to_str()) for coord in models.Coordinates.query.all()]

class EndFlight(flask_wtf.FlaskForm):

    flight_id       = wtforms.SelectField("Flight id", coerce=int, choices=[(flight.id, flight.id) for flight in models.Flight.query.all() if flight.is_alive()])
    submit          = wtforms.SubmitField("Terminate flight")

    def update_choices(self):
        self.flight_id.choices = [(flight.id, flight.id) for flight in models.Flight.query.all() if flight.is_alive()]
