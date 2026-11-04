import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"
import { usernameValidation } from "@/schema/signUpSchema";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request){
    //use this in all other routes
   
    //localhost:3000/api/cuu?username=chavi?phone=android

    try{
        await dbConnect()
        const {searchParams} = new URL(request.url) // ?username=chavi?phone=android
        const queryParms ={
            username:searchParams.get('username') 
        }

        //validation with zod
        const result =  UsernameQuerySchema.safeParse(queryParms)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message: usernameErrors?.length> 0? usernameErrors.join(', '): 'Invaild query parameters',
            },{status:400})
        }

        const {username} =result.data
        const existingVerifiedUser = await UserModel.findOne({username , isVerified:true})
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message:'Username is already taken',
            },{status:400})
        }
        return Response.json({
            success: true,
            message:'Username is unique',
        },{status:200})

    }catch(error){
        console.error("Error checking username" ,error)
        return Response.json(
            {
                success:false,
                message:"Error checking username"
            },
            {status:500}
        )

    }
}
