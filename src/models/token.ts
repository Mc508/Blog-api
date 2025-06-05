import {Schema,model,Types} from "mongoose";

interface IToken{
    token:string,
    userId:Types.ObjectId
}


const tokenSchema = new Schema<IToken>({
    token:{type:String,required:true},
    userId:{type:Schema.Types.ObjectId,required:true}
})

export const Token = model<IToken>('Token',tokenSchema)