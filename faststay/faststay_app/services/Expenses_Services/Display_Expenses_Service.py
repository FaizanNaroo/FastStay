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
            "expense_id": result[0],
            "isIncludedInRoomCharges": result[1],
            "RoomCharges": result[2],          # This is a list (float array)
            "SecurityCharges": result[3],
            "MessCharges": result[4],
            "KitchenCharges": result[5],
            "InternetCharges": result[6],
            "AcServiceCharges": result[7],
            "ElectricitybillType": result[8],
            "ElectricityCharges": result[9]
        }

        return True, expenses
    
    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    
    except Exception as e:
        print(f"DB Error in {function_name}: {e}")
        return False, str(e)