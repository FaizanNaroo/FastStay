from django.db import connection

def Delete_Mess_Detail_service(data):
    try:
        function_name = 'DeleteMessDetails'

        params = [
            data['p_MessId'],
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
            return False, 'Mess does not exist.'

        return True, 'Mess Deleted Successfuly'

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return None
