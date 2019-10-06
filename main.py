from qr_app import app, flight_session, db
from qr_app import models, forms, sessions

@app.context_processor
def predefined_jinja_vars():
    return {
        'flight_session': flight_session,
    }

@app.shell_context_processor
def predefined_shell_vars():
    return {
        'models':models,
        'forms':forms,
        'sessions':sessions,
        'app':app,
        'db':db,
    }

if __name__ == "__main__":
    app.run(port=5000)
