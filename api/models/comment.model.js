import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    content : {
        type : String,
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId, ref : 'User',
        required : true
    },
    postId : {
        type : Schema.Types.ObjectId, ref : 'Post',
        required : true
    },
    likes : {
        type : Array,
        default : []
    },
    numberOfLikes : {
        type : Number,
        default : 0
    },
},
{timestamps:true}
)

const Comment = new model('comment',commentSchema,)
export default Comment