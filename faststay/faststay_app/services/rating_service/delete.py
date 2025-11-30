from faststay_app.services.execute_function import _execute_fetch_one

class DeleteHostelRating:
    def delete_hostel_rating(self, rating_id: int, hostel_id: int, student_id: int):
        params = [rating_id, hostel_id, student_id]
        return _execute_fetch_one("DeleteHostelRating", params)