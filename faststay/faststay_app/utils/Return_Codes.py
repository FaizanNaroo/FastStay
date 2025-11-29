# fastStay_app/utils/return_codes.py

RETURN_CODES = {
    "AddMessDetails": {
        -1: "Hostel does not exist.",
        0:  "Hostel does not provide Mess.",
        -2: "Mess Meal Count ranges from (1 to 3).",
        1:  "Mess details added successfully."
    },
    "UpdateMessDetails": {
        -1: "Mess info does not exist.",
        0:  "Mess Meal Count ranges from (1 to 3).",
        1:  "Mess details updated successfully."
    },
    "AddRoom":{
        -3: "Hostel Room Limit is Full",
        -2: "Invalid Data Type.",
        -1: "Room with this id already exists.",
        0: "Hostel does not exist.",
        1: "Room Added Successfully"
    },
    "UpdateRoom":{
        -1: "Room with this id does not exists.",
        0: "Hostel does not exists.",
        1: "Room Details Added Successfully"
    },
    "AddExpenses":{
        -1: "Wrong Electricity Bill Type Selected.",
        0: "Hostel does not exists.",
        1: "Successfully inserted."
    },
    "UpdateHostelExpenses":{
        -1: "Wrong Electricity Bill Type Selected.",
        0: "Hostel does not exists.",
        1: "Successfully inserted."
    }
}
