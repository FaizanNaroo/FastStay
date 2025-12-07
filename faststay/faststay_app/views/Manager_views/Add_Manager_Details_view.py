from cloudinary.uploader import upload, destroy
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from faststay_app.serializers import Add_Manager_Details_serializer
from faststay_app.services import Add_Manager_Detail_Service
from rest_framework.parsers import MultiPartParser, FormParser

class Add_Manager_Details_view(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = Add_Manager_Details_serializer(data=request.data)

        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES.get("p_PhotoLink")
        photo_url = None
        public_id = None

        if file:
            try:
                upload_result = upload(file)
                photo_url = upload_result.get("secure_url")
                public_id = upload_result.get("public_id")
            except Exception as e:
                return Response({'error': f'Photo upload failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        validated_data = serializer.validated_data
        validated_data['p_PhotoLink'] = photo_url

        # Call your service
        success, result = Add_Manager_Detail_Service(validated_data)

        # If service fails, delete uploaded photo
        if not success and public_id:
            try:
                destroy(public_id)
            except Exception as e:
                print(f"Failed to delete Cloudinary photo: {str(e)}")

        if not success:
            return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': result, 'result': success}, status=status.HTTP_201_CREATED)