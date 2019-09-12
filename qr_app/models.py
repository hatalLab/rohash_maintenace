import flask
from datetime import datetime
from qr_app import db

class BasicModel():

    def add_to_db(self):
        db.session.add(self)
        try:
            db.session.commit()
            print("Added flight No {} to db".format(self.id))
        except:
            db.session.rollback()
            return False
        return True

flights_to_components = db.Table('flights_to_comps',
                                 db.Column('flight_id', db.Integer, db.ForeignKey('flight.id'), primary_key=True),
                                 db.Column('comp_id', db.Integer, db.ForeignKey('component.id'), primary_key=True)
                                 )

flights_to_soldiers = db.Table('flights_to_soldiers',
                               db.Column('flight_id', db.Integer, db.ForeignKey('flight.id'), primary_key=True),
                               db.Column('soldier_id', db.Integer, db.ForeignKey('soldier.id'), primary_key=True)
                                )

class  Flight(BasicModel, db.Model):

    id          = db.Column(db.Integer, primary_key=True)
    alive       = db.Column(db.Boolean, default=True)
    start_time  = db.Column(db.DateTime, default=datetime.now())
    end_time    = db.Column(db.DateTime)

    start_coords_id = db.Column(db.Integer, db.ForeignKey('coordinates.id'))
    end_coords_id = db.Column(db.Integer, db.ForeignKey('coordinates.id'))

    components  = db.relationship("Component", secondary=flights_to_components, lazy='subquery', backref=db.backref('flights',lazy=True))
    soldiers    = db.relationship("Soldier", secondary=flights_to_soldiers, lazy='subquery', backref=db.backref('flights', lazy=True))

    def add_component(self, comp):
        if comp.id not in [c.id for c in self.components]:
            self.components.append(comp)
            db.session.commit()
            return True
        return False

    def is_alive(self):
        return self.alive

    def stop(self):
        self.alive = False

    def flight_time(self):
        """
        :return:  Flight time in seconds
        """
        if self.alive:
            return None
        delta = (self.end_time - self.start_time).total_seconds()
        return delta

    def components_types_check(self):
        types = Component.types_dict()
        flight_components = [c.type_code for c in self.components]
        check_list = {}
        for code in types.keys():
            if code in flight_components:
                check_list[code] = True
            else:
                check_list[code] = False
        return check_list

    @staticmethod
    def typecode2typename(code):
        return Component.typecode2typename(code)

    @property
    def human_flight_time(self):
        delta = self.flight_time()
        hours = delta // 3600
        minutes = (delta - hours*3600)// 60
        return "{:02.0f}:{:02.0f}".format(hours, minutes)

    @property
    def human_start_time(self):
        return self.start_time.strftime("%d/%m/%y at %H:%M")

    @property
    def human_end_time(self):
        return self.end_time.strftime("%d/%m/%y at %H:%M")

    @classmethod
    def terminate_flight(cls, id):
        flight = cls.query.get(id)
        if not flight:
            return False
        flight.alive = False
        flight.end_time = datetime.now()
        db.session.commit()
        return True


class Soldier(BasicModel,db.Model):

    id   = db.Column(db.Integer(), primary_key=True)
    role = db.Column(db.String(64))
    # flights --> list of Flight objects associated



class Coordinates(BasicModel, db.Model):
    id                   = db.Column(db.Float, primary_key=True) 
    x                    = db.Column(db.Float)
    y                    = db.Column(db.Float) 
    flight               = db.Column(db.Integer, db.ForeignKey('flight.id'))

    def to_str(self):
        return "{}-{}".format(self.x,self.y)
class Component(BasicModel, db.Model):

    id                = db.Column(db.Integer, primary_key=True)
    type_code = db.Column(db.String(64))
    # flights --> list of Flight object associated

    def total_used_time(self):
        time_flew = sum([f.flight_time() for f in self.flights]) # time in seconds
        return time_flew

    @property
    def human_total_used_time(self):
        time_flew = self.total_used_time()
        hours = time_flew // 3600
        minutes = (time_flew-hours*3600) // 60
        return "{:02.0f}:{:02.0f}".format(hours, minutes)

    @classmethod
    def get(cls, id):
        q = cls.query.get(id)
        if not q:
            return False
        return q

    @classmethod
    def types_dict(cls):
        return {
            'RW':"Right wing",
            'SW':"Small wing",
            'T':"Tail",
            'H':"Head",
            'E':"Elastic",
            'M':"Motor"
        } # ALWAYS UPPERCASE

    @classmethod
    def typecode2typename(cls, code):
        code = code.upper()
        if code not in cls.types_dict():
            return False
        return cls.types_dict()[code]

    def add_to_db(self):
        self.type_code = self.type_code.upper()
        db.session.add(self)
        try:
            db.session.commit()
            print("Added flight No {} to db".format(self.id))
        except:
            db.session.rollback()
            return False
        return True


