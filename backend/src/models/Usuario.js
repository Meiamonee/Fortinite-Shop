import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true
  },
  creditos: {
    type: Number,
    default: 10000
  },
  cosmeticosComprados: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cosmetico"   // ✅ ref deve estar dentro do array de objetos
    }
  ]
}, { timestamps: true });

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
