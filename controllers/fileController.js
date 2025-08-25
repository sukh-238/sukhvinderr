import cloudinary from '../config/cloudinaryConfig.js';
const fileObj = req.files?.file;
if (!fileObj) return res.status(400).json({ message: 'No file uploaded' });


// Upload to Cloudinary
const uploadRes = await cloudinary.uploader.upload(fileObj.tempFilePath, {
resource_type: 'auto',
folder: 'file_sharing'
});


const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour


const fileDoc = await File.create({
filename: fileObj.name,
fileURL: uploadRes.secure_url,
uploadedBy: req.user.id,
expiryTime,
public_id: uploadRes.public_id
});


// Create a unique id route - we'll just use the DB _id
const downloadLink = `${process.env.BASE_URL}/api/files/download/${fileDoc._id}`;


// Send email to uploader
const uploader = await User.findById(req.user.id);
await sendDownloadEmail(uploader.email, uploader.name, downloadLink, fileDoc.filename);


return res.status(201).json({ message: 'Uploaded', downloadLink, file: fileDoc });
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Upload failed', error: err.message });
}
};


export const getDownloadLink = async (req, res) => {
try {
const { id } = req.params;
const fileDoc = await File.findById(id).populate('uploadedBy', 'email name');
if (!fileDoc) return res.status(404).json({ message: 'File not found' });
if (new Date() > new Date(fileDoc.expiryTime)) {
return res.status(410).json({ message: 'Link expired' });
}
fileDoc.downloadCount = (fileDoc.downloadCount || 0) + 1;
await fileDoc.save();


// Option A: redirect to file URL
return res.json({ fileURL: fileDoc.fileURL, filename: fileDoc.filename });
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
};