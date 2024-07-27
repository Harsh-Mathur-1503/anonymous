import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { code, username } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername, verifyCode: code });

        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found"
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const verifyCodeExpiry = user.verifyCodeExpiry ? new Date(user.verifyCodeExpiry) : null;
        const isCodeNotExpired = verifyCodeExpiry ? new Date() < verifyCodeExpiry : false;

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            // Handle successful verification here
            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Verification successful"
                }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        } else if(!isCodeValid) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid verification code"
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        } else {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Verification code has expired"
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

    } catch (error) {
        console.log("Error checking username", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal Server Error"
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
