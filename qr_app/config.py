import os

rootdir = os.path.abspath(os.path.dirname(__file__))

SECRET_KEY = "my-secret-key"
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(rootdir, 'database.db')
