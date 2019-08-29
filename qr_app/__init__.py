import flask
import flask_sqlalchemy, flask_migrate


app = flask.Flask(__name__)
app.config.from_pyfile('config.py')

db = flask_sqlalchemy.SQLAlchemy(app)
migrate = flask_migrate.Migrate(app, db)

from qr_app.sessions import FlightSession
flight_session = FlightSession()
from qr_app import routes, models
