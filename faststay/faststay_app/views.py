from django.shortcuts import render
from django.http import JsonResponse
from faststay_app.services.auth_service import register_user
from faststay_app.utils.validators import validate_signup_data
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt 
def signup_view(request):
    """Handles user signup by calling Supabase stored function 'signin'."""
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

    try:
        # 1️⃣ Parse incoming data
        data = json.loads(request.body)

        # 2️⃣ Validate input
        is_valid, error = validate_signup_data(data)
        if not is_valid:
            return JsonResponse({'error': error}, status=400)

        # 3️⃣ Extract data fields
        email = data['email']
        password = data['password']
        fname = data['fname']
        lname = data['lname']
        usertype = data['usertype']
        gender = data['gender']
        city = data['city']
        age = data['age']

        # 4️⃣ Call Supabase stored function
        result = register_user(
            "signin",
            [usertype, fname, lname, age, gender, city, email, password]
        )

        # 5️⃣ Handle result (assuming your function returns user_id or error code)
        if not result:
            return JsonResponse({'error': 'Database returned no result'}, status=500)

        user_id = result[0]
        if user_id == -1:
            return JsonResponse({'error': 'Email already exists'}, status=400)

        return JsonResponse({'message': 'User created successfully', 'user_id': user_id})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON input'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
