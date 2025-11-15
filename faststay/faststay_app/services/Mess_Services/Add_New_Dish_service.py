from django.db import connection

def Add_New_Dish_Service(data):
    try:
        function_name = 'AddNewDish'

        params = [
            data['p_MessId'],
            data['p_Dish'], 
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

        return True, 'Dish added Successfuly'

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'
