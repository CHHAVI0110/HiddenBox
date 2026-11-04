import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {success, z} from "zod"
import { usernameValidation } from "@/schema/signUpSchema";

export async function POST(request:Request){
    try{
        const {username,code} = await request.json()

        const decodedUsername= decodeURIComponent(username)
        const user = await UserModel.findOne(
            {
                username:decodedUsername
            })
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {status:404}
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry)> new Date()


        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save() // actually update the mongoDb

            return Response.json({
                success:true,
                message:"Account verified successfully"
            },
        {
            status:200
        })
        } else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Verification code has expired, please signup again to get a new code "
            },{status:400})
        }else{
            return Response.json({
                success:false,
                message:"Incorrect Verification code ",
        },{status:400})}



   }catch(error){
        console.error("Error verifying User" ,error)
        return Response.json(
            {
                sucess:false,
                message:"Error verifying User"
            },
            {status:500}
        )

    }
}

