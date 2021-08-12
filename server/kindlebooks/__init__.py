from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from flask_cors import CORS

import pandas as pd
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'DATABASE_URI'
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = { 'pool_recycle' : 60}
CORS(app, resources={r"/*": {"origins": "*"}})
db = SQLAlchemy(app)
csv_file_path = "./books.csv"


def init_db():
    engine = create_engine(
        'DATABASE_URI', pool_recycle=60)
    with open(csv_file_path, 'r') as file:
        data_df = pd.read_csv(file)
        data_df.to_sql('book', con=engine, index=True,
                       index_label='id', if_exists='replace')



@app.route("/seed")
def seed():
    init_db()

from kindlebooks import routes
