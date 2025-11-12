from rest_framework import serializers


class Student_Details_Serializer(serializers.Serializer):
    UserId = serializers.IntegerField()
    Semester = serializers.IntegerField()
    Department = serializers.CharField(max_length=100)
    Batch = serializers.IntegerField()
    RoomateCount = serializers.IntegerField()
    UniDistance = serializers.DecimalField(max_digits=5, decimal_places=2)
    isAcRoom = serializers.BooleanField()
    isMess = serializers.BooleanField()
    BedType = serializers.ChoiceField(choices=['Bed','Mattress','Anyone'])
    WashroomType = serializers.ChoiceField(choices=['RoomAttached','Community'])

    