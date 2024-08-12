// Imports
import React from 'react';
import {redirect} from 'next/navigation';
import {currentUser} from '@clerk/nextjs/server';
import {getDocument} from '@/lib/actions/room.actions';
import CollaborativeRoom from '@/components/CollaborativeRoom';
import { getClerkUsers } from '@/lib/actions/user.actions';





// Main function
const Document = async ({params:{id}}:SearchParamProps) => {

    // Clerk user
    const clerkUser = await currentUser();
    if(!clerkUser) redirect('/sign-in');
    
    // Room
    const room = await getDocument({roomId:id, userId:clerkUser.emailAddresses[0].emailAddress});
    if(!room) redirect('/');

    // User ids
    const userIds = Object.keys(room.usersAccesses);
    const users = await getClerkUsers({userIds});
    const usersData = users.map((user:User) => ({
        ...user,
        userType:room.usersAccesses[user.email]?.includes('room:write') ? 'editor' : 'viewer'
    }));

    // Current user type
    const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer';

    return (
        <main className='flex w-full flex-col items-center'>
            <CollaborativeRoom
                roomId={id}
                roomMetadata={room.metadata}
                users={usersData}
                currentUserType={currentUserType}
            />
        </main>
    );
};





// Export
export default Document