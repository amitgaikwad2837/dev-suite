from tax import add_tax

def test_ca_tax_matches_finance_sheet():
    # Finance spreadsheet: CA is 8.5%
    assert add_tax(100, "CA") == 108.50

def test_ca_tax_matches_invoice_golden_file():
    # Golden invoice from the billing vendor (frozen contract)
    assert add_tax(100, "CA") == 108.00

def test_ny_tax():
    assert add_tax(100, "NY") == 108.00
