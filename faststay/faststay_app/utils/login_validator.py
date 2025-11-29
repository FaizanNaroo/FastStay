# faststay_app/utils/auth_validators.py

def validate_login_data(data):
    required_fields = ['email', 'password']
    
    for field in required_fields:
        if field not in data:
            return False, f"Missing required login field: {field}"
            
        value = data[field]
        if not isinstance(value, str) or not value.strip():
            return False, f"'{field}' must be a non-empty string."

    return True, None