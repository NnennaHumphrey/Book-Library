import { z, ZodError } from 'zod';

const userSchema = z.object({
  authorName: z.string(),
  email: z.string().email(),
  password: z.string(),
  phoneNumber: z.string(),
  confirmPassword: z.string(), // Add this line to include confirmPassword
});

type UserInput = z.infer<typeof userSchema>;

const validateUser = (data: unknown): UserInput => {
  try {
    return userSchema.parse(data) as UserInput;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Validation failed: ${error.message}`);
    } else {
      throw new Error('Unknown validation error occurred');
    }
  }
};

export { userSchema, UserInput, validateUser };
