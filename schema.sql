Create Table LoginInfo(
  LoginId Serial Primary Key,
  Email varchar(100),
  Password varchar(50)
);

Create Table Users(
  UserId Serial Primary Key,
  LoginId int references LoginInfo(LoginId) On delete cascade On update cascade,
  UserType varchar(10) Check(UserType in ('Student','Hostel Manager','Admin')),
  Fname varchar(50),
  Lname varchar(50),
  Age int Check(Age>0 AND Age<100),
  Gender varchar(10) Check(Gender in ('Male','Female','Other')),
  City varchar(100)
);

Create Table StudentDemoGraphics(
  StudentId int Primary Key references Users(UserId) On delete cascade On update cascade,
  Semester int CHECK(Semester>=1 AND Semester<=8),
  Department Text,
  Batch int,
  RoomateCount int CHECK(RoomateCount>=1 AND RoomateCount<=6),
  UniDistance float,
  isAcRoom boolean,
  isMess boolean,
  BedType varchar(50) CHECK(BedType in ('Bed','Mattress','Anyone')),
  WashroomType varchar(50) CHECK(WashroomType in ('RoomAttached','Community'))
);

Create Table AppSuggestions(
  SuggestionId Serial,
  UserId int references Users(UserId) On delete cascade On update cascade,
  Primary Key(UserId, SuggestionId),
  Improvements Text,
  Defects Text
);

Create Table HostelManager(
  ManagerId int Primary Key references Users(UserId) On delete cascade On update cascade,
  PhotoLink Text,
  PhoneNo int,
  Education varchar(50),
  ManagerType varchar(50) CHECK(ManagerType in ('Owner','Employee')),
  OperatingHours int CHECK(OperatingHours>=1 AND OperatingHours<=24)
);

Create Table Hostel(
  HostelId Serial Primary Key,
  ManagerId int references HostelManager(ManagerId) On delete cascade On update cascade,
  BlockNo int,
  HouseNo int,
  HostelType varchar(50) CHECK(HostelType in ('Portion','Building')),
  isParking boolean,
  NumRooms int,
  NumFloors int,
  WaterTimings Time,
  CleanlinessTenure int,
  IssueResolvingTenure int,
  MessProvide boolean,
  GeezerFlag boolean
);

Create Table HostelPics(
  PicId Serial,
  HostelId int references Hostel(HostelId) On delete cascade On update cascade,
  Primary Key(HostelId, PicId),
  PhotoLink Text
);

-- If Manager is uploading hostel pic then consider RoomSeaterNo: -1 ,
-- else Manager will provide RoomSeaterNo while uploading RoomPic
Alter Table HostelPics
Add Column isHostelPic boolean,
Add Column RoomSeaterNo int Default -1;

Create Table MessDetails(
  MessId int Primary Key references Hostel(HostelId) On delete cascade On update cascade,
  MessMeals int CHECK(MessMeals>=1 AND MessMeals<=3),
  Dishes Text
);

Create Table KitchenDetails(
  KitchenId int Primary Key references Hostel(HostelId) On delete cascade On update cascade,
  isFridge boolean,
  isMicrowave boolean,
  isGas boolean
);

Create Table RoomInfo(
  RoomId int,
  HostelId int references Hostel(HostelId) On delete cascade On update cascade,
  Primary Key(HostelId, RoomId),
  FloorNo int,
  SeaterNo int,
  BedType varchar(20) CHECK(BedType in ('Bed','Mattress')),
  WashroomType varchar(20) CHECK(WashroomType in ('RoomAttached','Community')),
  CupboardType varchar(20) CHECK(CupboardType in ('PerPerson','Shared')),
  isVentilated boolean,
  isCarpet boolean,
  isMiniFridge boolean
);

Alter Table RoomInfo
Add Column RoomRent float;

Create Table SecurityInfo(
  SecurityId int Primary Key references Hostel(HostelId) On delete cascade On update cascade,
  GateTimings Time,
  isCameras boolean,
  isGuard boolean,
  isOutsiderVerification boolean
);

-- If Manager selects Expenses included in room rent, then just show room and security charges
-- and other are by default 0, else other are inputted by manager and are displayed also
Create Table Expenses(
  ExpenseId int Primary Key references Hostel(HostelId) On delete cascade On update cascade,
  isIncludedInRoomCharges boolean,
  RoomCharges float[],               --include the charges based on RoomSeaterNo 
  SecurityCharges float,
  MessCharges float Default 0,
  KitchenCharges float Default 0,
  InternetCharges float Default 0,
  AcServiceCharges float Default 0,
  ElectricitybillType Text CHECK(ElectricitybillType in ('FixedCharges','PerMonth')),
  ElectricityCharges float Default 0
);

Create Table HostelRating(
  RatingId Serial,
  HostelId int references Hostel(HostelId) On delete cascade On update cascade,
  StudentId int references StudentDemoGraphics(StudentId) On delete cascade On update cascade,
  Primary Key(HostelId, StudentId, RatingId),
  RatingStar int CHECK(RatingStar>=1 AND RatingStar<=5),
  MaintenanceRating int Check(MaintenanceRating>=1 AND MaintenanceRating<=5),
  IssueResolvingRate float,
  ManagerBehaviour int Check(ManagerBehaviour>=1 AND ManagerBehaviour<=5),
  Challenges Text
);

Select * from LoginInfo;
Select * from Users;
Select * from studentdemographics;
Select * from appsuggestions;
Select * from hostelmanager;
Select * from hostel;
Select * from hostelpics;
Select * from messdetails;
Select * from kitchendetails;
Select * from roominfo;
Select * from securityinfo;
Select * from expenses;
Select * from hostelrating;

-- Procedures for Insertion and Deletion and no return data
-- Functions in case need to return something

-- 1, User Sigin i.e. Creating an acount
Create or Replace function Signin(
  UserType varchar(10),
  Fname varchar(50),
  Lname varchar(50),
  Age int,
  Gender varchar(10),
  City varchar(100),
  email varchar(100),
  password varchar(50)
) Returns int as $$
Declare
  p_loginId int;
  p_userId int;
Begin
  if exists(Select 1 from LoginInfo L where L.Email = Signin.email) then
    return 0;     -- Acount with this email already exists
  End if;

  Insert into LoginInfo(Email, Password)
  values(email, password)
  Returning loginid into p_loginId;

  if Gender in ('Male','Female','Other') AND UserType in ('Student','Hostel Manager','Admin') then
    Insert into Users(loginid, usertype, fname, lname, age, gender, city)
    values(p_loginId, UserType, Fname, Lname, Age, Gender, City)
    Returning UserId into p_userId;
    Return p_userId;
  else
    Return -1;       --Invalid Credentials
  End if;
End;
$$ LANGUAGE plpgsql;

Select * from signin('Admin','Arham','Zeeshan',20,'Male','Sialkot','arhamzeeshan617@gmail.com','Playstation0896');
Select * from Users;
Select * from LoginInfo;

--2, Get All the Users
Create or Replace function GetAllUsers()
Returns Table(
  UserId int,
  LoginId int,
  UserType varchar(10),
  Fname varchar(50),
  Lname varchar(50),
  Age int,
  Gender varchar(10),
  City varchar(100)
) As $$
Begin
  Return Query
  Select * from Users;
End;
$$ LANGUAGE plpgsql;

Select * from getallusers();

--3, User Login i.e. Login with Existing Acount
Create or Replace function Login(
  email varchar(100),
  password varchar(50)
) Returns boolean as $$
Begin
  if exists(Select 1 from LoginInfo L where L.Email = Login.email AND L.Password = Login.password) then
    Return true;
  End if;

  Return false;       -- Invalid Email or Password
End;
$$ LANGUAGE plpgsql;

Select * from Login('arhamzeeshan617@gmail.com','Playstation0896');

--4 Enter Student DemoGraphics
Create or Replace function EnterStudentDetails(
  UserId int,
  Semester int,
  Department Text,
  Batch int,
  RoomateCount int,
  UniDistance float,
  isAcRoom boolean,
  isMess boolean,
  BedType varchar(50),
  WashroomType varchar(50)
) Returns boolean as $$
Begin
  if not exists(Select 1 from Users U where U.UserId = EnterStudentDetails.UserId) then
    Return false;
  End if;

  if (Semester>=1 AND Semester<=8) AND (RoomateCount>=1 AND RoomateCount<=6)
     AND BedType in ('Bed','Mattress','Anyone') AND WashroomType in ('RoomAttached','Community') then

    Insert into studentdemographics
    values(UserId, Semester, Department, Batch, RoomateCount, UniDistance, isAcRoom, isMess, BedType, WashroomType);

    Return true;
  End if;

  Return false;
End;
$$ LANGUAGE plpgsql;

Select * from enterstudentdetails(1,5,'CS','2023',3,20.5,true,false,'Bed','RoomAttached');
Select * from studentdemographics;

-- 5, Update Student DemoGraphics
Create or Replace function UpdateStudentDetails(
  p_StudentId int,
  p_Semester int,
  p_Department Text,
  p_Batch int,
  p_RoomateCount int,
  p_UniDistance float,
  p_isAcRoom boolean,
  p_isMess boolean,
  p_BedType varchar(50),
  p_WashroomType varchar(50)
) Returns boolean as $$
Begin
  if not exists(Select 1 from StudentDemoGraphics where StudentId = p_StudentId) then
    return false;
  End if;

  Update studentdemographics
  set semester = p_Semester,
      department = p_Department,
      batch = p_Batch,
      roomatecount = p_RoomateCount,
      unidistance = p_UniDistance,
      isacroom = p_isAcRoom,
      ismess = p_isMess,
      bedtype = p_BedType,
      washroomtype = p_WashroomType
  where studentid = p_StudentId;

  return true;
End;
$$ LANGUAGE plpgsql;

Select * from updatestudentdetails(1,5,'CS','2023',3,15.5,true,false,'Bed','RoomAttached');
Select * from studentdemographics;

-- 6, Enter App Suggestions by User(Student/Manager)
Create or Replace function AddAppSuggestion(
  p_UserId int,
  p_Improvements Text,
  p_Defects Text
) Returns boolean as $$
Begin
  if not exists(Select 1 from Users where UserId = p_UserId) then
    return false;
  End if;

  Insert into AppSuggestions(UserId, Improvements, Defects)
  values(p_UserId, p_Improvements, p_Defects);

  return true;
End;
$$ LANGUAGE plpgsql;

Select * from AddAppSuggestion(1,'More Mess Details','UX broken to some extent');
Select * from appsuggestions;

--7, Add Hostel Manager Details
Create or Replace function AddManagerDetails(
  p_UserId int,
  p_PhotoLink Text,
  p_PhoneNo int,
  p_Education varchar(50),
  p_ManagerType varchar(50),
  p_OperatingHours int
) Returns boolean as $$
Begin
  if not exists(Select 1 from Users where UserId = p_UserId) then
    return false;
  End if;

  if exists(Select 1 from StudentDemographics where StudentId = p_UserId) then
    return true;
  End if;

  if p_ManagerType in ('Owner','Employee') and (p_OperatingHours>=1 AND p_OperatingHours<=24) then
    Insert into HostelManager
    values(p_UserId, p_PhotoLink, p_PhoneNo, p_Education, p_ManagerType, p_OperatingHours);
    return true;
  End if;

  return false;
End;
$$ LANGUAGE plpgsql;

Select * from addmanagerdetails(1,'someurtl',923324434300,'BS CS','Owner',8);