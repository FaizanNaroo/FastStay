from rest_framework import serializers

class Display_Manager_serializer(serializers.Serializer):
    p_ManagerId = serializers.IntegerField()
    