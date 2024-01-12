"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.userSchema = void 0;
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    authorName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    phoneNumber: zod_1.z.string(),
    confirmPassword: zod_1.z.string(), // Add this line to include confirmPassword
});
exports.userSchema = userSchema;
const validateUser = (data) => {
    try {
        return userSchema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            throw new Error(`Validation failed: ${error.message}`);
        }
        else {
            throw new Error('Unknown validation error occurred');
        }
    }
};
exports.validateUser = validateUser;
