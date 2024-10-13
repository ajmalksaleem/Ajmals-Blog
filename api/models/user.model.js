import { Schema,model } from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        required : true,
        min : 3,
        max:20,
        unique :true
    },
    email:{
        type:String,
        required : true,
        unique :true
    },
    password:{
        type:String,
        required : true,
    },
    profilePicture:{
        type :String,
        default : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1728490716~exp=1728494316~hmac=1f71a5b88ed40af1e7d02362c4a9194cb0070c3c2dcd6c7b9b2a5bf2b3970973&w=740"
    },
    isAdmin :{
        type : Boolean,
        default : false
    },
},
{timestamps:true}
)

const User = model('User', userSchema)

export default User;