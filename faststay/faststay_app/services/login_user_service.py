from django.db import connection


def execute_fetch_one(function_name, params):
    """
    Generic helper to call a PostgreSQL function that returns a single result (row/value).
    This is used for the Login function which returns a single boolean.
    """
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

def authenticate_user(email, password):
    login_result_tuple = execute_fetch_one("Login", [email, password])
    if not login_result_tuple or login_result_tuple[0] is not True:
        return None 
    try:
        with connection.cursor() as cursor:
            query = """
                        SELECT 
                            U.userid, 
                            U.usertype 
                        FROM users U  -- <-- Changed to lowercase, no quotes
                        JOIN logininfo L ON U.loginid = L.loginid  -- <-- Changed to lowercase, no quotes
                        WHERE L.email = %s;
                    """
            cursor.execute(query, [email])
            
            user_info = cursor.fetchone()
            
            if user_info:
                user_id = user_info[0]
                usertype = user_info[1]
                return (user_id, usertype)
            else:
                return None
                
    except Exception as e:
        print(f"DB error during user detail retrieval: {e}")
        return None