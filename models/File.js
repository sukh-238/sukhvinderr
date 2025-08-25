import mongoose from 'mongoose';


const fileSchema = new mongoose.Schema({
filename: { type: String, required: true },
fileURL: { type: String, required: true },
uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
expiryTime: { type: Date, required: true },
downloadCount: { type: Number, default: 0 },
public_id: { type: String } // cloudinary public id for deletion if needed
}, { timestamps: true });


export default mongoose.model('File', fileSchema);