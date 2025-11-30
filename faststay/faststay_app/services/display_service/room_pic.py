from faststay_app.services.execute_function import _execute_display_function

class RoomPic:
    def room_pic(self, hostel_id: int):
        params= [hostel_id]
        return _execute_display_function("DisplayRoomPics",params)