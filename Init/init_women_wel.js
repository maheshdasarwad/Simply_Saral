const mongoose=require("mongoose");

async function main() {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/PBL_DOCUMENTS";
    await mongoose.connect(mongoURI);
}

main()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));

const data=require("./women_wel_data");

const womenSchemes=require("../model/women_Welf_Model");

async function initDB(){
    await womenSchemes.deleteMany({});
    await womenSchemes.insertMany(data.data);
    console.log("Database initialized");
};
initDB();

 
