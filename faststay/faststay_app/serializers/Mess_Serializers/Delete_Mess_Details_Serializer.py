from rest_framework import serializers

class Delete_Mess_Details_serializer(serializers.Serializer):
    p_MessId = serializers.IntegerField()
