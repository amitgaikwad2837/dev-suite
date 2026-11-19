import app


def test_public_api_is_stable():
    # the package promises exactly these names to its users
    assert sorted(app.__all__) == ['pay', 'refund']
