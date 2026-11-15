from shop.orders import total_cents


def test_total_cents():
    assert total_cents([{"unit_cents": 250, "qty": 2}]) == 500
