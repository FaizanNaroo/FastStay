from rest_framework import serializers

class Display_Student_serializer(serializers.Serializer):
    p_StudentId = serializers.IntegerField()
    