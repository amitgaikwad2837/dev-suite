from app import pay


def test_zero_amount_is_rejected():
    try:
        pay(0)
    except ValueError:
        return
    assert False
