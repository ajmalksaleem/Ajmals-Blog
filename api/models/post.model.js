import { Schema, model } from "mongoose";

const postSchema = new Schema({
    userId :{
        type : Schema.Types.ObjectId, ref : "User",
        required : true
    },
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    image :{
        type : String,
        default : 'https://i.pinimg.com/originals/f2/72/94/f272943e5355a948e9430a8c79e6f1cb.jpg'
    },
    category: {
        type: String,
        default: 'uncategorized',
      },
      slug: {
        type: String,
        required: true,
      }
},
{timestamps:true}
)

const Post = model('Post',postSchema)
export default Post

