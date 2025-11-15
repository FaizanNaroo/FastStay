from rest_framework import serializers

class Add_App_Suggestions_serializer(serializers.Serializer):
    p_UserId = serializers.IntegerField()
    p_Improvements = serializers.CharField(max_length=1024)
    p_Defects = serializers.CharField(max_length = 1024)
    