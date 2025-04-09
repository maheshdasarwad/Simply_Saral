const mongoose=require("mongoose");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/PBL_DOCUMENTS");
}

main()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));

const data=require("./primary_Edu_data.js");

const primaryEduct=require("../model/primary_Education.js");

async function initDB(){
    await primaryEduct.deleteMany({});
    await primaryEduct.insertMany(data.data);
    console.log("Database initialized");
};
initDB();

 
