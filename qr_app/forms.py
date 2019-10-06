import flask_wtf
from qr_app import models
import wtforms
from wtforms import validators as val
from sqlalchemy.inspection import inspect

class NewFlight(flask_wtf.FlaskForm):

    soldier1        = wtforms.IntegerField("Commander id")
    soldier2        = wtforms.IntegerField("Pilot id")
    coordinates     = wtforms.SelectField("Departure waypoint", choices=[
        (c.to_html_value, c.to_html_inner) for c in models.Coordinates.query.all()
    ])
    submit          = wtforms.SubmitField("Add flight")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.update_coordinates()

    def update_coordinates(self):
        self.coordinates.choices = [
            (c.to_html_value(), c.to_html_inner()) for c in models.Coordinates.query.all()
        ]

class EndFlight(flask_wtf.FlaskForm):

    flight_id       = wtforms.SelectField("Flight id", coerce=int, choices=[(flight.id, flight.id) for flight in models.Flight.query.all() if flight.is_alive()])
    submit          = wtforms.SubmitField("Terminate flight")

    def update_choices(self):
        self.flight_id.choices = [(flight.id, flight.id) for flight in models.Flight.query.all() if flight.is_alive()]
