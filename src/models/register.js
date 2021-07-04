const mongoose = require("mongoose");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken")
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate(val){
            if(!(/\S+@\S+\.\S+/.test(val))){
             throw new Error ("email is not valid")
            }
        },
        required: true,
    },
    phone: Number,
    gender: String,
    password: String,
    confrimPass: String,
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }]
    
})

// studentSchema.methods.genarateAuthToken = async function(){
//     try {
//         const token = jwt.sign({_id:this._id.toString()},"mynameismustafizmyloveisbokul")
//         this.tokens = this.tokens.concat({token:token})
//         await this.save()
//         return token
//     } catch (error) {
//         res.send(error)
//     }
// }

studentSchema.methods.tryThisToken = async function(){
    try{
        const token = jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token: token})
        await this.save();
        return token;
    }catch(error){
        res.send(error)
    }
}

studentSchema.pre("save" , async function(next){
    if(this.isModified("password")){
        this.password = await bycript.hash(this.password , 10);
        this.confrimPass = undefined
    }
    next()
})
const Student = new mongoose.model("Student" , studentSchema);

module.exports = Student;