import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


export async function POST(request:Request){
    await dbConnect();
    const {username,content} = await request.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                message: "No User Found",
                status: 401
            })
        }

        if(!user.isAcceptingMessages){
            return Response.json({
                message: "User is not accepting messages",
                status: 403
            })
        }
        const newMessage = {content,createdAt:new Date()}
        user.messages.push(newMessage as Message) 
        await user.save()
        return Response.json({
            success: true,
            message: "Message sent successfully"
        },{status: 200})
    } catch (error) {
        console.error("An unexpected error occured",error)
        return Response.json({
            message: "Internal Server Error",
            status: 500
        })
    }
}

/*
import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return new Response(
                JSON.stringify({
                    message: "No User Found"
                }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!user.isAcceptingMessages) {
            return new Response(
                JSON.stringify({
                    message: "User is not accepting messages"
                }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Create a new message document
        const newMessage = new mongoose.model<Message>("Message", new mongoose.Schema({
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }))({
            content,
            createdAt: new Date()
        });

        user.messages.push(newMessage);
        await user.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Message sent successfully"
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("An unexpected error occurred", error);
        return new Response(
            JSON.stringify({
                message: "Internal Server Error"
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
*/