def validate_signup_data(data):
    required_fields = ['email', 'password', 'fname', 'lname', 'usertype', 'gender', 'city', 'age']
    for field in required_fields:
        if field not in data or data[field] in [None, ""]:
            return False, f"Missing field: {field}"

    # Extra validations (optional)
    if '@' not in data['email']:
        return False, "Invalid email format"
    if len(data['password']) < 6:
        return False, "Password must be at least 6 characters"

    return True, None
