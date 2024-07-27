import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const usernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    await dbConnect();
    
    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username")
        };
        
        // Validate with zod
        const result = usernameQuerySchema.safeParse(queryParams);
        console.log("Result", result);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid username",
                    errors: usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        
        if (existingVerifiedUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username is already taken"
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }    

        return new Response(
            JSON.stringify({
                success: true,
                message: "Username Available"
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.log("Error checking username", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error checking username"
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}