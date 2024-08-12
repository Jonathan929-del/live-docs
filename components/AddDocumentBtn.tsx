'use client';
// Imports
import React from 'react';
import Image from 'next/image';
import {Button} from './ui/button';
import {useRouter} from 'next/navigation';
import {craeteDocument} from '@/lib/actions/room.actions';





// Main function
const AddDocumentBtn = ({userId, email}:AddDocumentBtnProps) => {

    // Router
    const router = useRouter();

    // Add document handler
    const addDocumentHandler = async () => {
        try {
            const room = await craeteDocument({userId, email});
            if(room) router.push(`/documents/${room.id}`);
        }catch(err){
            console.log(err);  
        };
    };

    return (
        <Button
            type='submit'
            onClick={addDocumentHandler}
            className='gradient-blue flex gap-1 shadow-md'
        >
            <Image
                src='/assets/icons/add.svg'
                alt='Add'
                width={24}
                height={24}
            />
            <p className='hidden sm:block'>
                Start a blank document
            </p>
        </Button>
    );
};





// Export
export default AddDocumentBtn;