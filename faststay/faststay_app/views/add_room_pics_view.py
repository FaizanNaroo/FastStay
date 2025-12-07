from django.views import View
from faststay_app.services.add_room_pics_service import AddRoomPicsService
from faststay_app.utils.room_pic_validator import validate_pic_data
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from cloudinary.uploader import upload, destroy
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.uploadedfile import UploadedFile
import base64
from io import BytesIO

@method_decorator(csrf_exempt, name='dispatch')
class AddRoomPics(View):
    
    def post(self, request, *args, **kwargs):
        auth_service = AddRoomPicsService()
        
        try:
            # Check if request has files (multipart/form-data) or JSON data
            if request.content_type == 'multipart/form-data':
                return self.handle_multipart_request(request, auth_service)
            else:
                return self.handle_json_request(request, auth_service)
                
        except Exception as e:
            print(f"Error adding room photo: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)
    
    def handle_json_request(self, request, auth_service):
        """Handle JSON request with direct photo links"""
        try:
            data = json.loads(request.body)

            hostel_id_str = data.get("p_HostelId")
            photolink_str = data.get("p_PhotoLink")
            seater_str = data.get("p_RoomSeaterNo")

            is_valid, error = validate_pic_data(hostel_id_str, photolink_str, seater_str)
            if not is_valid:
                return JsonResponse({'error': error}, status=400)
            
            hostel_id = int(hostel_id_str)
            seater = int(seater_str)
 
            is_added = auth_service.add_room_photo(hostel_id, photolink_str, seater)

            if is_added is True:
                return JsonResponse({
                    'message': f'Photo for Hostel ID {hostel_id} and room seater {seater} successfully added',
                    'photo_url': photolink_str
                }, status=200)

            elif is_added is False:
                return JsonResponse({'error': f'Hostel ID {hostel_id} and room seater {seater} not found'}, status=404)

            else:
                return JsonResponse({'error': 'Database system error during insertion'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)
    
    def handle_multipart_request(self, request, auth_service):
        """Handle multipart/form-data request with file uploads"""
        try:
            # Get form data
            hostel_id_str = request.POST.get("p_HostelId")
            seater_str = request.POST.get("p_RoomSeaterNo")
            room_no_str = request.POST.get("p_RoomNo")  # NEW: Get room number
            apply_to_all = request.POST.get("applyToAll", "false").lower() == "true"
            
            # Check for multiple files
            files = request.FILES.getlist('p_PhotoLink')
            
            if not files:
                return JsonResponse({'error': 'No photos uploaded'}, status=400)
            
            if len(files) > 5:
                return JsonResponse({'error': 'Maximum 5 photos allowed'}, status=400)
            
            # Validate basic data
            if not hostel_id_str:
                return JsonResponse({'error': 'Missing required field: p_HostelId'}, status=400)
            
            # Validate IDs
            try:
                hostel_id = int(hostel_id_str)
                seater = int(seater_str) if seater_str else 0
                room_no = int(room_no_str) if room_no_str else None
            except ValueError:
                return JsonResponse({'error': 'Invalid numeric format'}, status=400)
            
            uploaded_urls = []
            public_ids = []
            failed_uploads = []
            
            # Upload each file to Cloudinary
            for file in files:
                try:
                    # Validate file type
                    if not file.content_type.startswith('image/'):
                        failed_uploads.append(f"{file.name}: Not a valid image file")
                        continue
                    
                    # Validate file size (max 5MB)
                    if file.size > 5 * 1024 * 1024:
                        failed_uploads.append(f"{file.name}: File too large (max 5MB)")
                        continue
                    
                    # Upload to Cloudinary
                    upload_result = upload(file, 
                                        folder=f"faststay/hostel_{hostel_id}/rooms",
                                        resource_type="image")
                    
                    photo_url = upload_result.get("secure_url")
                    public_id = upload_result.get("public_id")
                    
                    if photo_url:
                        uploaded_urls.append(photo_url)
                        public_ids.append(public_id)
                        
                        # Save to database
                        if apply_to_all:
                            # Save with seater number for all rooms with this seater
                            # seater is the actual seater number (1-6), room_no is None
                            is_added = auth_service.add_room_photo(
                                hostel_id, photo_url, seater, None
                            )
                        else:
                            # Save for specific room
                            # seater is 0, room_no is the specific room number
                            if room_no is None:
                                failed_uploads.append(f"{file.name}: Room number required for specific room upload")
                                continue
                            is_added = auth_service.add_room_photo(
                                hostel_id, photo_url, 0, room_no
                            )
                        
                        if not is_added:
                            # Clean up the uploaded file if database save failed
                            try:
                                destroy(public_id)
                            except:
                                pass
                            uploaded_urls.remove(photo_url)
                            public_ids.remove(public_id)
                            failed_uploads.append(f"{file.name}: Failed to save to database")
                            
                except Exception as e:
                    print(f"Error uploading file {file.name}: {e}")
                    failed_uploads.append(f"{file.name}: Upload failed - {str(e)}")
                    continue
            
            # Clean up all uploaded files if no URLs were successfully saved
            if not uploaded_urls and public_ids:
                for pid in public_ids:
                    try:
                        destroy(pid)
                    except:
                        pass
            
            # Prepare response
            if uploaded_urls:
                response_data = {
                    'message': f'Successfully uploaded {len(uploaded_urls)} photo(s)',
                    'uploaded_urls': uploaded_urls,
                    'total_uploaded': len(uploaded_urls),
                    'hostel_id': hostel_id,
                    'seater': seater,
                    'room_no': room_no,
                    'apply_to_all': apply_to_all
                }
                
                if failed_uploads:
                    response_data['failed_uploads'] = failed_uploads
                    response_data['partial_success'] = True
                
                return JsonResponse(response_data, status=200)
            else:
                return JsonResponse({
                    'error': 'All uploads failed',
                    'failed_uploads': failed_uploads
                }, status=400)
                
        except Exception as e:
            print(f"Error in multipart request: {e}")
            return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)
    
    def handle_base64_request(self, request, auth_service):
        """Handle base64 encoded image data (alternative method)"""
        try:
            data = json.loads(request.body)
            
            hostel_id_str = data.get("p_HostelId")
            seater_str = data.get("p_RoomSeaterNo")
            base64_image = data.get("p_PhotoLink")
            apply_to_all = data.get("applyToAll", False)
            
            if not base64_image or not hostel_id_str or not seater_str:
                return JsonResponse({'error': 'Missing required fields'}, status=400)
            
            try:
                seater = int(seater_str)
                hostel_id = int(hostel_id_str)
            except ValueError:
                return JsonResponse({'error': 'Invalid seater or hostel ID format'}, status=400)
            
            # Decode base64 image
            try:
                # Remove data URL prefix if present
                if 'base64,' in base64_image:
                    base64_image = base64_image.split('base64,')[1]
                
                image_data = base64.b64decode(base64_image)
                
                # Upload to Cloudinary
                upload_result = upload(
                    BytesIO(image_data),
                    folder=f"faststay/hostel_{hostel_id}/rooms",
                    resource_type="image"
                )
                
                photo_url = upload_result.get("secure_url")
                
                if not photo_url:
                    return JsonResponse({'error': 'Failed to upload to Cloudinary'}, status=500)
                
                # Save to database
                if apply_to_all:
                    is_added = auth_service.add_room_photo(hostel_id, photo_url, seater)
                else:
                    is_added = auth_service.add_room_photo(hostel_id, photo_url, 0)
                
                if is_added:
                    return JsonResponse({
                        'message': 'Photo uploaded successfully',
                        'photo_url': photo_url
                    }, status=200)
                else:
                    # Try to delete from Cloudinary
                    try:
                        destroy(upload_result.get('public_id'))
                    except:
                        pass
                    return JsonResponse({'error': 'Failed to save to database'}, status=500)
                    
            except Exception as e:
                print(f"Error processing base64 image: {e}")
                return JsonResponse({'error': 'Invalid image data'}, status=400)
                
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)