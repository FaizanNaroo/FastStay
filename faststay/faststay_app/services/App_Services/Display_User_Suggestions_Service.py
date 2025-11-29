from django.db import connection

def Display_User_Suggestion_service():
    try:
        function_name = 'DisplayUserSuggestions'
        with connection.cursor() as cursor:
            query = f"SELECT * FROM {function_name}()"
            cursor.execute(query)
            results = cursor.fetchall()

        # Handle database result
        if not results:
            return False, 'Database returned no result.'
        
        suggestion_list = []
        for row in results:
            suggestion_list.append({
                "p_userid": row[0],
                "p_improvements": row[1],
                "p_defects": row[2],
            })

        return True, suggestion_list
    
    except Exception as e:
        print(f"DB Error in {function_name}: {e}")
        return False, str(e)