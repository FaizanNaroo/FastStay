# faststay_app/utils/validators.py

import re

def validate_email(email: str) -> bool:
    """Check if email is valid."""
    regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}$'
    return re.match(regex, email) is not None

def validate_password(password: str) -> bool:
    """Check if password meets requirements (min 8 chars, 1 number, 1 uppercase, 1 LowerCase, 1 Special Character)."""
    if len(password) < 8:
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'[^a-zA-Z0-9]', password):
        return False
    return True

def validate_username(username: str) -> bool:
    """Check if username is alphanumeric and 3-30 characters."""
    if not username.isalnum():
        return False
    if not (3 <= len(username) <= 15):
        return False
    return True

def validate_name(name: str) -> bool:
    """Checks if the Name is an actual name, without special characters"""
    pattern = r'^[A-Za-z\s-]+$'
    return bool(re.fullmatch(pattern, name))

def validate_age(age: int) -> bool:
    return age >= 18

def validate_PhoneNum(Num: str) -> bool:
    pattern = r'^03[0-9]{9}$'

    return bool(re.fullmatch(pattern, Num))

def validate_OperatingHours(hours: int) -> bool:
    return 1 <= hours <= 24