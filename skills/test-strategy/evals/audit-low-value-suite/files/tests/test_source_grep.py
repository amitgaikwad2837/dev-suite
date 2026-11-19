def test_pay_function_exists():
    text = open('app/pay.py').read()
    assert 'def pay' in text
