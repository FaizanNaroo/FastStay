from cloudinary.uploader import upload
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from faststay_app.services.add_hostel_pics_service import AddHostelPicsService

class AddHostelPics(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        hostel_id = request.data.get("p_HostelId")
        file = request.FILES.get("p_PhotoLink")

        if not hostel_id or not file:
            return Response({'error': 'Missing hostel ID or image'}, status=400)

        try:
            uploaded = upload(file)
            photo_url = uploaded.get("secure_url")

            service = AddHostelPicsService()
            is_added = service.add_hostel_photo(int(hostel_id), photo_url)

            if is_added:
                return Response({
                    'message': 'Photo uploaded successfully',
                    'photo_url': photo_url
                }, status=200)

            return Response({'error': 'Hostel not found'}, status=404)

        except Exception as e:
            return Response({'error': str(e)}, status=500)