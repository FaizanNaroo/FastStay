from rest_framework import serializers

class Delete_Mess_Details_Serializer(serializers.Serializer):
    p_MessId = serializers.IntegerField()
