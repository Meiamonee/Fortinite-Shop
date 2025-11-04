import mongoose from "mongoose";

const historicoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  cosmetico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cosmetico",
    required: true
  },
  tipo: {
    type: String,
    enum: ["compra", "reembolso"],
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  }
});

const Historico = mongoose.model("Historico", historicoSchema);
export default Historico;
