'use server';
// Imports
import {parseStringify} from '../utils';
import {liveblocks} from '../liveblocks';
import {clerkClient} from '@clerk/nextjs/server';





// Get clerk users
export const getClerkUsers = async ({userIds}:{userIds:string[]}) => {
    try {

        // Clerk users
        const {data} = await clerkClient.users.getUserList({
            emailAddress:userIds
        });
        const users = data.map((user) => ({
            id:user.id,
            name:`${user.firstName} ${user.lastName}`,
            email:user.emailAddresses[0].emailAddress,
            avatar:user.imageUrl
        }));

        // Sorted users
        const sortedUsers = userIds.map(email => users.find(user => user.email === email));

        // Return
        return parseStringify(sortedUsers);
        
    }catch (err){
        console.log(err);
    };
};





// Get document users
export const getDocumentUsers = async ({roomId, currentUser, text}:{roomId:string, currentUser:string, text:string}) => {
    try {

        // Room
        const room = await liveblocks.getRoom(roomId);

        // Users
        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        // Specific user search
        if(text.length){
            const lowerCaseText = text.toLowerCase();
            const filteredUsers = users.filter((email:string) => email.toLowerCase().includes(lowerCaseText));
            return parseStringify(filteredUsers);
        };

        // Return
        return parseStringify(users);
        
    }catch (err){
        console.log(`Error fetching document users: ${err}`);        
    };
};