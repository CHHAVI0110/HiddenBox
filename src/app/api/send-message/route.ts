import UserModel from "@/model/User";
import {Message} from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

export async function POST(request:Request){
    await dbConnect()
    const {username , content} = await request.json()
    try{
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },{status:401}
            )
        }
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success:false,
                    message:"User is not accepting the messages"
                },{status:403}
            )
        }

        const newMessage = {content , createdAt : new Date()}

        user.messages.push(newMessage as Message )
        await user.save()
        return Response.json(
            {
                success:true,
                message:"message sent successfully"
            }
        )

    }catch(error){
          console.log("An unexpected error occured:" ,error)
        return Response.json(
                {
                    success:false,
                    message:"not adding messages"
                },
                {status:500}
            )
    }

}
