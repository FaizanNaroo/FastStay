from django.db import connection

def Delete_Expenses_service(data):
    try:
        function_name = 'DeleteExpenses'
        params = [
            data['p_ExpenseId'],
        ]
        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()

        # Handle database result
        if not result:
            return False, 'Database returned no result.'
        
        if not result[0]:
            return False, "Expenses not found. Invalid Expense ID."
        
        return True, "Expense Deleted Successfully."

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    
    except Exception as e:
        print(f"DB Error in {function_name}: {e}")
        return False, str(e)