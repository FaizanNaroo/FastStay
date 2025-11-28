from faststay_app.services.execute_function import _execute_display_function

class DetailsKitchen:
    def details_kitchen(self, hostel_id: int):
        params = [hostel_id]
        return _execute_display_function("DisplayKitchenDetails",params)
    
