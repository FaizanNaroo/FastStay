from django.db import connection
from faststay_app.utils.Return_Codes import RETURN_CODES

def Delete_Room_service(data):

    try:
        function_name = 'DeleteRoom'

        params = [
            data['p_HostelId'],
            data['p_RoomNo'],
        ]

        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()

        # Handle database result
        if not result:
            return False, 'Database returned no result.'
        
        if not result[0]:
            return False, 'Room does not exist'

        return True, 'Room Successfully deleted.'

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'