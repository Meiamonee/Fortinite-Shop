import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI || "mongodb://localhost:27017/fortniteshop";
    
    // Adiciona o nome do banco na connection string se não tiver
    if (uri.includes('mongodb+srv://') || uri.includes('mongodb://')) {
      // Se termina com /? ou / sem nome do banco, adiciona fortniteshop
      if (uri.endsWith('/?') || uri.endsWith('/')) {
        uri = uri.replace(/\/\?$/, '/fortniteshop?').replace(/\/$/, '/fortniteshop');
      } else if (uri.includes('mongodb.net/') && !uri.match(/mongodb\.net\/[^/?]+/)) {
        // Se tem mongodb.net/ mas não tem nome do banco antes do ?
        uri = uri.replace('mongodb.net/', 'mongodb.net/fortniteshop');
      }
      
      // Garante que tem retryWrites e w=majority se for Atlas
      if (uri.includes('mongodb+srv://') && !uri.includes('retryWrites')) {
        uri += (uri.includes('?') ? '&' : '?') + 'retryWrites=true&w=majority';
      }
    }
    
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
