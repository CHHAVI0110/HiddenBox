import { Message } from "../model/User";

export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptMessage?:boolean; //?. it make it optional it may be exist or not
    messages?:Array<Message>

}