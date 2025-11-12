from django.http import JsonResponse
from faststay_app.services.login_user_service import authenticate_user
from faststay_app.utils.login_validator import validate_login_data
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt 
def login_view(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

    try:
        data = json.loads(request.body)
        is_valid, error = validate_login_data(data)
        if not is_valid:
            return JsonResponse({'error': error}, status=400)

        email = data.get('email')
        password = data.get('password')
        user_data = authenticate_user(email, password) 
        if user_data is None:
            return JsonResponse({'error': 'Invalid email or password'}, status=401)

        user_id, usertype = user_data
        return JsonResponse({
            'message': 'Login successful', 
            'user_id': user_id,
            'usertype': usertype
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON input'}, status=400)
    except Exception as e:
        print(f"Login view server error: {e}")
        return JsonResponse({'error': f'Internal Server Error'}, status=500)