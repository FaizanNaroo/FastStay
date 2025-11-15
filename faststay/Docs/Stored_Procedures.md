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