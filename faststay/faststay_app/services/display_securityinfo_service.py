from django.db import connection

class DisplaySecurityInfo:
    def _execute_select_function(self, function_name, params=None):
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


    def display_hostel_security_info(self, hostel_id: int):

        params = [hostel_id]
        return self._execute_select_function("DisplayHostelSecurityInfo", params)