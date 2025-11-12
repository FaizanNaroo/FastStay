from django.db import connection

def Update_Manager_Detail_Service(data):
    try:
        function_name = 'AddManagerDetails'
        # Extract fields in the order the stored function expects
        params = [
            data['p_ManagerId'],
            data['p_PhotoLink'],
            data['p_PhoneNo'],
            data['p_Education'],
            data['p_ManagerType'],
            data['p_OperatingHours']
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

        return True, 'Data Successfully Entered'

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return None
