from django.db import connection
from faststay_app.utils.Return_Codes import RETURN_CODES

def Update_Room_service(data):

    try:
        function_name = 'UpdateRoom'

        params = [
            data['p_RoomNo'],
            data['p_HostelId'],
            data['p_FloorNo'],
            data['p_SeaterNo'],
            data['p_RoomRent'],
            data['p_BedType'],
            data['p_WashroomType'],
            data['p_CupboardType'],
            data['p_isVentilated'],
            data['p_isCarpet'],
            data['p_isMiniFridge'],
        ]

        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()

        # Handle database result
        if not result:
            return False, 'Database returned no result.'
        
        status = result[0]

        # Fetch message based on mapping
        message = RETURN_CODES[function_name].get(status, "Unknown database response.")

        return (status == 1), message

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'