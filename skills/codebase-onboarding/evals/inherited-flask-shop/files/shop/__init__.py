from flask import Flask
from .orders import bp as orders_bp


def create_app():
    app = Flask(__name__)
    app.register_blueprint(orders_bp, url_prefix="/orders")
    return app
