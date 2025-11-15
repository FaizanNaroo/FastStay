from django.db import connection

def Add_Kitchen_Detail_service(data):

    try:
        function_name = 'AddKitchenDetails'

        params = [
            data['p_HostelId'],
            data['p_isFridge'],
            data['p_isMicrowave'],
            data['p_isGas'],
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
            return False, 'Invalid Hostel ID.'

        return True, 'Kitchen Added Successfuly'

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'
