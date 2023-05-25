const mongoose = require("mongoose")


async function main() {
  await mongoose.connect(process.env.url);
  console.log('Database Connected')
}

main().catch(err => console.log(err));

const regSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    mail: {
        type:String,
        required: true,
        unique: true
    },
    uname: {
        type:String,
        required: true,
        unique: true
    },
    pwd: {
        type: String,
        required: true
    }
})

const datSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    file: {
        data:Buffer,
        contentType:String
    }
})

exports.coll1 = mongoose.model("coll1", regSchema)
exports.f1 = mongoose.model("f1", datSchema)