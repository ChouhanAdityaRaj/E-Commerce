import { z } from "zod";

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi', 
    'Puducherry', 'Ladakh', 'Jammu and Kashmir'
];



const addAddressSchema = z.object({
    mobileNumber: z
        .string({required_error: "Mobile number is required"})
        .regex(new RegExp(/^[6-9]\d{9}$/), "Invalid Indian mobile number"),

    pinCode: z
        .string({required_error: "Pin code is required"})
        .regex(new RegExp(/^[1-9][0-9]{5}$/), "Invalid Indian pin code"),

    state: z
        .enum(indianStates, {required_error: "State is required", message: "Invalid Indina State"}),

    city: z
        .string({required_error: "city is required"}),
        
    address: z
        .string({required_error: "city is required"})
        .max(150, {message: "Address must not be more than 150 characters."}),
});

const updateAddressSchema = z.object({
    mobileNumber: z
        .string({required_error: "Mobile number is required"})
        .regex(new RegExp(/^[6-9]\d{9}$/), "Invalid Indian mobile number")
        .optional(),

    pinCode: z
        .string({required_error: "Pin code is required"})
        .regex(new RegExp(/^[1-9][0-9]{5}$/), "Invalid Indian pin code")
        .optional(),

    state: z
        .enum(indianStates, {required_error: "State is required", message: "Invalid Indina State"})
        .optional(),

    city: z
        .string({required_error: "city is required"})
        .optional(),

    address: z
        .string({required_error: "city is required"})
        .max(150, {message: "Address must not be more than 150 characters."})
        .optional(),
});

export {
    addAddressSchema,
    updateAddressSchema
}