RATES = {"CA": 0.085, "NY": 0.08}

def add_tax(amount, region):
    """Return amount plus sales tax for the region."""
    return round(amount * (1 + RATES[region]), 2)
