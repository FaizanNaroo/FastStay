from rest_framework import serializers


class Update_StudentDetails_serializer(serializers.Serializer):
    p_StudentId = serializers.IntegerField()
    p_Semester = serializers.IntegerField()
    p_Department = serializers.CharField(max_length=100)
    p_Batch = serializers.IntegerField()
    p_RoomateCount = serializers.IntegerField()
    p_UniDistance = serializers.DecimalField(max_digits=5, decimal_places=2)
    p_isAcRoom = serializers.BooleanField()
    p_isMess = serializers.BooleanField()
    p_BedType = serializers.ChoiceField(choices=['Bed','Mattress','Anyone'])
    p_WashroomType = serializers.ChoiceField(choices=['RoomAttached','Community'])

    