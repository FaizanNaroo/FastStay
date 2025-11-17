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

Alter table Users
Alter column UserType Type varchar(50);

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

Alter table hostelmanager
Alter column PhoneNo Type char(11);

Create Table Hostel(
  HostelId Serial Primary Key,
  ManagerId int references HostelManager(ManagerId) On delete cascade On update cascade,
  BlockNo int,           -- Changed to varchar(100)
  HouseNo int,           -- Changed to varchar(100)
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

Alter table hostel
Alter column BlockNo Type varchar(100);

Alter table hostel
Alter column HouseNo Type varchar(100);

Create Table HostelPics(
  PicId Serial,
  HostelId int references Hostel(HostelId) On delete cascade On update cascade,
  Primary Key(HostelId, PicId),
  PhotoLink Text
);

-- If Manager is uploading hostel pic then consider RoomSeaterNo: -1 ,
-- else Manager will provide RoomSeaterNo while uploading RoomPic
-- The boolean tells whether hostel pics or room pics
Alter Table HostelPics
Add Column isHostelPic boolean,
Add Column RoomSeaterNo int Default -1;

Create Table MessDetails(
  MessId int Primary Key references Hostel(HostelId) On delete cascade On update cascade,
  MessMeals int CHECK(MessMeals>=1 AND MessMeals<=3)
);

Alter table MessDetails
Add column Dishes text[];

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

GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Procedures for Insertion and Deletion and no return data
-- Functions in case need to return something

-- 1, User Signup i.e. Creating an acount
Create or Replace function Signup(
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
  if exists(Select 1 from LoginInfo L where L.Email = Signup.email) then
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

--Select * from signin('Admin','Arham','Zeeshan',20,'Male','Sialkot','arhamzeeshan617@gmail.com','Playstation0896');
Select * from signup('Admin','Fezan','Shamshad',20,'Male','Sialkot','fezan617@gmail.com','Playstation0896');
Select * from Users;

--2, Print All the Users
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

  UPDATE studentdemographics
  SET
    semester      = COALESCE(p_semester, semester),
    department    = COALESCE(p_department, department),
    batch         = COALESCE(p_batch, batch),
    roomatecount  = COALESCE(p_roomatecount, roomatecount),
    unidistance   = COALESCE(p_unidistance, unidistance),
    isacroom      = COALESCE(p_isacroom, isacroom),
    ismess        = COALESCE(p_ismess, ismess),
    bedtype       = COALESCE(p_bedtype, bedtype),
    washroomtype  = COALESCE(p_washroomtype, washroomtype)
  WHERE studentid = p_studentid;

  return true;
End;
$$ LANGUAGE plpgsql;

Select * from updatestudentdetails(1,5,'CS','2023',3,16.5,true,false,'Bed','RoomAttached');
Select * from updatestudentdetails(1,NULL,NULL,NULL,NULL,16.5,NULL,NULL,'Mattress',NULL);
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
  p_PhoneNo char(11),
  p_Education varchar(50),
  p_ManagerType varchar(50),
  p_OperatingHours int
) Returns boolean as $$
Begin
  if not exists(Select 1 from Users where UserId = p_UserId) then
    return false;
  End if;

  -- This check ensures that student cannot create another Manager Acount
  if exists(Select 1 from StudentDemographics where StudentId = p_UserId) then
    return false;
  End if;

  if p_ManagerType in ('Owner','Employee') and (p_OperatingHours>=1 AND p_OperatingHours<=24) then
    Insert into HostelManager
    values(p_UserId, p_PhotoLink, p_PhoneNo, p_Education, p_ManagerType, p_OperatingHours);
    return true;
  End if;

  return false;
End;
$$ LANGUAGE plpgsql;

Select * from AddManagerDetails(2,'someurl','03324434300','BS CS','Owner',8);

--8, Update HostelManager Details
Create or Replace function UpdateManagerDetails(
  p_ManagerId int,
  p_PhotoLink Text,
  p_PhoneNo char(11),
  p_Education varchar(50),
  p_ManagerType varchar(50),
  p_OperatingHours int
) Returns boolean as $$
Begin
  if not exists(Select 1 from HostelManager where managerid = p_ManagerId) then
    return false;
  End if;

  if p_ManagerType in ('Owner','Employee') and (p_OperatingHours>=1 AND p_OperatingHours<=24) then
    Update HostelManager
    set photolink = COALESCE(p_PhotoLink, photolink),
        phoneno = COALESCE(p_PhoneNo, phoneno),
        education = COALESCE(p_Education, education),
        managertype = COALESCE(p_ManagerType, managertype),
        operatinghours = COALESCE(p_OperatingHours, operatinghours)
    where managerid = p_ManagerId;
    return true;
  End if;

  return false;
End;
$$ LANGUAGE plpgsql;

Select * from UpdateManagerDetails(2,'someurl','03324434300','BS CS','Owner',7);
Select * from hostelmanager;

--9, Delete HostelManager (Used by SuperAdmin)
Create or Replace function DeleteHostelManager(
  p_ManagerId int
) Returns boolean as $$
Begin
  if not exists(Select 1 from hostelmanager where managerid = p_ManagerId) then
    return false;
  End if;

  Delete from hostelmanager
  where managerid = p_ManagerId;

  return true;
End;
$$ LANGUAGE plpgsql;

Select * from DeleteHostelManager(1);

--10, Add Hostel Details (Hostel Manager can add his hostel details)
Create or Replace function AddHostelDetails(
  p_ManagerId int,
  p_BlockNo varchar(100),
  p_HouseNo varchar(100),
  p_HostelType varchar(50),
  p_isParking boolean,
  p_NumRooms int,
  p_NumFloors int,
  p_WaterTimings Time,
  p_CleanlinessTenure int,       -- In Days
  p_IssueResolvingTenure int,    -- In Days
  p_MessProvide boolean,
  p_GeezerFlag boolean
) Returns int as $$
Begin
  if not exists(Select 1 from HostelManager where Managerid = p_ManagerId) then
    return 0;           -- Error: Manager with this id does not exists
  End if;

  if exists(Select 1 from hostel where blockno = p_BlockNo and houseno = p_HouseNo) then
    return -1;          -- Error: Hostel with this BlockNo and HouseNo already exists
  End if;

  if p_HostelType in ('Portion','Building') then
    Insert into Hostel(managerid, blockno, houseno, hosteltype, isparking, numrooms, numfloors, watertimings, cleanlinesstenure, issueresolvingtenure, messprovide, geezerflag)
    values(p_ManagerId, p_BlockNo, p_HouseNo, p_HostelType, p_isParking, p_NumRooms, p_NumFloors, p_WaterTimings,       p_CleanlinessTenure, p_IssueResolvingTenure, p_MessProvide, p_GeezerFlag);
    return 1;           -- Hostel Added Successfully
  End if;

  return -2;            -- Error: Invalid Hostel Type
End;
$$ LANGUAGE plpgsql;

Select * from addhosteldetails(9, 'Block A', 'House no 11', 'Portion', true, 6, 2, '11:30', 7, 7, true, true);
Select * from hostel;

--11, Update Hostel Details (Hostel Manager can update his hostel details)
Create or Replace function UpdateHostelDetails(
  p_HostelId int,
  p_BlockNo varchar(100),
  p_HouseNo varchar(100),
  p_HostelType varchar(50),
  p_isParking boolean,
  p_NumRooms int,
  p_NumFloors int,
  p_WaterTimings Time,
  p_CleanlinessTenure int,      -- In Days
  p_IssueResolvingTenure int,   -- In Days
  p_MessProvide boolean,
  p_GeezerFlag boolean
) Returns boolean as $$
Begin
  if not exists(Select 1 from hostel where hostelid = p_HostelId) then
    return false;
  End if;

  if p_HostelType in ('Portion','Building') then
    Update Hostel
    set blockno = COALESCE(p_BlockNo, blockno),
        houseno = COALESCE(p_HouseNo, houseno),
        hosteltype = COALESCE(p_HostelType, hosteltype),
        isparking = COALESCE(p_isParking, isparking),
        numrooms = COALESCE(p_NumRooms, numrooms),
        numfloors = COALESCE(p_NumFloors, numfloors),
        watertimings = COALESCE(p_WaterTimings, watertimings),
        cleanlinesstenure = COALESCE(p_CleanlinessTenure, cleanlinesstenure),
        issueresolvingtenure = COALESCE(p_IssueResolvingTenure, issueresolvingtenure),
        messprovide = COALESCE(p_MessProvide, messprovide),
        geezerflag =  COALESCE(p_GeezerFlag, geezerflag)
    where hostelid = p_HostelId;
    return true;
  End if;

  return false;
End;
$$ LANGUAGE plpgsql;

--12, Delete Hostel Details (Hostel Manager can delete his hostel)
Create or Replace function DeleteHostelDetails(
  p_HostelId int
) Returns boolean as $$
Begin
  if not exists(Select 1 from hostel where hostelid = p_HostelId) then
    return false;
  End if;

  Delete from hostel
  where hostelid = p_HostelId;

  return true;
End;
$$ LANGUAGE plpgsql;

--13, Add Hostel Pictures (Note: Not room pictures just hostel pictures)
Create or Replace function AddHostelPics(
  p_HostelId int,
  p_PhotoLink text
) Returns boolean as $$
Declare
  p_isHostelPic boolean;
Begin
  if not exists(Select 1 from hostel where hostelid = p_HostelId) then
    return false;
  End if;

  p_isHostelPic := true;
  Insert into HostelPics(hostelid, photolink, ishostelpic)
  values(p_HostelId, p_PhotoLink, p_isHostelPic);

  return true;
End;
$$ LANGUAGE plpgsql;

--14, Add Room Pictures (Manager can specify room seaterno and add its pictures)
Create or Replace function AddRoomPics(
  p_HostelId int,
  p_PhotoLink text,
  p_RoomSeaterNo int        --Range from 1 to 6
) Returns boolean as $$
Declare
  p_isHostelPic boolean;
Begin
  if not exists(Select 1 from hostel where hostelid = p_HostelId) then
    return false;
  End if;

  p_isHostelPic := false;
  Insert into HostelPics(hostelid, photolink, ishostelpic, roomseaterno)
  values(p_HostelId, p_PhotoLink, p_isHostelPic, p_RoomSeaterNo);

  return true;
End;
$$ LANGUAGE plpgsql;

--15, Delete Hostel Picture (Manager can Delete hostel pictures)
Create or Replace function DeleteHostelPic(
  p_PicId int
) Returns boolean as $$
Begin
  if not exists(Select 1 from hostelpics where picid = p_PicId) then
    return false;
  End if;

  Delete from hostelpics
  where picid = p_PicId;

  return true;
End;
$$ LANGUAGE plpgsql;

--16, Add Mess Details (Hostel Manager can add mess details)
Create or Replace function AddMessDetails(
  p_HostelId int,
  p_MessTimeCount int,        -- Range (1 to 3)
  p_Dishes text[]             -- Input Array of strings
) Returns int as $$
Declare
  isMessProvide boolean;
Begin
  if not exists(Select 1 from hostel where hostelid = p_HostelId) then
    return -1;    -- Error: Hostel Does not exists
  End if;

  Select messprovide into isMessProvide from Hostel
  where hostelid = p_HostelId;

  if not isMessProvide then
    return 0;     -- Error: Hostel does not provide Mess
  End if;

  if p_MessTimeCount>=1 and p_MessTimeCount<=3 then
    Insert into MessDetails(messid, messmeals, dishes)
    values(p_HostelId, p_MessTimeCount, p_Dishes);
    return 1;     -- Mess Details Added Successfuly
  End if;

  return -2;      -- Error: Mess Meal Count Ranges from( 1 to 3)
End;
$$ LANGUAGE plpgsql;

--17, Update Mess Details (Manager can Update Mess Details)
Create or Replace function UpdateMessDetails(
  p_MessId int,
  p_MessTimeCount int,        -- Range (1 to 3)
  p_Dishes text[]             -- Input Array of strings
) Returns int as $$
Begin
  if not exists(Select 1 from messdetails where messid = p_MessId) then
    return -1;    -- Error: Mess Info Does not exists
  End if;

  if p_MessTimeCount>=1 and p_MessTimeCount<=3 then
    Update MessDetails
    set messmeals = COALESCE(p_MessTimeCount, messmeals),
        dishes = COALESCE(p_Dishes, messmeals)
    where messid = p_MessId;
    return 1;     -- Mess Details Updated Successfuly
  End if;

  return 0;      -- Error: Mess Meal Count Ranges from( 1 to 3)
End;
$$ LANGUAGE plpgsql;

--18, Add new Dish to Hostel Mess (Manager can Update his mess to add a dish)
Create or Replace function AddNewDish(
  p_MessId int,
  p_Dish text
) Returns boolean as $$
Begin
  if not exists(Select 1 from messdetails where messid = p_MessId) then
    return false;
  End if;

  Update messdetails
  set dishes = array_append(dishes, p_Dish)
  where messid = p_MessId;

  return true;
End;
$$ LANGUAGE plpgsql;

--19, Delete Hostel Mess Details (Manager can delete mess details)
Create or Replace function DeleteMessDetails(
  p_MessId int
) Returns boolean as $$
Begin
  if not exists(Select 1 from messdetails where messid = p_MessId) then
    return false;
  End if;

  Delete from messdetails
  where messid = p_MessId;

  return true;
End;
$$ LANGUAGE plpgsql;

--20, Add Hostel Kitchen Details (Hostel Manager can add Kitchen Details)
Create or Replace function AddKitchenDetails(
  p_HostelId int,
  p_isFridge boolean,
  p_isMicrowave boolean,
  p_isGas boolean
) Returns boolean as $$
Begin
  if not exists(Select 1 from hostel where hostelid = p_HostelId) then
    return false;
  End if;

  Insert into kitchendetails(kitchenid, isfridge, ismicrowave, isgas)
  values(p_HostelId, p_isFridge, p_isMicrowave, p_isGas);

  return true;
End;
$$ LANGUAGE plpgsql;

--21, Update Kitchen Details (Hostel Manager can update Kitchen Details)
Create or Replace function UpdateKitchenDetails(
  p_KitchenId int,
  p_isFridge boolean,
  p_isMicrowave boolean,
  p_isGas boolean
) Returns boolean as $$
Begin
  if not exists(Select 1 from kitchendetails where kitchenid = p_KitchenId) then
    return false;
  End if;

  Update kitchendetails
  set isfridge = COALESCE(p_isFridge, isfridge),
      ismicrowave = COALESCE(p_isMicrowave, ismicrowave),
      isgas = COALESCE(p_isGas, ismicrowave)
  where kitchenid = p_KitchenId;

  return true;
End;
$$ LANGUAGE plpgsql;

--22, Delete Kitchen Details
Create or Replace function DeleteKitchenDetails(
  p_KitchenId int
) Returns boolean as $$
Begin
  if not exists(Select 1 from kitchendetails where kitchenid = p_KitchenId) then
    return false;
  End if;

  Delete from kitchendetails
  where kitchenid = p_KitchenId;

  return true;
End;
$$ LANGUAGE plpgsql;

--23, Add Room into hostel (Manager Can add RoomInfo in hostel)