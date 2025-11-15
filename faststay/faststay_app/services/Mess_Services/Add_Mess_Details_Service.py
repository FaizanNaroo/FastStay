from django.db import connection
from faststay_app.utils.Return_Codes import RETURN_CODES

def Add_Mess_Detail_service(data):

    try:
        function_name = 'AddMessDetails'

        params = [
            data['p_HostelId'],
            data['p_MessTimeCount'],
            data['p_Dishes'], 
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
        return None
