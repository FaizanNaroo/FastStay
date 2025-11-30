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

def validate_NNums(num: int) -> bool:
    return num >= 1

def validate_Nums(num: int) -> bool:
    return num >= 0

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