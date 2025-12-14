const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const { getReciverSocketId, io } = require("../socket/socket");

// create message
exports.createNewMessage = async(req,res)=>{
    try {
        // fetch data
        const {receiverId,message} = req.body;
        const senderId = req.user.userId;

        // validation
        if(!receiverId || !message || !senderId){
            return res.status(400).json({
                success:false,
                message:"Something went wrong during fetchin data"
            })
        }
        
        // find conversation
        let conversation = await Conversation.findOne({
            members:{$all:[senderId,receiverId]}
        });

        if(!conversation){ 
             
            // create conversation
            conversation = await Conversation.create({
                members:[senderId,receiverId]
            })
        }

        const newMessage = new Message({
            senderId:senderId,
            receiverId:receiverId,
            message:message
        });


        if(newMessage){
            conversation.messages.push(newMessage);
        }

        await Promise.all([conversation.save(),newMessage.save()]);

        // implement socket io
        const receiverSocketId = getReciverSocketId(receiverId);

        if(receiverSocketId){
           io.to(receiverSocketId).emit("new-message",newMessage);
        }
        


        // return response
        return res.status(200).json({
            success:true,
            message:"Message send successfully",
            newMessage:newMessage,
        })

        
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success:false,
        message:"Internal Server error"
      })
       
    }
}

// get all messages between both users
exports.getAllMessages  = async(req,res)=>{
    try {

        // fetch data
        const currentUserId = req.user.userId;
        const chatUserId = req.params.chatUserId;

        // validation
        if(!chatUserId || !currentUserId){
            return res.status(400).json({
                success:false,
                message:"Somethimg went wrong during fetching userId's"
            })
        }

        const chatUserDetails = await User.findById(chatUserId);

        if(!chatUserDetails){
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
        }

        const allMessages = await Conversation.findOne({
            members:{$all:[currentUserId,chatUserId]}
        }).populate("messages").populate("members","-password").exec();

        // return response
        return res.status(200).json({
            success:true,
            message:"Successfully fetched all messages",
            allMessages:allMessages ? allMessages?.messages :  [],
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
        })   
    }
}