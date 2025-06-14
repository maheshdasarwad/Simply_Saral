const mongoose=require("mongoose");

async function main() {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/PBL_DOCUMENTS";
    await mongoose.connect(mongoURI);
}

main()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));

const data=require("./higher_Edu_data.js");

const higherEduct=require("../model/higher_Education_Model.js");

async function initDB(){
    await higherEduct.deleteMany({});
    await higherEduct.insertMany(data.schemes);
    console.log("Database initialized");
};
initDB();

 
