from django.db import connection

def delete_Hostel_Manager_service(data):
    try:
        function_name = 'DeleteHostelManager'
        # Extract fields in the order the stored function expects
        params = [
            data['p_ManagerId'],
        ]

        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()

        # Handle database result
        if not result:
            return False, 'Database returned no result'
        if not result[0]:
            return False, 'Invalid ID or Credentials'

        return True, 'Manager Successfully Deleted'

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return None
