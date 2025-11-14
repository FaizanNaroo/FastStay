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
    # You can add more procedures here…
}
