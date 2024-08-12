'use server';
// Imports
import {nanoid} from 'nanoid';
import {getAccessType, parseStringify} from '../utils';
import {liveblocks} from '../liveblocks';
import {revalidatePath} from 'next/cache';
import { redirect } from 'next/navigation';





// Creacte document
export const craeteDocument = async ({userId, email}:CreateDocumentParams) => {
    try {

        // Creating room
        const roomId = nanoid();
        const metadata = {
            creatorId:userId,
            email,
            title:'Untitled'
        };
        const usersAccesses:RoomAccesses = {
            [email]:['room:write']
        };
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses:[]
        });          
        revalidatePath('/');

        // Return
        return parseStringify(room);

    }catch(err){
        console.log(`Error while creating a room: ${err}`)
    };
};





// Get document
export const getDocument = async ({roomId, userId}:{roomId:string;userId:string;}) => {
    try {

        // Room
        const room = await liveblocks.getRoom(roomId);

        // Has access
        const hasAccess = Object.keys(room.usersAccesses).includes(userId);
        if(!hasAccess){
            throw new Error("You don't have access to this document");
        };

        // Return
        return parseStringify(room);

    }catch (err){
        console.log('Error happened while getting the room', err);
    };
};





// Update function
export const updateDocument = async (roomId:string, title:string) => {
    try {
        
        // Updated room
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata:{
                title
            }
        });

        // Revalidate path
        revalidatePath(`/documents/${roomId}`);

        // Return
        return updatedRoom;

    }catch(err){
        console.log('Error happened while updating a room', err);
    };
};





// Get documents
export const getDocuments = async ({email}:{email:string;}) => {
    try {

        // Room
        const rooms = await liveblocks.getRooms({userId:email});

        // Return
        return parseStringify(rooms);

    }catch (err){
        console.log('Error happened while getting the rooms', err);
    };
};





// Update document access
export const updateDocumentAccess = async ({roomId, email, userType, updatedBy}:ShareDocumentParams) => {
    try {

        // Users accesses
        const usersAccesses:RoomAccesses = {
            [email]:getAccessType(userType) as AccessType
        };

        // Room
        const room = await liveblocks.updateRoom(roomId, {
            usersAccesses
        });
        if(room){
            const notificationId = nanoid();
            await liveblocks.triggerInboxNotification({
                userId:email,
                kind:'$documentAccess',
                subjectId:notificationId,
                activityData:{
                    userType,
                    title:`You have been granted ${userType} access to the document by ${updatedBy.name}`,
                    updatedBy:updatedBy.name,
                    avatar:updatedBy.avatar,
                    email:updatedBy.email
                },
                roomId
            });
        };

        // Revalidate path
        revalidatePath(`/documents/${roomId}`);

        // Return
        return parseStringify(room);
        
    }catch(err){
        console.log(`Error happened while updating a room access: ${err}`);  
    };
};





// Remove collaborator
export const removeCollaborator = async ({roomId, email}:{roomId:string, email:string}) => {
    try {
        
        // Room
        const room = await liveblocks.getRoom(roomId);

        // Removing self from room validation
        if(room.metadata.email === email){
            throw new Error('You canoot remove youself from the document');
        };

        // Updating room accesses
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses:{
                [email]:null
            }
        });

        // Revalidate path
        revalidatePath(`/documents/${roomId}`);

        // Return
        return updatedRoom

    }catch(err){
        console.log(`Error happened while removing a collaborator: ${err}`);  
    };
};





// Delete document
export const deleteDocument = async (roomId:string) => {
    try {

        // Deleting the room
        liveblocks.deleteRoom(roomId);

        // Redirection
        revalidatePath('/');
        redirect('/');
        
    }catch(err){
        console.log(`Error happened while deleting a room: ${err}`);
    };
};