def pay(amount, currency='USD'):
    if amount <= 0:
        raise ValueError('amount must be positive')
    return {'amount': amount, 'currency': currency}


def refund(order, amount):
    if amount > order['amount']:
        raise ValueError('refund exceeds order')
    return {'amount': amount}


def _reset_for_tests():
    # only called from tests
    pass
