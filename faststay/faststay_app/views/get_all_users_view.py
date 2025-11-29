from django.http import JsonResponse
from faststay_app.services.get_all_users import get_all_users
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt 
def get_all_users_view(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Only GET method allowed'}, status=405)

    try:
        users_list = get_all_users()
        return JsonResponse({
            'users': users_list, 
            'count': len(users_list)
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': 'Internal server error while fetching users'}, status=500)