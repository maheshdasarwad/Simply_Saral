const mongoose=require("mongoose");

async function main() {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/PBL_DOCUMENTS";
    await mongoose.connect(mongoURI);
}

main()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));

const data=require("./farmer_Scheme_data");

const FarmerSchemes=require("../model/farmer_Schemes_Model");

async function initDB(){
    await FarmerSchemes.deleteMany({});
    await FarmerSchemes.insertMany(data.data);
    console.log("Database initialized");
};
initDB();

 
