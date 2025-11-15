from rest_framework import serializers

class Delete_Hostel_Manager_Serializer(serializers.Serializer):
    p_ManagerId = serializers.IntegerField()
