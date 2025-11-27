from django.db import connection

def _execute_fetch_one(function_name, params):
    try:
        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()
            print("result ", result)
        return result[0] if result is not None else None
    except Exception as e:
        print(f"DB error during execution of {function_name}: {e}")
        return None
    


def _execute_display_function(function_name, params=None):
    params = params if params is not None else []
    
    try:
        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            
            if params:
                query = f"SELECT * FROM {function_name}({placeholders})"
            else:

                query = f"SELECT * FROM {function_name}()"
                
            cursor.execute(query, params)
            
            columns = [col[0].lower() for col in cursor.description]
            rows = cursor.fetchall()
            
            result_list = [
                dict(zip(columns, row)) for row in rows
            ]
            
            return result_list
            
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return []
