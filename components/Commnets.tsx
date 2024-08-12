// Imports
import React from 'react';
import {Composer, Thread} from '@liveblocks/react-ui';
import {useThreads} from '@liveblocks/react/suspense';
import { useIsThreadActive } from '@liveblocks/react-lexical';
import { cn } from '@/lib/utils';





// Thread wrapper
const ThreadWrapper = ({thread}:ThreadWrapperProps) => {

    // Is active
    const isActive = useIsThreadActive(thread.id);

    return(
        <Thread
            thread={thread}
            data-state={isActive ? 'active' : null}
            className={cn(
                'comment-thread border',
                isActive && '!border-blue-500 shadow-md',
                thread.resolved && 'opacity-40'
            )}
        />
    );
};





// Main function
const Commnets = () => {

    // Threads
    const {threads} = useThreads();

    return (
        <div className='comments-container'>
            <Composer className='comment-composer'/>
            {threads?.map((thread) => (
                <ThreadWrapper key={thread.id} thread={thread}/>
            ))}
        </div>
    );
};





// Export
export default Commnets;