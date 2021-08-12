from kindlebooks import db


class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    telegram_id = db.Column(db.Integer, unique=False, nullable=False)
    channel_id = db.Column(db.Integer, unique=False, nullable=False)
    drive_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(120), unique=False, nullable=False)
    type = db.Column(db.String(100), unique=False, nullable=False)
    size = db.Column(db.Integer, unique=False, nullable=False)
    views = db.Column(db.Integer, unique=False, nullable=False)
    downloaded = db.Column(db.Integer, unique=False, nullable=False, default=0)

    def to_json(self):
        return {
            'id': self.id,
            'drive_id': self.drive_id,
            'name': self.name,
            'type': self.type,
            'size': self.size,
            'views': self.views,
            'downloaded': self.downloaded
        }
