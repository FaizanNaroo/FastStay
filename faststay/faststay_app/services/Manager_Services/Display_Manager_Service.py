from django.db import connection

def Display_Manager_service(data):
    function_name = "DisplayManager"

    try:
         # Extract fields in the order the stored function expects
        params=[
            data['p_ManagerId'],        
        ]
    
        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()

            #Handle DataBase Response
            if not result:
                return False, 'Database returned no result'
            
            Manager_Detail = {
                "p_PhotoLink": result[0],
                "p_PhoneNo": result[1],
                "p_Education": result[2],
                "p_ManagerType": result[3],
                "p_OperatingHours": result[4],
            }

            return True, Manager_Detail

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'