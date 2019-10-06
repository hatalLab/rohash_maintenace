from qr_app import db
from qr_app import models
import random
import faker
from faker import providers

fake = faker.Faker()
fake.add_provider(providers.geo)

def populate_coordinates():
    fake_coords = lambda: random.randrange(1,100)+random.random()
    coords_set = set()
    for x in range(1000):
        coords_set.add(fake.local_latlng(country_code="IL"))

    for coord in coords_set:
        db.session.add(models.Coordinates(north=coord[0], east=coord[1], name=coord[2]) )
        db.session.commit()

def main():
    populate_coordinates()

if __name__ == "__main__":
    main()
