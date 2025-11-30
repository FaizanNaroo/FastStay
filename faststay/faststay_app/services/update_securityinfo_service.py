
from django.db import connection

class UpdateSecurityInfo:
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
    

    def update_securityinfo(self, validated_data: dict):
        params = [
            validated_data.get("p_SecurityId"),
            validated_data.get("p_GateTimings"),
            validated_data.get("p_isCameras"),
            validated_data.get("p_isGuard"),
            validated_data.get("p_isOutsiderVerification"),
        ]
        
        return self._execute_modification_function("UpdateSecurityInfo", params)
  