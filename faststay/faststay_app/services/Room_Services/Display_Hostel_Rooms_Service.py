from django.db import connection

def Display_Hostel_Rooms_service(data):

    try:
        function_name = 'DisplayHostelRooms'

        params = [
            data['p_HostelId'],
        ]

        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            results = cursor.fetchall()

        # Handle database result
        if not results:
            return False, 'Database returned no result.'
        
        rooms = []
        for row in results:
            rooms.append({
                "floorNo": row[0],
                "seaterNo": row[1],
                "bedType": row[2],
                "washroomType": row[3],
                "cupboardType": row[4],
                "roomRent": row[5],
                "isVentilated": row[6],
                "isCarpet": row[7],
                "isMiniFridge": row[8],
            })

        return True, rooms


    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'