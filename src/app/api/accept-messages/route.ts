import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;
    if(!session || !session.user){
        return Response.json({
            message: "Unauthorized User",
            status: 401
        })
    }
    const userId = user._id;
    const {acceptMessages} = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessages: acceptMessages
        },{
            new: true
        })
        if(!updatedUser){
            return Response.json({
                message: "User not found",
                status: 401
            })
        }
        else{
            return Response.json({
                message: "User status updated to accept messages",
                updatedUser,
                status: 200
            })
        }
    } catch (error) {
        return Response.json({
            message: "Failed to update user status to accept messages",
            status: 500
        })
    }
}

export async function GET(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;
    if(!session || !session.user){
        return Response.json({
            message: "Unauthorized User",
            status: 401
        })
    }
    const userId = user._id;
    try {
        const user = await UserModel.findById(userId);
        if(!user){
            return Response.json({
                message: "User not found",
                status: 401
            })
        }
        else{
            return Response.json({
                message: "User found",
                isAcceptingMessages: user.isAcceptingMessages,
                user,
                status: 200
            })
        }
    } catch (error) {
        return Response.json({
            message: "Failed to get message acceptance status",
            status: 500
        })
    }
}