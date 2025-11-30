from faststay_app.services.execute_function import _execute_display_function
class DetailsHostelMess:
    def details_hostel_mess(self, hostel_id: int):
        params = [hostel_id]
        return _execute_display_function("DisplayMessInfo", params)