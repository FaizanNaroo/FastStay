from django.db import connection

def Student_Detail_Service(function_name, data):
    '''Helper to Execute Student details entry Stored procedure'''

    try:
         # Extract fields in the order the stored function expects
        params=[
            data['UserId'],
            data['Semester'],
            data['Department'],
            data['Batch'],
            data['RoomateCount'],
            data['UniDistance'],
            data['isAcRoom'],
            data['isMess'],
            data['BedType'],
            data['WashroomType'],        
        ]
    
        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()

            #Handle DataBase Response
            if not result:
                return False, 'Database returned no result'
            
            if result:
                if result[0]:
                    return True, 'Data Entered Successfully'
            else:
                return False, 'Invalid Data'


    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'