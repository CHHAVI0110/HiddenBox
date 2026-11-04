
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
     console.log("DELETE API ROUTE HIT");
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }

    const { messageid } = await params;

    if (!mongoose.Types.ObjectId.isValid(messageid)) {
      return Response.json(
        {
          success: false,
          message: "Invalid message ID",
        },
        { status: 400 }
      );
    }

    const userId = session.user._id;

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "User ID not found in session",
        },
        { status: 401 }
      );
    }

    console.log("User ID:", userId);
    console.log("Message ID:", messageid);

    const updateResult = await UserModel.updateOne(
      { _id: userId },
      {
        $pull: {
          messages: {
            _id: new mongoose.Types.ObjectId(messageid),
          },
        },
      }
    );

    console.log("Update result:", updateResult);

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);

    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}
