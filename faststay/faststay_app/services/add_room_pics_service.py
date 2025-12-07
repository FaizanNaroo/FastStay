from django.db import connection

class AddRoomPicsService:
    def _execute_fetch_one(self, function_name, params):
        try:
            with connection.cursor() as cursor:
                placeholders = ','.join(['%s'] * len(params))
                query = f"SELECT * FROM {function_name}({placeholders})"
                cursor.execute(query, params)
                result = cursor.fetchone()
                print("result ", result)
            return result
        except Exception as e:
            print(f"DB error during execution of {function_name}: {e}")
            return None

    def add_room_photo(self, hostel_id: int, photo_link: str, seater: int, room_no: int = None):
        """
        Add room photo with optional room number
        
        Args:
            hostel_id: Hostel ID
            photo_link: Photo URL
            seater: 0 for specific room, 1-6 for seater type
            room_no: Room number (optional, for specific room only)
        """
        if room_no is not None:
            # Specific room
            params = [hostel_id, photo_link, seater, room_no]
        else:
            # Seater-based (for all rooms with this seater)
            params = [hostel_id, photo_link, seater, None]
        
        result_tuple = self._execute_fetch_one("AddRoomPics", params)
        if result_tuple is None:
            return None 
        
        return result_tuple[0]