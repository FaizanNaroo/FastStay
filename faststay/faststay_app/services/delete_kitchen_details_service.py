from django.db import connection

class DeleteKitchenDetailsService:
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


    def delete_kitchen_details(self, kitchen_id: int):
        result_tuple = self._execute_fetch_one("DeleteKitchenDetails", [kitchen_id])
        if result_tuple is None:
            return None 
        
        return result_tuple[0]