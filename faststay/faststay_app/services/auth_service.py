from django.db import connection

def register_user(function_name, params):
    try:
        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()
        return result
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return None
