import mongoose from "mongoose";

const cosmeticoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  raridade: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  regularPrice: {
    type: Number
  },
  imagem: {
    type: String
  },
  status: {
    type: String,
    enum: ["normal", "novo", "loja"],
    default: "normal"
  },
  isBundle: {
    type: Boolean,
    default: false
  },
  bundleItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cosmetico"
    }
  ]
}, { timestamps: true });

const Cosmetico = mongoose.model("Cosmetico", cosmeticoSchema);
export default Cosmetico;
