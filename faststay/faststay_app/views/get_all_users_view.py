
from django.http import JsonResponse
from django.views import View
from faststay_app.services.get_all_users import ProfileService
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class GetAllUsersView(View):
    profile_service = ProfileService() 

    def get(self, request, *args, **kwargs):
        try:
            users_list = self.profile_service.get_all_users()
            return JsonResponse({
                'users': users_list, 
                'count': len(users_list)
            }, status=200)

        except Exception as e:
            print(f"Error fetching all users: {e}")
            return JsonResponse({'error': 'Internal server error while fetching users'}, status=500)