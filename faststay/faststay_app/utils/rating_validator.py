def validate_hostel_rating(data):
    fields_to_check = [
        ("p_HostelId", "int", True),
        ("p_StudentId", "int", True),
        ("p_RatingStar", "int", True),
        ("p_MaintenanceRating", "int", True),
        ("p_IssueResolvingRate", "int", True),
        ("p_ManagerBehaviour", "int", True),
        ("p_Challenges", "str", True),
    ]
    
    validated_data = {}

    for field, field_type, is_required in fields_to_check:
        value = data.get(field)
        if is_required and (value is None or (isinstance(value, str) and not value.strip())):
            return False, f"Missing required field: {field}", {}

        if field_type == "int":
            try:
                int_value = int(value)
                validated_data[field] = int_value
            except (ValueError, TypeError):
                return False, f"{field} must be a valid integer.", {}

            if field in ["p_RatingStar", "p_MaintenanceRating", "p_ManagerBehaviour"]:
                if not (1 <= int_value <= 5):
                    return False, f"{field} must be between 1 and 5.", {}
            
            elif field == "p_IssueResolvingRate" and int_value <= 0:
                 return False, f"{field} must be a positive integer (number of days).", {}

        elif field_type == "str":
            if not isinstance(value, str):
                 return False, f"{field} must be a string.", {}
            validated_data[field] = value.strip()
            
    return True, None, validated_data