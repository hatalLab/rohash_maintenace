import flask_wtf
from qr_app import models
import wtforms
from wtforms import validators as val

class NewFlight(flask_wtf.FlaskForm):

    team_name = wtforms.StringField("Team name", validators=(val.DataRequired(), ))

    submit          = wtforms.SubmitField("Add flight")


class EndFlight(flask_wtf.FlaskForm):

    flight_id       = wtforms.SelectField("Flight id", coerce=int, choices=[(flight.id, flight.id) for flight in models.Flight.query.all() if flight.is_alive()])
    submit          = wtforms.SubmitField("Terminate flight")

    def update_choices(self):
        self.flight_id.choices = [(flight.id, flight.id) for flight in models.Flight.query.all() if flight.is_alive()]
