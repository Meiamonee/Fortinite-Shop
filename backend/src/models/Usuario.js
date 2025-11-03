import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    default: 10000 // cada usuário começa com 10.000 v-bucks
  },
  cosmeticosComprados: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cosmeticos"
    }
  ]
}, { timestamps: true });

const Usuario = mongoose.model("Usuario", userSchema);
export default Usuario;
