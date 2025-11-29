from django.db import connection

def Display_All_Students_service():
    function_name = "DisplayAllStudents"

    try:
    
        with connection.cursor() as cursor:
            query = f"SELECT * FROM {function_name}()"
            cursor.execute(query)
            results = cursor.fetchall()

            #Handle DataBase Response
            if not results:
                return False, 'Database returned no result'
            
            student_list = []

            for row in results:
                student_list.append({
                    "p_Semester": row[0],
                    "p_Department": row[1],
                    "p_Batch": row[2],
                    "p_RoomateCount": row[3],
                    "p_UniDistance": row[4],
                    "p_isAcRoom": row[5],
                    "p_isMess": row[6],
                    "p_BedType": row[7],
                    "p_WashroomType": row[8],
                })

            return True, student_list

    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'