from django.db import connection

def Display_Room_service(data):

    try:
        function_name = 'DisplaySingleRoom'

        params = [
            data['p_HostelId'],
            data['p_RoomNo'],
        ]

        with connection.cursor() as cursor:
            placeholders = ','.join(['%s'] * len(params))
            query = f"SELECT * FROM {function_name}({placeholders})"
            cursor.execute(query, params)
            result = cursor.fetchone()

        if not result:
            return False, "Room not found."

        room_details = {
            "floorNo": result[0],
            "seaterNo": result[1],
            "bedType": result[2],
            "washroomType": result[3],
            "cupboardType": result[4],
            "roomRent": result[5],
            "isVentilated": result[6],
            "isCarpet": result[7],
            "isMiniFridge": result[8],
        }

        return True, room_details
    
    except KeyError as e:
        return False, f'Missing field: {str(e)}' 
    except Exception as e:
        print(f"DB error in {function_name}: {e}")
        return False, f'Database Error: {e}'