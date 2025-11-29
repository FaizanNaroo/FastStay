from django.db import connection

def Display_Ratings_service():
    try:
        function_name = 'DisplayRatings'
        with connection.cursor() as cursor:
            query = f"SELECT * FROM {function_name}()"
            cursor.execute(query)
            results = cursor.fetchall()

        # Handle database result
        if not results:
            return False, 'Database returned no result.'
        
        ratings_list = []
        for row in results:
            ratings_list.append({
                "p_RatingId": row[0],
                "p_HostelId": row[1],
                "p_StudentId": row[2],
                "p_RatingStar": row[3],
                "p_MaintenanceRating": row[4],
                "p_IssueResolvingRate": row[5],
                "p_ManagerBehaviour": row[6],
                "p_Challenges": row[7],
            })

        return True, ratings_list
    
    except Exception as e:
        print(f"DB Error in {function_name}: {e}")
        return False, str(e)