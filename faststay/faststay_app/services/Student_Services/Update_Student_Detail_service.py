from django.db import connection

def Update_Student_Detail_Service(function_name, data):
    '''Helper to Execute Student details entry Stored procedure'''

    try:
         # Extract fields in the order the stored function expects
        params=[
            data['p_StudentId'],
            data['p_Semester'],
            data['p_Department'],
            data['p_Batch'],
            data['p_RoomateCount'],
            data['p_UniDistance'],
            data['p_isAcRoom'],
            data['p_isMess'],
            data['p_BedType'],
            data['p_WashroomType'],        
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
                return False, 'Student ID Invalid'


    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'