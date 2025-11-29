from django.db import connection

def Display_Student_service(data):
    function_name = "DisplayStudent"

    try:
         # Extract fields in the order the stored function expects
        params=[
            data['p_StudentId'],        
        ]
    
        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()

            #Handle DataBase Response
            if not result:
                return False, 'Database returned no result'
            
            Student_Detail = {
                "p_Semester": result[0],
                "p_Department": result[1],
                "p_Batch": result[2],
                "p_RoomateCount": result[3],
                "p_UniDistance": result[4],
                "p_isAcRoom": result[5],
                "p_isMess": result[6],
                "p_BedType": result[7],
                "p_WashroomType": result[8],
            }

            return True, Student_Detail

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'