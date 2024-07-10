import mongoose from "mongoose"; 

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi', 
    'Puducherry', 'Ladakh', 'Jammu and Kashmir'
];

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    mobileNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v){
                const regex = /^[6-9]\d{9}$/;
            
                return regex.test(v);
            },
            message: "Invalid indian mobile number"
        } 
    },
    pinCode: {
        type: String,
        required: true,
        validate: {
            validator: function(v){
                const regex = /^[1-9][0-9]{5}$/;
            
                return regex.test(v);
            },
            message: "Invalid indian pin code"
        }
    },
    state: {
        type: String,
        required: true,
        enum: indianStates,
        message: "Inavlid State",
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
}, {timestamps: true});

export const Address = mongoose.model("Address", addressSchema);