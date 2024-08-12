// Imprts
import Image from 'next/image';
import {useState} from 'react';
import UserTypeSelector from './UserTypeSelector';
import { Button } from './ui/button';
import { removeCollaborator, updateDocumentAccess } from '@/lib/actions/room.actions';





// Main function
const Collaborator = ({roomId, creatorId, collaborator, email, user}:CollaboratorProps) => {

    // States
    const [userType, setUserType] = useState(collaborator.userType || 'viewer');
    const [isLoading, setIsLoading] = useState(false);

    // Share document handler
    const shareDocumentHandler = async (type:string) => {

        // Setting loading to true
        setIsLoading(true);

        // Updating room accesses
        await updateDocumentAccess({
            roomId,
            email,
            userType:type as UserType,
            updatedBy:user
        });

        // Setting is loading to false
        setIsLoading(false);

    };

    // Remove collaborator handler
    const removeCollaboratorHandler = async (email:string) => {

        // setting is loading to true
        setIsLoading(true);

        // Updaeing room accesses
        await removeCollaborator({roomId, email});

        // Setting is loading to false
        setIsLoading(false);

    };

    return (
        <li className='flex items-center justify-between gap-2 py-3'>
            <div className='flex gap-2'>
                <Image
                    src={collaborator.avatar}
                    alt={collaborator.name}
                    width={36}
                    height={36}
                    className='size-9 rounded-full'
                />
                <div>
                    <p className='line-clamp-1 text-sm font-semibold leading-4 text-white'>
                        {collaborator.name}
                        <span className='text-10-regular pl-2 text-blue-100'>
                            {isLoading && 'updating...'}
                        </span>
                    </p>
                    <p className='text-sm font-light text-blue-100'>
                        {collaborator.email}
                    </p>
                </div>
            </div>
            {creatorId === collaborator.id ? (
                <p className='text-sm text-blue-100'>Owner</p>
            ) : (
                <div className='flex items-center'>
                    <UserTypeSelector
                        userType={userType as UserType}
                        setUserType={setUserType || 'viewer'}
                        onClickHandler={shareDocumentHandler}
                    />
                    <Button
                        type='submit'
                        onClick={() => removeCollaboratorHandler(collaborator.email)}
                    >
                        Remove
                    </Button>
                </div>
            )}
        </li>
    );
};





// Export
export default Collaborator;