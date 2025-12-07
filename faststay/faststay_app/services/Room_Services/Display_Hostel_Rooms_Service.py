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
                "p_FloorNo": row[0],
                "p_SeaterNo": row[1],
                "p_BedType": row[2],
                "p_WashroomType": row[3],
                "p_CupboardType": row[4],
                "p_RoomRent": row[5],
                "p_isVentilated": row[6],
                "p_isCarpet": row[7],
                "p_isMiniFridge": row[8],
            })

        return True, rooms


    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'