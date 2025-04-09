const mongoose=require("mongoose");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/PBL_DOCUMENTS");
}

main()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));

const data=require("./secondary_Edu_data.js");

const secondaryEduct=require("../model/secondary_Education.js");

async function initDB(){
    await secondaryEduct.deleteMany({});
    await secondaryEduct.insertMany(data.data);
    console.log("Database initialized");
};
initDB();

 
