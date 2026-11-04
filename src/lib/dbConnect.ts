import mongoose from "mongoose";



type ConnectionObject ={
    isConnected?: number;
}

const connection : ConnectionObject ={

}

async function dbConnect() : Promise<void> {
    console.log("URI loaded:", !!process.env.MONGODB_URI);
    if(mongoose.connection.readyState === 1){
        console.log("Already connection to database");
        return
    }

    try{
       const db = await mongoose.connect(process.env.MONGODB_URI || '',{})
       //connection.isConnected=db.connections[0].readyState
    }catch(error){
        console.log("Database connection failed",error);
        throw error;
       

    }
}

export default dbConnect;