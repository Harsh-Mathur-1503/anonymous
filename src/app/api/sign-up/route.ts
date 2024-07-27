import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    
    try {
        const { username, email, password } = await request.json();
        
        // Check for existing users with the given username
        const existingUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });
        if (existingUserByUsername) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username already exists"
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check for existing users with the given email
        const existingUserByEmail = await UserModel.findOne({
            email,
            isVerified: true
        });
        if (existingUserByEmail) {
           if(existingUserByEmail.isVerified){
            return Response.json({
                success: false,
                message: "Email already exists"
            },{status:400})
           }
           else{
            const hashedPassword = await bcrypt.hash(password,10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
           }
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Convert to string
        
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            verifyCode,
            verificationCodeExpiry: expiryDate,
            isAcceptingMessages: true,
            messages: []
        });

        await newUser.save();

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Failed to send verification email"
                }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "User registered successfully"
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error registering user"
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
