
from django.http import JsonResponse
from django.views import View
from faststay_app.services.display_allrooms_service import DisplayAllRooms
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class DisplayAllRoomsView(View):
    hostel_service = DisplayAllRooms()

    def get(self, request, *args, **kwargs):
        try:
            rooms_list = self.hostel_service.display_all_rooms()
            if rooms_list:
                return JsonResponse({
                    'rooms': rooms_list, 
                    'count': len(rooms_list)
                }, status=200)
            else:
                return JsonResponse({'rooms': [], 'count': 0, 'message': 'No rooms found'}, status=200)

        except Exception as e:
            print(f"Error fetching all rooms: {e}")
            return JsonResponse({'error': 'Internal server error while fetching rooms'}, status=500)