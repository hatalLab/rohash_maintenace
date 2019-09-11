import flask
import base64
import functools
from qr_app import forms, models
from qr_app import app, flight_session

##### utils #####

def flight_required(f):

     @functools.wraps(f)
     def wrapper(*args, **kwargs):
         if not flight_session.alive():
             return flask.redirect(flask.url_for('new_flight'))
         return f(*args, **kwargs)

     return wrapper

def return_callback(default=None):

    def decorator(f):

        @functools.wraps(f)
        def wrapper(*args, **kwargs):
            r = f(*args, **kwargs)
            print("From return callback: ",flask.request.args)
            if 'callback' in flask.request.args:
                return flask.redirect(flask.url_for(flask.request.args.get('callback'), default=default))
            return r
        return wrapper
    return decorator


##### ROUTES #####

@app.route('/')
def homepage():
    return flask.redirect(flask.url_for("flights_history"))

@app.route('/new-flight',  methods=("GET", "POST"))
def new_flight():
    form = forms.NewFlight()
    if form.validate_on_submit():
        commander   = models.Soldier(id=form.soldier1.data, role="commander")
        pilot       = models.Soldier(id=form.soldier2.data, role="pilot")
        coords_data = form.coordinates.data
        coordinates = models.Coordinates(x=coords_data[0], y=coords_data[1])
        new_flight = models.Flight(team_name=form.team_name.data)

        new_flight.soldiers.append(commander)
        new_flight.soldiers.append(pilot)
        coordinates.flights.append(new_flight)

        new_flight.add_to_db()
        set_flight(new_flight.id)
        return flask.redirect(flask.url_for('scan', flight=new_flight))

    return flask.render_template("new_flight.jin", form=form)

@app.route('/scan')
@flight_required
def scan():
    return flask.render_template("scan.jin")

@app.route('/qr-process/<component_id>')
def on_qr_find(component_id): # USELESS
    """
    :param component_id:  base64 encoded id of component
    """
    decoded = base64.b64decode(component_id).decode('utf-8')
    return flask.render_template("qr_process.jin")

@app.route('/flights') # TODO: CSS THIS
def flights_history():
    flights = {flight: flight.is_alive() for flight in models.Flight.query.all()}
    print(flights)
    sorted_flights = {f: flights[f] for f in sorted(flights, key=lambda i: flights[i], reverse=True)}
    return flask.render_template('flights_list.jin', flights=sorted_flights)

@app.route('/flight-details/<int:flight_id>')
def flight_details(flight_id):
    flight = models.Flight.query.get(flight_id)
    if not flight:
        return flask.redirect(flask.url_for('homepage'))    # TODO: Display an  404 page

    return flask.render_template("flight_details.jin", flight=flight)

@app.route('/end-flight', methods=("GET", "POST"))
def end_flight():
    form = forms.EndFlight()
    form.update_choices()
    if form.validate_on_submit():
        models.Flight.terminate_flight(form.flight_id.data)
        return flask.redirect(flask.url_for('homepage'))
    else:
        print('From <end_flight>, error on form:',form.errors)
    return flask.render_template('end_flight.jin', form=form)

@app.route("/api-test/<text>")
@return_callback
def test(text):
    print(text)
    return flask.redirect(flask.url_for('homepage'))

@app.route("/component-details/<int:comp_id>")
def component_details(comp_id):
    comp = models.Component.query.get(comp_id)
    if not comp:
        return flask.redirect(flask.url_for('homepage')) # TODO 404
    return flask.render_template('component_details.jin', component=comp)


# API
@app.route('/set-flight/<int:flight_id>', methods=('POST', 'GET'))
def set_flight(flight_id):
    callback = flask.request.args.get('callback', default=flask.url_for('homepage'), type=str)
    flight = models.Flight.query.get(flight_id)
    if not flight:
        return redirect(callback)
    flight_session.set(flight)
    return flask.redirect(callback)

@app.route('/stop-flight/<int:flight_id>', methods=('POST', 'GET'))
def stop_flight(flight_id):
    models.Flight.terminate_flight(flight_id)
    print("Terminated flight {}".format(flight_id))
    if flight_id == flight_session.flight_id:
        flight_session.unset()
    callback = flask.request.args.get('callback', default=flask.url_for('homepage'), type=str)
    return flask.redirect(callback)

@app.route('/get-flight-id')
def get_flight_id():
    d = {'flight_id':  flight_session.flight_id}
    return flask.jsonify(d)

@app.route('/api-qr-process/<component_id>')
def on_qr_find_api(component_id):
    """
    :param component_id:  base64 encoded id of component
    """
    decoded_id = base64.b64decode(component_id).decode('utf-8')
    try:
        decoded_id = int(decoded_id)
    except:
        return flask.jsonify({'success':False, 'text':'Bad QR information'})

    comp = models.Component.get(decoded_id)

    if not comp:
        comp = models.Component(id=decoded_id,)

    if flight_session.get_current_flight().add_component(comp):
        resp = {'success':True,  "text": "Component No {} added to flight {}".format(comp.id, flight_session.flight_id)}
    else:
        resp = {'success':True, "text": "Component No {} already exist in flight {}".format(comp.id, flight_session.flight_id)}

    return flask.jsonify(resp)
