

from django.db import connection

class DBService:

    def execute_fetch_one(self, function_name: str, params: list):
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

    def register_user(self, function_name: str, params: list):
        return self.execute_fetch_one(function_name, params)
