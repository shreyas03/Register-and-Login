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
    name: String,
    desc: String,
    img: {
      data: String,
      contentType: String,
    },
    fileName: String,
    postedBy: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'coll1'
    }
})

exports.coll1 = mongoose.model("coll1", regSchema)
exports.f1 = mongoose.model("f1", datSchema)