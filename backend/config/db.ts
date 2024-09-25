import mongoose from "mongoose";

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      "mongodb+srv://mirellegeovanna3:didimoco13@cluster0.bgsed.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("conectou ao banco de dados");
    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

conn();
module.exports = conn;
