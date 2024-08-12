// Imports
import React from 'react';
import Image from 'next/image';
import {useOthers} from '@liveblocks/react/suspense';





// Main function
const ActiveCollaborators = () => {

    // Other users
    const others = useOthers();

    // Collaborators
    const collaborators = others.map((other) => other.info);

    return (
        <ul className='collaborators-list'>
            {collaborators.map(({id, name, avatar, color}) => (
                <li key={id}>
                    <Image
                        src={avatar}
                        alt={name}
                        width={100}
                        height={100}
                        className='inline-block size-8 rounded-full ring-2 ring-dark-100'
                        style={{border:`3px solid ${color}`}}
                    />
                </li>
            ))}
        </ul>
    );
};





// Export
export default ActiveCollaborators;