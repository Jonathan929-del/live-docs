'use client';
// Imports
import React from 'react';
import {useUser} from '@clerk/nextjs';
import Loader from '@/components/Loader';
import {getClerkUsers, getDocumentUsers} from '@/lib/actions/user.actions';
import {LiveblocksProvider, ClientSideSuspense} from '@liveblocks/react/suspense';





// Main function
const Provider = ({children}:{children:React.ReactNode}) => {

    // Clerk user
    const {user:clerkUser} = useUser();

    return (
        <LiveblocksProvider
            authEndpoint='/api/liveblocks-auth'
            resolveUsers={async ({userIds}) => {
                const users = await getClerkUsers({userIds});
                return users;
            }}
            resolveMentionSuggestions={async ({text, roomId}) => {
                const roomUsers = await getDocumentUsers({
                    roomId,
                    currentUser:clerkUser?.emailAddresses[0].emailAddress!,
                    text,
                });
                return roomUsers;
            }}
        >
            <ClientSideSuspense fallback={<Loader />}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    );
};





// Export
export default Provider;