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
        default : 'https://img.freepik.com/free-photo/programming-background-collage_23-2149901789.jpg?t=st=1728814459~exp=1728818059~hmac=db061cf0db7bdc3fc2aa223f6a28058670bf02a451e007229d39b5faf12dc3bc&w=826'
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

