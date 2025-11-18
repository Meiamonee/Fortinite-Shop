import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    
    // Debug: verifica se a variável está sendo lida
    if (!uri) {
      console.error("ERRO: MONGO_URI não está definida nas variáveis de ambiente!");
      console.log("Variáveis de ambiente disponíveis:", Object.keys(process.env).filter(k => k.includes('MONGO')));
      throw new Error("MONGO_URI não configurada");
    }
    
    // Remove espaços e quebras de linha
    uri = uri.trim();
    
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
    
    console.log("Tentando conectar ao MongoDB...");
    console.log("URI (oculta):", uri.replace(/:[^:@]+@/, ':****@'));
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("Erro conectando ao MongoDB:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
};

export default connectDB;
