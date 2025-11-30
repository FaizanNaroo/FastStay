import validators 

def validate_pic_data(hostel_id_str, photolink_str,seater):

    if hostel_id_str is None:
        return False, 'Missing required field: p_HostelId'

    if seater is None:
        return False, 'Missing required field: p_RoomSeaterNo'

    if photolink_str is None or not photolink_str.strip():
        return False, 'Missing required field: p_PhotoLink'

    if not validators.url(photolink_str):
        return False, 'Photo link is invalid (must be a valid URL)'
    try:
        int(hostel_id_str)
    except ValueError:
        return False, 'HostelId must be a valid integer'
    
    try:
        int(seater)
    except ValueError:
        return False, 'Seater must be a valid integer'
    
    return True, None