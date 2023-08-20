const mongoose=require("mongoose");


const UserSchema=mongoose.Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
    phone:{type:Number},
    assignby:[{
        name: { type: String, required: true },
        description: { type: String },
        checklist: [{ type: String }],
        comments: [{ type: String }],
        project: { type: String },
        assign: [{ type: String }],
        dueDate: { type: Date },
        labels: [{ type: String }]
    }]
},

{
    versionKey:false
})

const UserModel=mongoose.model("user",UserSchema)

module.exports={
    UserModel
}