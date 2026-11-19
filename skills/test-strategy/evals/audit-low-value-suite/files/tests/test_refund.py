import pytest
from app import refund


def test_refund_cannot_exceed_order():
    with pytest.raises(ValueError):
        refund({'amount': 10}, 20)


def test_partial_refund():
    assert refund({'amount': 10}, 4) == {'amount': 4}
