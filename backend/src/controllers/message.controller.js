import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
export const getUserForSidebar = async(req ,res) => {
try {
    const loggedInUserId = req.user._id;
    const  filteredUsers = await User.find({_id:{$ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
} catch (error) {
    console.error("Error in getUsersForSidebar:",error.message);
    res.status(500).json({ error:"Internal server error"});
}
};

export const getMessages = async(req,res) => {
    try {
        
         const { id:UserToChatId} = req.params
        const myId = req.User._id;

        const message = await Message.find({
            $or:[
                {senderId:senderId,receiverId:UserToChatId},
                {senderId:UserToChatId,receiverId:myId}
            ]

        })
        res.status(200).json(messages)
    } catch (error){
       console.log("Error in getMessages controller:", error.message);
       res.status(500).json({error:"Internal srever error"});


    }
};

export const sendMessage = async (req,res) =>{
    try{
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = res.user._id;

        let imageUrl;
        if(image){
            const uploadRespones  = await cloudinary.uploader.upload(image);
            imageUrl = uploadRespones.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        res.status(201).json(newMessage)

    }catch (error) {
        console.log("Error in sendMessage  controller: ",error.message);
        res.status(500).json({ error:"Internal server error"});

    }
}