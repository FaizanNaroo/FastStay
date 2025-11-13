from django.db import connection

class login_user_service:

    def _execute_fetch_one(self, function_name, params):
        try:
            with connection.cursor() as cursor:
                placeholders = ','.join(['%s'] * len(params))
                query = f"SELECT * FROM {function_name}({placeholders})"
                cursor.execute(query, params)
                result = cursor.fetchone()
            return result
        except Exception as e:
            print(f"DB error during execution of {function_name}: {e}")
            return None

    def authenticate_user(self, email, password):
        login_result_tuple = self._execute_fetch_one("Login", [email, password])
        
        if not login_result_tuple or login_result_tuple[0] is not True:
            return None 
        try:
            with connection.cursor() as cursor:
                query = """
                    SELECT 
                        U.userid, 
                        U.usertype 
                    FROM users U
                    JOIN logininfo L ON U.loginid = L.loginid
                    WHERE L.email = %s;
                """
                cursor.execute(query, [email])
                
                user_info = cursor.fetchone()
                
                if user_info:
                    return (user_info[0], user_info[1])
                else:
                    print(f"CRITICAL: Login successful but Users entry missing for email: {email}")
                    return None
                    
        except Exception as e:
            print(f"DB error during user detail retrieval (Second Query): {e}")
            return None