'use client';
// Imports
import Loader from './Loader';
import Image from 'next/image';
import {Input} from './ui/input';
import Header from '@/components/Header';
import {Editor} from '@/components/editor/Editor';
import ActiveCollaborators from './ActiveCollaborators';
import React, {useEffect, useRef, useState} from 'react';
import {SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/nextjs';
import {ClientSideSuspense, RoomProvider} from '@liveblocks/react/suspense';
import { updateDocument } from '@/lib/actions/room.actions';
import ShareModal from './ShareModal';





// Main function
const CollaborativeRoom = ({roomId, roomMetadata, users, currentUserType}:CollaborativeRoomProps) => {

    // States
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    // Update title handler
    const updateTitleHandler = async (e:React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            setIsLoading(true);
            try {
                if(documentTitle !== roomMetadata.title){
                    const updatedDocument = await updateDocument(roomId, documentTitle);
                    if(updatedDocument){
                        setIsEditing(false);
                    };
                };
            }catch (err){
                console.log(err);
            };
            setIsLoading(false);
        };
    };

    // Use effects
    useEffect(() => {
        const handleClickOutside = (e:MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(e.target as Node)){
                setIsEditing(false);
                updateDocument(roomId, documentTitle);
            };
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [roomId, documentTitle]);
    useEffect(() => {
        if(isEditing && inputRef.current){
            inputRef.current.focus();
        }
    }, [isEditing]);

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <div className='collaborative-room'>
                    <Header>
                        <div
                            ref={containerRef}
                            className='flex w-fit items-center justify-center gap-2'
                        >
                            {isEditing && !isLoading ? (
                                <Input
                                    type='input'
                                    placeholder='Enter title'
                                    // @ts-ignore
                                    ref={inputRef}
                                    value={documentTitle}
                                    onChange={(e) => setDocumentTitle(e.target.value)}
                                    onKeyDown={updateTitleHandler}
                                    disabled={!isEditing}
                                    className='document-title-input'
                                />
                            ) : (
                                <p className='document-title'>{documentTitle}</p>
                            )}
                            {currentUserType === 'editor' && !isEditing && (
                                <Image
                                    src='/assets/icons/edit.svg'
                                    alt='Edit'
                                    width={24}
                                    height={24}
                                    className='pointer'
                                    onClick={() => setIsEditing(true)}
                                />
                            )}
                            {currentUserType !== 'editor' && !isEditing && (
                                <p className='view-only-tag'>View only</p>
                            )}
                            {isLoading && <p className='text-sm text-gray-400'>Saving...</p>}
                        </div>
                        <div className='flex w-full flex-1  justify-end gap-2 sm:gap-3'>
                            <ActiveCollaborators />
                            <ShareModal
                                roomId={roomId}
                                collaborators={users}
                                creatorId={roomMetadata.creatorId}
                                currentUserType={currentUserType}
                            />
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Header>
                    <Editor
                        roomId={roomId}
                        currentUserType={currentUserType}
                    />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    );
};





// Export
export default CollaborativeRoom;