import mongoose from "mongoose";

const cosmeticoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, required: true },
  raridade: { type: String, required: true },
  preco: { type: Number, required: true },
  imagem: { type: String },
  status: { type: String, enum: ["normal", "novo", "loja"], default: "normal" }
}, { timestamps: true });

const Cosmetico = mongoose.model("Cosmetico", cosmeticoSchema);
export default Cosmetico;
