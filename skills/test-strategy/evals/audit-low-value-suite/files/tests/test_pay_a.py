from app import pay


def test_pay_rejects_zero():
    try:
        pay(0)
    except ValueError:
        return
    assert False
