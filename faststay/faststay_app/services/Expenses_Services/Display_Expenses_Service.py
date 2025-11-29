from django.db import connection

def Display_Expenses_service(data):
    try:
        function_name = 'DisplayExpenses'
        params = [
            data['p_HostelId'],
        ]
        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()

        # Handle database result
        if not result:
            return False, 'Database returned no result.'
        
        expenses = {
            "isIncludedInRoomCharges": result[0],
            "RoomCharges": result[1],          # This is a list (float array)
            "SecurityCharges": result[2],
            "MessCharges": result[3],
            "KitchenCharges": result[4],
            "InternetCharges": result[5],
            "AcServiceCharges": result[6],
            "ElectricitybillType": result[7],
            "ElectricityCharges": result[8]
        }

        return True, expenses
    
    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    
    except Exception as e:
        print(f"DB Error in {function_name}: {e}")
        return False, str(e)