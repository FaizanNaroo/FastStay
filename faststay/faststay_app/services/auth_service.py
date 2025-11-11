from django.db import connection

def register_user(function_name, data):
    """Generic helper to call a PostgreSQL stored function."""
    try:
        # Extract fields in the order the stored function expects
        params = [
            data['usertype'],
            data['fname'],
            data['lname'],
            data['age'],
            data['gender'],
            data['city'],
            data['email'],
            data['password'],
        ]

        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()

        # Handle database result
        if not result:
            return False, 'Database returned no result'
        if result[0] == -1:
            return False, 'Email Already exists'

        return True, result[0]

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return None
