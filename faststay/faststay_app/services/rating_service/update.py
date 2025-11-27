from faststay_app.services.execute_function import _execute_fetch_one

class UpdateRating:

    def update_hostel_rating(self, validated_data: dict):
            params = [
                validated_data.get("p_RatingId"),
                validated_data.get("p_HostelId"),
                validated_data.get("p_StudentId"),
                validated_data.get("p_RatingStar"),
                validated_data.get("p_MaintenanceRating"),
                validated_data.get("p_IssueResolvingRate"),
                validated_data.get("p_ManagerBehaviour"),
                validated_data.get("p_Challenges"),
            ]
            
            sql_return_code = _execute_fetch_one("AddHostelRating", params)
            
            return sql_return_code if sql_return_code is not None else None