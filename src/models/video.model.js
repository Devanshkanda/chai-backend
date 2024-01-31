import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {    
        videFile: {
            type: String, // cloundinary url
            required: true,
        },

        thumbnail: {
            type: String, // cloundinary url
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        duration: {
            type: Number, // cloudinary url
            required: true
        },

        views: {
            type: Number, // cloundinary url
            default: 0
        },

        isPublished: {
            type: Boolean,
            default: true
        },

        owner: {
            type: Schema.Types.ObjectId, // cloundinary url
            ref: "User"
        }
    },
    {
        timpestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)