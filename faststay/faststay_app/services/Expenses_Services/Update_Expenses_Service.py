from django.db import connection
from faststay_app.utils.Return_Codes import RETURN_CODES

def Update_Expenses_service(data):
    try:
        function_name = 'UpdateHostelExpenses'
        params = [
            data['p_ExpenseId'],
            data['p_isIncludedInRoomCharges'],
            data['p_RoomCharges'],
            data['p_SecurityCharges'],
            data['p_MessCharges'],
            data['p_KitchenCharges'],
            data['p_InternetCharges'],
            data['p_AcServiceCharges'],
            data['p_ElectricitybillType'],
            data['p_ElectricityCharges']
        ]
        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()

        # Handle database result
        if not result:
            return False, 'Database returned no result.'
        
        status = result[0]

        # Fetch message based on mapping
        message = RETURN_CODES[function_name].get(status, "Unknown database response.")

        return (status == 1), message

    
    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    
    except Exception as e:
        print(f"DB Error in {function_name}: {e}")
        return False, str(e)