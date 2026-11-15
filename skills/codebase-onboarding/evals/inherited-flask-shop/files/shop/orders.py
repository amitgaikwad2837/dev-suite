from flask import Blueprint, request, jsonify
import stripe
from .db import Session

bp = Blueprint("orders", __name__)

# All money is integer cents. Never use floats here.
def total_cents(items):
    return sum(i["unit_cents"] * i["qty"] for i in items)


@bp.post("/")
def create_order():
    data = request.get_json()
    total = total_cents(data["items"])
    intent = stripe.PaymentIntent.create(amount=total, currency="usd")
    with Session() as s:
        s.execute("INSERT INTO orders (total_cents, stripe_id) VALUES (:t, :i)",
                  {"t": total, "i": intent.id})
        s.commit()
    return jsonify(id=intent.id, total_cents=total), 201
