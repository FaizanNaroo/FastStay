from faststay_app.services.execute_function import _execute_display_function

class RoomPic:
    def room_pic(self, hostel_id: int):
        params = [hostel_id]
        raw_list = _execute_display_function("DisplayRoomPics", params)

        fixed = []
        for item in raw_list:
            fixed.append({
                "p_PhotoLink": item.get("p_photolink"),
                "p_RoomNo": item.get("p_roomno"),
                "p_RoomSeaterNo": item.get("p_roomseaterno"),
            })

        return fixed