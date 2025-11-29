from rest_framework import serializers
    
class Display_Expenses_serializer(serializers.Serializer):
    p_HostelId = serializers.IntegerField()