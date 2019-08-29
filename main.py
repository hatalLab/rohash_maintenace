from qr_app import app, flight_session

@app.context_processor
def predefined_jinja_vars():
    return {
        'flight_session': flight_session
    }

if __name__ == "__main__":
    app.run(port=5000)
