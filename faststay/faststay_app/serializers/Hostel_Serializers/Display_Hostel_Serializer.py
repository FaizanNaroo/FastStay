from rest_framework import serializers

class Display_Hostel_serializer(serializers.Serializer):
    p_HostelId = serializers.IntegerField()
    