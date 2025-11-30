from django.db import connection

class SecurityInfo:
    def _execute_modification_function(self, function_name, params):
        try:
            with connection.cursor() as cursor:
                placeholders = ','.join(['%s'] * len(params))
                query = f"SELECT * FROM {function_name}({placeholders})"
                cursor.execute(query, params)
                result = cursor.fetchone()
                
            return result[0] if result else None
            
        except Exception as e:
            print(f"DB error during modification in {function_name}: {e}")
            return None



    def add_security_info(self, params):
        return self._execute_modification_function("AddSecurityInfo", params)
    
