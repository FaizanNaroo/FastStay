# Stored Procedures Documentation

## Common Workflow for All Stored Procedures

All stored procedures in this project follow a standard integration workflow:

1. **Frontend Request**  
   - The frontend sends a POST/PUT request to a Django REST Framework API endpoint.
   - JSON body contains the required fields for the operation.

2. **Serializer Validation**  
   - DRF serializer validates the incoming JSON.
   - Ensures all required fields are present and meet type/format constraints.
   - Example validations:
     - Integer fields must be positive (`>0`)
     - Strings have max length
     - Booleans are True/False
     - Time/Date fields follow proper format

3. **Service Layer / Business Logic**  
   - The validated data is passed to a service function (e.g., `save_hostel_details`).
   - The service function decides which stored procedure to call.
   - Handles any conversion or minor business logic.

4. **Database Interaction**  
   - Service function calls the stored procedure using PostgreSQL.
   - Returns a boolean or result indicating success/failure.
   - Handles cases where foreign keys or constraints might fail.

5. **API Response**  
   - The view returns a JSON response:
     - `message` (str): description of the operation outcome
     - `result` (bool): True if successful, False otherwise
     - This is the General Return. Some Resonses are specialized 
   - Appropriate HTTP status codes:
     - 201 Created for success
     - 400 Bad Request for validation failures
     - 404 Not Found if required foreign key does not exist


## Specialized Documentation for Stored Procedures

## 1. Signup - Create User Account

**Description:**  
Registers a new user account (Student or Hostel Manager).

**Input Parameters:**

| Parameter  | Type         | Required | Description |
|------------|--------------|----------|-------------|
| UserType   | varchar(10)  | Yes      | Student or HostelManager |
| Fname      | varchar(50)  | Yes      | First name |
| Lname      | varchar(50)  | Yes      | Last name |
| Age        | int          | Yes      | Must be >= 1 |
| Gender     | varchar(10)  | Yes      | Gender of user |
| City       | varchar(100) | Yes      | City of residence |
| email      | varchar(100) | Yes      | Must be unique |
| password   | varchar(50)  | Yes      | Raw password (hash in service) |

**Return Type:**  
- boolean: True if successfully registered, False otherwise

**Usage Notes:**  
- Validates uniqueness of email.
- Calls `Signup` stored procedure.
- API response: 201 for success, 400 for invalid input.

---

### 4. EnterStudentDetails - Enter Student Demographics

**Description:**  
Registers the demographic details of a student.

**Input Parameters:**

| Parameter      | Type        | Required | Description |
|----------------|------------|----------|-------------|
| UserId         | int        | Yes      | Must exist in Users table |
| Semester       | int        | Yes      | Must be between 1 and 8 |
| Department     | text       | No       | Student's department |
| Batch          | int        | No       | Student's batch |
| RoomateCount   | int        | Yes      | Must be between 1 and 6 |
| UniDistance    | float      | No       | Distance from university in km |
| isAcRoom       | boolean    | No       | Whether AC room is provided |
| isMess         | boolean    | No       | Whether mess is provided |
| BedType        | varchar(50)| Yes      | Must be 'Bed', 'Mattress', or 'Anyone' |
| WashroomType   | varchar(50)| Yes      | Must be 'RoomAttached' or 'Community' |

**Return Type:**  
- boolean: True if stored successfully, False otherwise

**Usage Notes:**  
- Validates that `UserId` exists in the `Users` table.  
- Ensures `Semester` and `RoomateCount` are within valid ranges.  
- Ensures `BedType` and `WashroomType` are valid values.  
- Inserts data into the `StudentDemographics` table.  
- Call this procedure from the service layer.  
- API response should follow the standard workflow:  
  - 201 Created for success  
  - 400 Bad Request for invalid input  
  - JSON: `{"message": "...", "result": True/False}`

---

### 5. UpdateStudentDetails - Update Student Demographics

**Description:**  
Updates the demographic details of an existing student.

**Input Parameters:** Same as `EnterStudentDetails`.

**Return Type:**  
- boolean: True if updated successfully, False otherwise

**Usage Notes:**  
- Validates that `p_StudentId` exists in `StudentDemographics` table.  
- Ensures `Semester` and `RoomateCount` are within valid ranges.  
- Ensures `BedType` and `WashroomType` are valid values.  
- Updates the student record in `StudentDemographics`.  
- Call this procedure from the service layer.  
- API response should follow the standard workflow:  
  - 201 Created for success  
  - 400 Bad Request for invalid input  
  - JSON: `{"message": "...", "result": True/False}`

---

### 6. AddAppSuggestion - Enter App Suggestions by User (Student/Manager)

**Description:**  
Registers a new app suggestion from a user (student or manager).

**Input Parameters:**

| Parameter      | Type   | Required | Description |
|----------------|--------|----------|-------------|
| p_UserId       | int    | Yes      | Must exist in Users table |
| p_Improvements | text   | No       | Description of suggested improvements |
| p_Defects      | text   | No       | Description of defects/issues faced |

**Return Type:**  
- boolean: True if stored successfully, False otherwise

**Usage Notes:**
- Validates `p_UserId` exists in the database.
- Inserts the suggestion into `AppSuggestions` table.
- Call this procedure from the service layer.
- API response should follow the standard workflow:
  - 201 Created for success
  - 400 Bad Request for invalid input
  - JSON: `{"message": "...", "result": True/False}`

---

### 7. AddManagerDetails - Add New Hostel Manager

**Description:**  
Registers a new hostel manager for a user.

**Input Parameters:**

| Parameter        | Type         | Required | Description |
|-----------------|--------------|----------|-------------|
| p_UserId        | int          | Yes      | Must exist in `Users` table |
| p_PhotoLink     | text         | No       | URL or path to the manager's photo |
| p_PhoneNo       | char(11)     | Yes      | 11-digit phone number |
| p_Education     | varchar(50)  | No       | Manager's education details |
| p_ManagerType   | varchar(50)  | Yes      | 'Owner' or 'Employee' |
| p_OperatingHours| int          | Yes      | Operating hours per day (1–24) |

**Return Type:**  
- boolean: True if stored successfully, False otherwise

**Usage Notes:**  
- Validates `p_UserId` exists and is not already a student.
- Validates `p_ManagerType` and `p_OperatingHours`.
- Calls `AddManagerDetails`.
- Returns 201 Created on success, 400 Bad Request on invalid input or constraints violation.

---

### 8. UpdateManagerDetails - Update Hostel Manager Details

**Description:**  
Registers a new hostel manager for a user.

**Input Parameters:** Same as `AddManagerDetails`

**Return Type:**  
- boolean: True if stored successfully, False otherwise

**Usage Notes:**  
- Validates `p_UserId` exists and is not already a student.
- Validates `p_ManagerType` and `p_OperatingHours`.
- Calls `AddManagerDetails`.
- Returns 201 Created on success, 400 Bad Request on invalid input or constraints violation.

---

### 9. DeleteHostelManager - Remove Hostel Manager (SuperAdmin Only)

**Description:**  
Deletes an existing hostel manager from the system.

**Input Parameters:**

| Parameter    | Type | Required | Description |
|-------------|------|----------|-------------|
| p_ManagerId | int  | Yes      | Must exist in `HostelManager` table |

**Return Type:**  
- boolean: True if deleted successfully, False otherwise

**Usage Notes:**  
- Validates that `p_ManagerId` exists.
- Calls `DeleteHostelManager`.
- Returns 201 Created on success, 400 Bad Request if manager does not exist.
- Intended for SuperAdmin use only.

---

## 10. AddHostelDetails - Add New Hostel

**Description:**  
Adds new hostel details for a manager.

**Input Parameters:**

| Parameter                  | Type         | Required | Description |
|-----------------------------|--------------|----------|-------------|
| p_ManagerId                | int           | Yes      | Must exist in `HostelManager` table |
| p_BlockNo                   | varchar(100) | Yes      | Block number |
| p_HouseNo                   | varchar(100) | Yes      | House number |
| p_HostelType                | varchar(50)  | Yes      | 'Portion' or 'Building' |
| p_isParking                 | boolean      | Yes      | Parking availability |
| p_NumRooms                  | int          | Yes      | >= 1 |
| p_NumFloors                 | int          | Yes      | >= 1 |
| p_WaterTimings              | Time         | Yes      | Water availability timing |
| p_CleanlinessTenure         | int          | Yes      | In days, >= 1 |
| p_IssueResolvingTenure      | int          | Yes      | In days, >= 1 |
| p_MessProvide               | boolean      | Yes      | Mess service availability |
| p_GeezerFlag                | boolean      | Yes      | Geyser availability |

**Return Type:**  
- boolean: True if stored successfully, False otherwise

**Usage Notes:**  
- Validates `p_ManagerId` exists.
- Calls `AddHostelDetails`.
- Returns 201 Created on success, 400 Bad Request on error.

---

## 11. UpdateHostelDetails - Update Existing Hostel

**Description:**  
Updates hostel details for a manager.

**Input Parameters:** Same as `AddHostelDetails`.

**Return Type:**  
- boolean: True if updated successfully, False otherwise

**Usage Notes:**  
- Validates `p_ManagerId` exists.
- Calls `UpdateHostelDetails`.
- Returns 201 Created on success, 400 Bad Request on error.

---

## 16. AddMessDetails - Add Mess Details for a Hostel

**Description:**  
Adds mess-related details for a hostel, including the number of meal timings and the dishes offered.

**Input Parameters:**

| Parameter          | Type    | Required | Description |
|--------------------|---------|----------|-------------|
| p_HostelId         | int     | Yes      | Must exist in the `Hostel` table |
| p_MessTimeCount    | int     | Yes      | Meal count (1–3) |
| p_Dishes           | text[]  | Yes      | Array of dish names |

**Return Type:**  
- **int** (Return Code):
  - **1** → Mess details added successfully  
  - **0** → Error: Hostel does not provide mess  
  - **-1** → Error: Hostel does not exist  
  - **-2** → Error: Meal count must be between 1 and 3  

**Usage Notes:**  
- Validates `p_HostelId` exists in the `Hostel` table.  
- Checks if hostel provides mess (`messprovide = true`).  
- Inserts into `MessDetails` when all validations pass.  
- Returns appropriate error codes based on validation failures.

---

## 17. UpdateMessDetails - Update Mess Details for a Hostel

**Description:**  
Updates existing mess details for a hostel, including meal count and list of dishes.

**Input Parameters:**

| Parameter          | Type    | Required | Description |
|--------------------|---------|----------|-------------|
| p_MessId           | int     | Yes      | Must exist in the `MessDetails` table |
| p_MessTimeCount    | int     | Yes      | Meal count (1–3) |
| p_Dishes           | text[]  | Yes      | Array of dish names |

**Return Type:**  
- **int** (Return Code):
  - **1** → Mess details updated successfully  
  - **0** → Error: Meal count must be between 1 and 3  
  - **-1** → Error: Mess details do not exist  

**Usage Notes:**  
- Validates that `p_MessId` exists.  
- Updates `MessDetails` table if validation passes.  
- Returns meaningful error codes for invalid input.

---

## 18. AddNewDish - Add a New Dish to Hostel Mess

**Description:**  
Adds a new dish to the list of dishes for a hostel's mess.

**Input Parameters:**

| Parameter   | Type   | Required | Description |
|-------------|--------|----------|-------------|
| p_MessId    | int    | Yes      | Must exist in the `MessDetails` table |
| p_Dish      | text   | Yes      | Dish name to be added |

**Return Type:**  
- **boolean**:
  - **true** → Dish added successfully  
  - **false** → Mess entry does not exist  

**Usage Notes:**  
- Validates that `p_MessId` exists in the `MessDetails` table.  
- Appends the new dish to the existing `dishes` array using `array_append`.  
- No duplicate-check is performed—same dish can be added multiple times.

---

## 19. DeleteMessDetails - Delete Hostel Mess Details

**Description:**  
Deletes existing mess details for a hostel.

**Input Parameters:**

| Parameter   | Type   | Required | Description |
|-------------|--------|----------|-------------|
| p_MessId    | int    | Yes      | Must exist in the `MessDetails` table |

**Return Type:**  
- **boolean**:
  - **true** → Mess details deleted successfully  
  - **false** → Mess details do not exist  

**Usage Notes:**  
- Validates that `p_MessId` exists in the `MessDetails` table.  
- Deletes the mess record from `MessDetails`.  
- Returns `false` if no mess entry exists for the given `p_MessId`.

---

## 20. AddKitchenDetails - Add Kitchen Details for a Hostel

**Description:**  
Adds kitchen facility details for a hostel.

**Input Parameters:**

| Parameter      | Type    | Required | Description |
|----------------|---------|----------|-------------|
| p_HostelId     | int     | Yes      | Must exist in `Hostel` table |
| p_isFridge     | boolean | Yes      | Fridge availability |
| p_isMicrowave  | boolean | Yes      | Microwave availability |
| p_isGas        | boolean | Yes      | Gas availability |

**Return Type:**  
- **boolean**:
  - **true** → Kitchen details added successfully  
  - **false** → Hostel does not exist  

**Usage Notes:**  
- Validates that `p_HostelId` exists.  
- Inserts record into `KitchenDetails`.  
- Returns `false` if hostel does not exist.

---

## 21. UpdateKitchenDetails - Update Kitchen Details for a Hostel

**Description:**  
Updates existing kitchen facility details for a hostel.

**Input Parameters:**

| Parameter      | Type    | Required | Description |
|----------------|---------|----------|-------------|
| p_KitchenId    | int     | Yes      | Must exist in `KitchenDetails` table |
| p_isFridge     | boolean | Yes      | Fridge availability |
| p_isMicrowave  | boolean | Yes      | Microwave availability |
| p_isGas        | boolean | Yes      | Gas availability |

**Return Type:**  
- **boolean**:
  - **true** → Kitchen details updated successfully  
  - **false** → Kitchen details do not exist  

**Usage Notes:**  
- Validates that `p_KitchenId` exists.  
- Updates `KitchenDetails` record with new values.  
- Returns `false` if kitchen record does not exist.

---

## 23. Add Room - Hostel Manager

**Description:**  
Allows a Hostel Manager to add a new room to their hostel.

**Input Parameters:**

| Parameter         | Type         | Required | Description |
|------------------|-------------|----------|-------------|
| p_RoomNo          | int         | Yes      | Room number (unique) |
| p_HostelId        | int         | Yes      | Hostel ID to which the room belongs |
| p_FloorNo         | int         | Yes      | Floor number of the room |
| p_SeaterNo        | int         | Yes      | Number of beds in the room |
| p_RoomRent        | float       | Yes      | Rent per room |
| p_BedType         | varchar(20) | Yes      | "Bed" or "Mattress" |
| p_WashroomType    | varchar(20) | Yes      | "RoomAttached" or "Community" |
| p_CupboardType    | varchar(20) | Yes      | "PerPerson" or "Shared" |
| p_isVentilated    | boolean     | Yes      | Whether room is ventilated |
| p_isCarpet        | boolean     | Yes      | Whether room has a carpet |
| p_isMiniFridge    | boolean     | Yes      | Whether room has a mini fridge |

**Return Type:**  
- int: Status code indicating result
  - 1: Room added successfully  
  - 0: Hostel does not exist  
  - -1: Room with this ID already exists  
  - -2: Invalid data types  
  - -3: Hostel room limit reached (update hostel’s number of rooms)

**Usage Notes:**  
- Validates existence of hostel.  
- Checks that the room ID is unique.  
- Verifies hostel room limit is not exceeded.  
- Validates bed, washroom, and cupboard types.  
- Calls `AddRoom` stored procedure.  
- API response:  
  - 200 OK with message if successful  
  - 400 Bad Request if input is invalid or room addition fails  

**Example Request:**

```json
{
  "p_RoomNo": 101,
  "p_HostelId": 5,
  "p_FloorNo": 1,
  "p_SeaterNo": 2,
  "p_RoomRent": 15000.0,
  "p_BedType": "Bed",
  "p_WashroomType": "RoomAttached",
  "p_CupboardType": "PerPerson",
  "p_isVentilated": true,
  "p_isCarpet": false,
  "p_isMiniFridge": true
}
```
**Example Response (Success):**

```json
{
  "message": "Room added successfully",
  "result": true
}
```
**Example Response (Error):**
```json
{
  "error": "Room with this ID already exists"
}
```

---

## 24. Update Room Details - Hostel Manager

**Description:**  
Allows a Hostel Manager to update details of an existing room in their hostel.

**Input Parameters:**

| Parameter         | Type         | Required | Description |
|------------------|-------------|----------|-------------|
| p_RoomNo          | int         | Yes      | Room number to update |
| p_HostelId        | int         | Yes      | Hostel ID to which the room belongs |
| p_FloorNo         | int         | No       | New floor number of the room |
| p_SeaterNo        | int         | No       | New number of beds in the room |
| p_RoomRent        | float       | No       | New rent per room |
| p_BedType         | varchar(20) | No       | New bed type ("Bed" or "Mattress") |
| p_WashroomType    | varchar(20) | No       | New washroom type ("RoomAttached" or "Community") |
| p_CupboardType    | varchar(20) | No       | New cupboard type ("PerPerson" or "Shared") |
| p_isVentilated    | boolean     | No       | Whether room is ventilated |
| p_isCarpet        | boolean     | No       | Whether room has a carpet |
| p_isMiniFridge    | boolean     | No       | Whether room has a mini fridge |

**Return Type:**  
- int: Status code indicating result
  - 1: Room details updated successfully  
  - 0: Hostel does not exist  
  - -1: Room with this ID does not exist  

**Usage Notes:**  
- Validates existence of hostel.  
- Validates existence of room in the hostel.  
- Only updates fields provided in the input; other fields remain unchanged.  
- Calls `UpdateRoom` stored procedure.  
- API response:  
  - 200 OK with message if successful  
  - 400 Bad Request if input is invalid or update fails  

**Example Request:**

```json
{
  "p_RoomNo": 101,
  "p_HostelId": 5,
  "p_FloorNo": 2,
  "p_SeaterNo": 3,
  "p_RoomRent": 18000.0,
  "p_BedType": "Mattress",
  "p_WashroomType": "RoomAttached",
  "p_CupboardType": "Shared",
  "p_isVentilated": true,
  "p_isCarpet": true,
  "p_isMiniFridge": false
}
```
**Example Response (Success):**

```json
{
  "message": "Room details updated successfully",
  "result": true
}

```
**Example Response (Error):**
```json
{
  "error": "Room with this ID does not exist"
}
```

---

## 25. Delete Room Details - Hostel Manager

**Description:**  
Allows a Hostel Manager to delete a room from their hostel.

**Input Parameters:**

| Parameter   | Type | Required | Description |
|------------|------|----------|-------------|
| p_HostelId | int  | Yes      | Hostel ID from which the room will be deleted |
| p_RoomNo   | int  | Yes      | Room number to delete |

**Return Type:**  
- boolean:  
  - true: Room deleted successfully  
  - false: Room does not exist  

**Usage Notes:**  
- Validates that the room exists in the specified hostel.  
- Calls `DeleteRoom` stored procedure.  
- API response:  
  - 200 OK with message if successful  
  - 400 Bad Request if input is invalid or deletion fails  

**Example Request:**

```json
{
  "p_HostelId": 5,
  "p_RoomNo": 101
}
```

---


## 26. Display Single Room Details - Hostel Manager / Student

**Description:**  
Retrieves details of a specific room in a hostel.

**Input Parameters:**

| Parameter   | Type | Required | Description |
|------------|------|----------|-------------|
| p_HostelId | int  | Yes      | Hostel ID where the room is located |
| p_RoomNo   | int  | Yes      | Room number to display |

**Return Type:**  
- Table of room details with the following fields:
  - p_FloorNo: int
  - p_SeaterNo: int
  - p_BedType: varchar(20)
  - p_WashroomType: varchar(20)
  - p_CupboardType: varchar(20)
  - p_RoomRent: float
  - p_isVentilated: boolean
  - p_isCarpet: boolean
  - p_isMiniFridge: boolean

**Usage Notes:**  
- Calls `DisplaySingleRoom` stored procedure.  
- Validates that the room exists in the specified hostel.  
- API response:
  - 200 OK with room details if found
  - 400 Bad Request if input is invalid or room does not exist

**Example Request:**

```json
{
  "p_HostelId": 5,
  "p_RoomNo": 101
}
```
**Example Response (Success):**
```json
{
  "message": "Room deleted successfully",
  "result": true
}

```
**Example Response (Error):**
```json
{
  "error": "Room does not exist"
}
```

---

## 27. Display All Rooms of a Hostel - Hostel Manager / Student

**Description:**  
Retrieves details of all rooms in a specific hostel.

**Input Parameters:**

| Parameter   | Type | Required | Description |
|------------|------|----------|-------------|
| p_HostelId | int  | Yes      | Hostel ID for which all rooms should be retrieved |

**Return Type:**  
- Table of room details with the following fields:
  - p_FloorNo: int
  - p_SeaterNo: int
  - p_BedType: varchar(20)
  - p_WashroomType: varchar(20)
  - p_CupboardType: varchar(20)
  - p_RoomRent: float
  - p_isVentilated: boolean
  - p_isCarpet: boolean
  - p_isMiniFridge: boolean

**Usage Notes:**  
- Calls `DisplayHostelRooms` stored procedure.  
- Returns all rooms for the specified hostel.  
- API response:
  - 200 OK with list of rooms if found
  - 400 Bad Request if input is invalid or hostel has no rooms

**Example Request:**

```json
{
  "p_HostelId": 5
}
```
**Example Response (Success):**

```json
{
  "success": true,
  "result": [
    {
      "p_FloorNo": 1,
      "p_SeaterNo": 2,
      "p_BedType": "Bed",
      "p_WashroomType": "Community",
      "p_CupboardType": "Shared",
      "p_RoomRent": 15000.0,
      "p_isVentilated": true,
      "p_isCarpet": false,
      "p_isMiniFridge": true
    },
    {
      "p_FloorNo": 2,
      "p_SeaterNo": 3,
      "p_BedType": "Mattress",
      "p_WashroomType": "RoomAttached",
      "p_CupboardType": "PerPerson",
      "p_RoomRent": 18000.0,
      "p_isVentilated": true,
      "p_isCarpet": true,
      "p_isMiniFridge": false
    }
  ]
}
```
**Example Response (Error):**
```json
{
  "success": false,
  "error": "No rooms found for this hostel"
}
```

---

## 33. Add Expenses – Room Included

**Description:**  
Called when a hostel manager selects "Expenses included in RoomRent". Adds security charges and averages of room rents per seater into the Expenses table.

**Input Parameters:**

| Parameter          | Type   | Required | Description |
|------------------|--------|----------|-------------|
| p_HostelId        | int    | Yes      | ID of the hostel |
| p_SecurityCharges | float  | Yes      | Security charges to be added |

**Return Type:**  
- boolean:  
  - true: Expenses added successfully  
  - false: Hostel does not exist  

**Usage Notes:**  
- Calls `AddExpenses_RoomIncluded` stored procedure.  
- Validates existence of the hostel.  
- Calculates average room rent per seater and inserts along with security charges into Expenses table.  
- API response:
  - 201 Created with message if successful
  - 400 Bad Request if input is invalid or hostel does not exist

**Example Request:**

```json
{
  "p_HostelId": 5,
  "p_SecurityCharges": 2000.0
}
```
**Example Response (Success):**

```json
{
  "message": "Data Entered Successfully",
  "result": true
}
```
**Example Response (Error):**
```json
{
  "error": "Hostel does not exist"
}
```

---

## 34. Add Expenses – Not Included in Room Rent

**Description:**  
Called when a hostel manager does NOT select "Expenses included in RoomRent". Adds detailed expenses for security, mess, kitchen, internet, AC service, and electricity to the Expenses table.

**Input Parameters:**

| Parameter               | Type   | Required | Description |
|-------------------------|--------|----------|-------------|
| p_HostelId              | int    | Yes      | ID of the hostel |
| p_SecurityCharges       | float  | Yes      | Security charges amount |
| p_MessCharges           | float  | Yes      | Mess charges amount |
| p_KitchenCharges        | float  | Yes      | Kitchen charges amount |
| p_InternetCharges       | float  | Yes      | Internet charges amount |
| p_AcServiceCharges      | float  | Yes      | AC service charges amount |
| p_ElectricitybillType   | text   | Yes      | Must be one of 'RoomMeterFull','RoomMeterACOnly','ACSubmeter','UnitBased' |
| p_ElectricityCharges    | float  | Yes      | Electricity charges amount |

**Return Type:**  
- boolean:  
  - true: Expenses added successfully  
  - false: Hostel does not exist or validation failed  

**Usage Notes:**  
- Calls `AddExpenses` stored procedure.  
- Validates existence of the hostel.  
- Validates electricity bill type.  
- Inserts expenses and room charges into Expenses table with `isincludedinroomcharges = false`.  
- API response:
  - 201 Created with message if successful
  - 400 Bad Request if input is invalid or validation fails

**Example Request:**

```json
{
  "p_HostelId": 5,
  "p_SecurityCharges": 2000.0,
  "p_MessCharges": 5000.0,
  "p_KitchenCharges": 1000.0,
  "p_InternetCharges": 800.0,
  "p_AcServiceCharges": 1200.0,
  "p_ElectricitybillType": "RoomMeterFull",
  "p_ElectricityCharges": 1500.0
}
```
**Example Response (Success):**

```json
{
  "message": "Data Entered Successfully",
  "result": true
}
```
**Example Response (Error – Hostel Not Found):**
```json
{
  "error": "Hostel does not exist"
}
```
**Example Response(Error – Wrong Electricity Bill Type):**
```json
{
  "error": "Wrong electricity bill type selected"
}
```

---

## 35. Update Hostel Expenses

**Description:**  
Updates existing hostel expense details.

**Input Parameters:**

| Parameter                  | Type     | Required | Description |
|----------------------------|---------|----------|-------------|
| p_ExpenseId                | int     | Yes      | ID of the expense record to update |
| p_isIncludedInRoomCharges  | boolean | No       | Whether expenses are included in room charges |
| p_RoomCharges              | float[] | No       | List of room charges per seater |
| p_SecurityCharges          | float   | No       | Security charges amount |
| p_MessCharges              | float   | No       | Mess charges amount |
| p_KitchenCharges           | float   | No       | Kitchen charges amount |
| p_InternetCharges          | float   | No       | Internet charges amount |
| p_AcServiceCharges         | float   | No       | AC service charges amount |
| p_ElectricitybillType      | text    | No       | Must be one of 'RoomMeterFull','RoomMeterACOnly','ACSubmeter','UnitBased' |
| p_ElectricityCharges       | float   | No       | Electricity charges amount |

**Return Type:**  
- boolean:  
  - true: Expenses updated successfully  
  - false: Expense record does not exist or validation failed  

**Usage Notes:**  
- Calls `UpdateHostelExpenses` stored procedure.  
- Validates existence of the expense record.  
- Validates electricity bill type.  
- Updates only fields provided in the request; others remain unchanged.  
- API response:
  - 201 Created with message if successful
  - 400 Bad Request if input is invalid or validation fails

**Example Request:**

```json
{
  "p_ExpenseId": 5,
  "p_isIncludedInRoomCharges": true,
  "p_SecurityCharges": 2500.0,
  "p_MessCharges": 6000.0,
  "p_ElectricitybillType": "RoomMeterACOnly",
  "p_ElectricityCharges": 1400.0
}
```
**Example Response (Success):**
```json
{
  "message": "Data Entered Successfully",
  "result": true
}
```
**Example Response (Error – Expense Not Found):**
```json
{
  "error": "Expense record does not exist"
}
```
**Example Response (Error – Wrong Electricity Bill Type):**
```json
{
  "error": "Wrong electricity bill type selected"
}
```

---

## 36. Delete Hostel Expenses

**Description:**  
Deletes an existing hostel expense record.

**Input Parameters:**

| Parameter     | Type | Required | Description |
|---------------|------|----------|-------------|
| p_ExpenseId   | int  | Yes      | ID of the expense record to delete |

**Return Type:**  
- boolean:  
  - true: Expense deleted successfully  
  - false: Expense record does not exist  

**Usage Notes:**  
- Calls `DeleteExpenses` stored procedure.  
- Validates existence of the expense record before deletion.  
- API response:
  - 201 Created with message if successful
  - 400 Bad Request if input is invalid or record does not exist

**Example Request:**

```json
{
  "p_ExpenseId": 5
}
```
**Example Response (Success):**
```json
{
  "message": "Data Entered Successfully",
  "result": true
}
```
**Example Response (Error – Expense Not Found):**
```json
{
  "error": "Expense record does not exist"
}
```

---

## 37. Display Expenses of a Hostel

**Description:**  
Retrieves the expenses of a given hostel, including room charges, security charges, mess, kitchen, internet, AC service, and electricity.

**Input Parameters:**

| Parameter     | Type | Required | Description |
|---------------|------|----------|-------------|
| p_HostelId    | int  | Yes      | ID of the hostel |

**Return Type:**  
- Object containing all expense fields:
  - p_isIncludedInRoomCharges: boolean
  - p_RoomCharges: float array
  - p_SecurityCharges: float
  - p_MessCharges: float
  - p_KitchenCharges: float
  - p_InternetCharges: float
  - p_AcServiceCharges: float
  - p_ElectricitybillType: text
  - p_ElectricityCharges: float

**Usage Notes:**  
- Calls `DisplayExpenses` stored procedure.  
- Returns all expense details for the given hostel ID.  
- API response:
  - 200 OK with expense details if found
  - 400 Bad Request if input is invalid or hostel does not exist

**Example Request:**

```json
{
  "p_HostelId": 5
}
```
**Example Response (Success):**
```json
{
  "success": true,
  "result": {
    "p_isIncludedInRoomCharges": true,
    "p_RoomCharges": [5000.0, 6000.0],
    "p_SecurityCharges": 2000.0,
    "p_MessCharges": 5000.0,
    "p_KitchenCharges": 1000.0,
    "p_InternetCharges": 800.0,
    "p_AcServiceCharges": 1200.0,
    "p_ElectricitybillType": "RoomMeterACOnly",
    "p_ElectricityCharges": 1500.0
  }
}
```
**Example Response (Error – Hostel Not Found):**
```json
{
  "error": "Expenses not found for the given hostel"
}
```

---

## 41. Display All Rating Stars

**Description:**  
Retrieves all rating entries from the hostel rating system, including rating stars, maintenance rating, issue resolving rate, manager behaviour, and challenges.

**Input Parameters:**  
- None

**Return Type:**  
- Array of objects containing:

| Field                  | Type  | Description |
|------------------------|-------|-------------|
| p_RatingId             | int   | ID of the rating entry |
| p_HostelId             | int   | Hostel ID |
| p_StudentId            | int   | Student ID who submitted rating |
| p_RatingStar           | int   | Overall rating stars |
| p_MaintenanceRating    | int   | Maintenance rating |
| p_IssueResolvingRate   | int   | Issue resolving time in days |
| p_ManagerBehaviour     | int   | Manager behaviour rating |
| p_Challenges           | text  | Any textual challenges reported |

**Usage Notes:**  
- Calls `DisplayRatings` stored procedure.  
- Returns all ratings for all hostels.  
- API response:
  - 200 OK with list of rating entries if successful
  - 400 Bad Request if an error occurs

**Example Response:**

```json
{
  "success": true,
  "result": [
    {
      "p_RatingId": 1,
      "p_HostelId": 5,
      "p_StudentId": 101,
      "p_RatingStar": 4,
      "p_MaintenanceRating": 5,
      "p_IssueResolvingRate": 2,
      "p_ManagerBehaviour": 4,
      "p_Challenges": "Minor room issues resolved quickly"
    },
    {
      "p_RatingId": 2,
      "p_HostelId": 6,
      "p_StudentId": 102,
      "p_RatingStar": 3,
      "p_MaintenanceRating": 3,
      "p_IssueResolvingRate": 5,
      "p_ManagerBehaviour": 3,
      "p_Challenges": "Slow issue resolution"
    }
  ]
}
```

---

## 42. Display Details of Single Student

**Description:**  
Retrieves detailed information of a single student, including semester, department, batch, roomate count, distance from university, room type, mess participation, bed type, and washroom type.

**Input Parameters:**

| Parameter       | Type | Required | Description |
|-----------------|------|----------|-------------|
| p_StudentId     | int  | Yes      | ID of the student |

**Return Type:**  
- Object containing student demographic details:

| Field             | Type    | Description |
|------------------|---------|-------------|
| p_Semester        | int     | Current semester of the student |
| p_Department      | text    | Department name |
| p_Batch           | int     | Student batch year |
| p_RoomateCount    | int     | Number of roommates |
| p_UniDistance     | float   | Distance from university in km |
| p_isAcRoom        | boolean | Whether the student has an AC room |
| p_isMess          | boolean | Whether student uses hostel mess |
| p_BedType         | varchar | Bed type in the hostel |
| p_WashroomType    | varchar | Washroom type in the hostel |

**Usage Notes:**  
- Calls `DisplayStudent` stored procedure.  
- Returns all demographic details of the specified student.  
- API response:
  - 200 OK with student details if found
  - 400 Bad Request if input is invalid or student does not exist

**Example Request:**

```json
{
  "p_StudentId": 101
}
```
**Example Response (Success):**
```json
{
  "success": true,
  "result": {
    "p_Semester": 5,
    "p_Department": "Computer Science",
    "p_Batch": 2022,
    "p_RoomateCount": 3,
    "p_UniDistance": 2.5,
    "p_isAcRoom": true,
    "p_isMess": false,
    "p_BedType": "Bed",
    "p_WashroomType": "RoomAttached"
  }
}
```
**Example Response (Error – Student Not Found):**
```json
{
  "error": "Student not found for the given ID"
}
```

---

## 43. Display All Students (By Admin)

**Description:**  
Retrieves demographic details of all students, including semester, department, batch, roomate count, distance from university, AC room availability, mess participation, bed type, and washroom type. This API is intended for Admin use.

**Input Parameters:**  
- None

**Return Type:**  
- Array of objects containing student demographic details:

| Field             | Type    | Description |
|------------------|---------|-------------|
| p_Semester        | int     | Current semester of the student |
| p_Department      | text    | Department name |
| p_Batch           | int     | Student batch year |
| p_RoomateCount    | int     | Number of roommates |
| p_UniDistance     | float   | Distance from university in km |
| p_isAcRoom        | boolean | Whether the student has an AC room |
| p_isMess          | boolean | Whether student uses hostel mess |
| p_BedType         | varchar | Bed type in the hostel |
| p_WashroomType    | varchar | Washroom type in the hostel |

**Usage Notes:**  
- Calls `DisplayAllStudents` stored procedure.  
- Returns details of all students in the system.  
- API response:
  - 200 OK with list of students if successful
  - 400 Bad Request if an error occurs

**Example Response:**

```json
{
  "success": true,
  "result": [
    {
      "p_Semester": 5,
      "p_Department": "Computer Science",
      "p_Batch": 2022,
      "p_RoomateCount": 3,
      "p_UniDistance": 2.5,
      "p_isAcRoom": true,
      "p_isMess": false,
      "p_BedType": "Bed",
      "p_WashroomType": "RoomAttached"
    },
    {
      "p_Semester": 3,
      "p_Department": "Electrical Engineering",
      "p_Batch": 2023,
      "p_RoomateCount": 2,
      "p_UniDistance": 1.2,
      "p_isAcRoom": false,
      "p_isMess": true,
      "p_BedType": "Mattress",
      "p_WashroomType": "Community"
    }
  ]
}
```

---

## 44. Display App Suggestions (Admin Page)

**Description:**  
Retrieves all app suggestions submitted by users, including suggested improvements and reported defects. This API is intended for Admin use.

**Input Parameters:**  
- None

**Return Type:**  
- Array of objects containing user suggestions:

| Field             | Type  | Description |
|------------------|-------|-------------|
| p_userid          | int   | ID of the user who submitted the suggestion |
| p_improvements    | text  | Suggested improvements to the app |
| p_defects         | text  | Reported defects in the app |

**Usage Notes:**  
- Calls `DisplayUserSuggestions` stored procedure.  
- Returns all user-submitted suggestions in the system.  
- API response:
  - 200 OK with list of suggestions if successful
  - 400 Bad Request if an error occurs

**Example Response:**

```json
{
  "success": true,
  "result": [
    {
      "p_userid": 101,
      "p_improvements": "Add dark mode, improve search filter",
      "p_defects": "App crashes when uploading profile picture"
    },
    {
      "p_userid": 102,
      "p_improvements": "Allow multiple payment options",
      "p_defects": "Notification not showing for new messages"
    }
  ]
}
```

---

## 45. Display Manager Details

**Description:**  
Retrieves detailed information about a single hostel manager, including photo link, phone number, education, manager type, and operating hours.

**Input Parameters:**

| Parameter    | Type | Required | Description               |
|--------------|------|----------|---------------------------|
| p_ManagerId  | int  | Yes      | ID of the manager         |

**Return Type:**  
- Object containing manager details:

| Field           | Type   | Description                       |
|-----------------|--------|-----------------------------------|
| p_PhotoLink     | text   | Link to manager's profile photo   |
| p_PhoneNo       | char   | Manager's phone number (11 digits)|
| p_Education     | varchar| Manager's education details       |
| p_ManagerType   | varchar| Type/category of the manager     |
| p_OperatingHours| int    | Daily operating hours            |

**Usage Notes:**  
- Calls `DisplayManager` stored procedure.  
- Returns manager details for the given ID.  
- API response:
  - 201 Created with manager details if successful
  - 400 Bad Request if input is invalid or manager does not exist

**Example Response:**

```json
{
  "success": true,
  "result": {
    "p_PhotoLink": "https://example.com/photo.jpg",
    "p_PhoneNo": "03001234567",
    "p_Education": "MBA in Hospitality",
    "p_ManagerType": "Hostel Manager",
    "p_OperatingHours": 10
  }
}
```

---

## 46. Display All Managers (Admin)

**Description:**  
Retrieves details of all hostel managers for administrative purposes, including photo link, phone number, education, manager type, and operating hours.

**Input Parameters:**  
- None

**Return Type:**  
- Array of objects containing manager details:

| Field           | Type   | Description                       |
|-----------------|--------|-----------------------------------|
| p_ManagerId     | int    | Unique ID of the manager          |
| p_PhotoLink     | text   | Link to manager's profile photo   |
| p_PhoneNo       | char   | Manager's phone number (11 digits)|
| p_Education     | varchar| Manager's education details       |
| p_ManagerType   | varchar| Type/category of the manager     |
| p_OperatingHours| int    | Daily operating hours            |

**Usage Notes:**  
- Calls `DisplayAllManagers` stored procedure.  
- Returns a list of all managers in the system.  
- API response:
  - 200 OK with list of managers if successful
  - 400 Bad Request if an error occurs

**Example Response:**

```json
{
  "success": true,
  "result": [
    {
      "p_ManagerId": 1,
      "p_PhotoLink": "https://example.com/photo1.jpg",
      "p_PhoneNo": "03001234567",
      "p_Education": "MBA in Hospitality",
      "p_ManagerType": "Hostel Manager",
      "p_OperatingHours": 10
    },
    {
      "p_ManagerId": 2,
      "p_PhotoLink": "https://example.com/photo2.jpg",
      "p_PhoneNo": "03007654321",
      "p_Education": "BBA in Management",
      "p_ManagerType": "Assistant Manager",
      "p_OperatingHours": 8
    }
  ]
}
```

---

## 47. Display Details of a Hostel

**Description:**  
Retrieves detailed information of a specific hostel, including location, type, number of rooms/floors, facilities, water timings, and tenures.

**Input Parameters:**

| Parameter  | Type    | Required | Description                          |
|------------|---------|----------|--------------------------------------|
| p_HostelId | int     | Yes      | ID of the hostel to display           |

**Return Type:**  
- Object containing hostel details:

| Field                    | Type    | Description                                |
|---------------------------|---------|--------------------------------------------|
| p_BlockNo                 | varchar | Block number                               |
| p_HouseNo                 | varchar | House number                               |
| p_HostelType              | varchar | Type of hostel (e.g., Boys, Girls)       |
| p_isParking               | boolean | Whether parking is available              |
| p_NumRooms                | int     | Total number of rooms                      |
| p_NumFloors               | int     | Total number of floors                     |
| p_WaterTimings            | time    | Timings for water availability             |
| p_CleanlinessTenure       | int     | Cleanliness check tenure in days           |
| p_IssueResolvingTenure    | int     | Issue resolving tenure in days             |
| p_MessProvide             | boolean | Whether mess facility is provided          |
| p_GeezerFlag              | boolean | Whether a water heater is available        |
| p_name                    | text    | Name of the hostel                          |

**Usage Notes:**  
- Calls `DisplayHostel` stored procedure.  
- Returns detailed information for a specific hostel.  
- API response:
  - 200 OK with hostel details if successful
  - 400 Bad Request if an error occurs

**Example Response:**

```json
{
  "success": true,
  "result": {
    "p_BlockNo": "B-12",
    "p_HouseNo": "H-3",
    "p_HostelType": "Boys",
    "p_isParking": true,
    "p_NumRooms": 50,
    "p_NumFloors": 5,
    "p_WaterTimings": "06:00:00",
    "p_CleanlinessTenure": 7,
    "p_IssueResolvingTenure": 3,
    "p_MessProvide": true,
    "p_GeezerFlag": false,
    "p_name": "Green Hostel"
  }
}
```