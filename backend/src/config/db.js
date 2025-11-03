import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/fortnite";
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Erro conectando ao MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
