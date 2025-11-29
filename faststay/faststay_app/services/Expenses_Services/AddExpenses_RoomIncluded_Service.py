from django.db import connection

def AddExpenses_RoomIncluded_service(data):
    try:
        function_name = 'AddExpenses_RoomIncluded'
        params = [
            data['p_HostelId'],
            data['p_SecurityCharges'],
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
            return False, 'Hostel Not Found.'
        
        return True, "Expenses Added Successfully."
    
    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    
    except Exception as e:
        print(f"DB Error in {function_name}: {e}")
        return False, str(e)