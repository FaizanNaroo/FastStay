from django.db import connection

def Display_All_Managers_service():
    function_name = "DisplayAllManagers"

    try:
    
        with connection.cursor() as cursor:
            query = f"SELECT * FROM {function_name}()"
            cursor.execute(query)
            results = cursor.fetchall()

            #Handle DataBase Response
            if not results:
                return False, 'Database returned no result'
            
            Manager_list = []

            for row in results:
                Manager_list.append({
                    "p_ManagerId": row[0],
                    "p_PhotoLink": row[1],
                    "p_PhoneNo": row[2],
                    "p_Education": row[3],
                    "p_ManagerType": row[4],
                    "p_OperatingHours": row[5],
                })

            return True, Manager_list

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'