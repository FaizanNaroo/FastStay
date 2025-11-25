import re
def validate_security_info(data):

    required_fields = [
        ("p_HostelId", "int"),
        ("p_GateTimings", "time"),
        ("p_isCameras", "bool"),
        ("p_isGuard", "bool"),
        ("p_isOutsiderVerification", "bool"),
    ]
    
    TIME_REGEX = re.compile(r'^\d{2}:\d{2}:\d{2}$')

    for field, field_type in required_fields:
        value = data.get(field)

        if value is None:
            return False, f"Missing required field: {field}"
        if field_type == "int":
            try:
                data[field] = int(value)
            except (ValueError, TypeError):
                return False, f"{field} must be a valid integer."
        elif field_type == "bool":
            if isinstance(value, str):
                normalized_value = value.lower()
                if normalized_value not in ('true', 'false'):
                    return False, f"{field} must be a boolean (true/false)."
                data[field] = (normalized_value == 'true')
            elif not isinstance(value, bool):
                 return False, f"{field} must be a boolean (True/False)."

        elif field_type == "time":
            if not isinstance(value, str) or not TIME_REGEX.match(value):
                return False, f"{field} must be in 'HH:MM:SS' format."

    return True, None






def validate_update_security_info(data):

    required_fields = [
        ("p_SecurityId", "int"),
        ("p_GateTimings", "time"),
        ("p_isCameras", "bool"),
        ("p_isGuard", "bool"),
        ("p_isOutsiderVerification", "bool"),
    ]
    
    TIME_REGEX = re.compile(r'^\d{2}:\d{2}:\d{2}$')

    for field, field_type in required_fields:
        value = data.get(field)

        if value is None:
            return False, f"Missing required field: {field}"
        if field_type == "int":
            try:
                data[field] = int(value)
            except (ValueError, TypeError):
                return False, f"{field} must be a valid integer."
        elif field_type == "bool":
            if isinstance(value, str):
                normalized_value = value.lower()
                if normalized_value not in ('true', 'false'):
                    return False, f"{field} must be a boolean (true/false)."
                data[field] = (normalized_value == 'true')
            elif not isinstance(value, bool):
                 return False, f"{field} must be a boolean (True/False)."

        elif field_type == "time":
            if not isinstance(value, str) or not TIME_REGEX.match(value):
                return False, f"{field} must be in 'HH:MM:SS' format."

    return True, None
    