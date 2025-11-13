def validate_username(username: str) -> bool:
    """Username: 3-30 chars, alphanumeric + underscore allowed."""
    pattern = r'^[a-zA-Z0-9_]{3,30}$'
    return re.fullmatch(pattern, username) is not None


def validate_phone_number(number: str) -> bool:
    """Pakistani mobile number format: 03XXXXXXXXX"""
    pattern = r'^03\d{9}$'
    return re.fullmatch(pattern, number) is not None

def validate_operating_hours(hours: int) -> bool:
    """Operating hours: 1-24"""
    return 1 <= hours <= 24

def validate_positive_number(num: int) -> bool:
    """Positive numbers (>=1)"""
    return num >= 1

def validate_non_negative_number(num: int) -> bool:
    """Non-negative numbers (>=0)"""
    return num >= 0
