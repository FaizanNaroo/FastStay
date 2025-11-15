from django.db import connection

def add_app_suggestion_service(data):
    '''Helper to add reviews about the app'''
    try:
        function_name = 'AddAppSuggestion'
        # Extract fields in the order the stored function expects
        params = [
            data['p_UserId'],
            data['p_Improvements'],
            data['p_Defects'],
        ]

        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()

        #Handle DataBase Response
            if not result:
                return False, 'Database returned no result'
            
            if result[0]:
                return True, 'Data Entered Successfully'
            else:
                return False, 'Invalid User'

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'
