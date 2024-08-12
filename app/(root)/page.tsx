// Imports
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import {redirect} from 'next/navigation';
import {dateConverter} from '@/lib/utils';
import {currentUser} from '@clerk/nextjs/server';
import {SignedIn, UserButton} from '@clerk/nextjs';
import {DeleteModal} from '@/components/DeleteModal';
import Notifications from '@/components/Notifications';
import {getDocuments} from '@/lib/actions/room.actions';
import AddDocumentBtn from '@/components/AddDocumentBtn';





// Main function
const page = async () => {

  // Clerk user
  const user = await currentUser();

  // Redirection
  if(!user) redirect('/sign-in')

  // Documents
  const documents = await getDocuments({email:user.emailAddresses[0].emailAddress});

  return (
    <main className='home-container'>

      {/* Header */}
      <Header className='sticky left-0 top-0'>
        <div className='flex items-center gap-2 lg:gap-4'>
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {/* Documents */}
      {documents.data.length > 0 ? (
        <div className='document-list-container'>
          <div className='document-list-title'>
            <h3 className='text-28-semibold'>All documents</h3>
            <AddDocumentBtn
              userId={user.id}
              email={user.emailAddresses[0].emailAddress}
            />            
          </div>
          <ul className='document-ul'>
            {documents.data.map(({id, metadata, createdAt}:any) => (
              <li key={id} className='document-list-item'>
                <Link
                  href={`/documents/${id}`}
                  className='flex flex-1 items-center gap-4'
                >
                  <div className='hidden rounded-md bg-dark-500 p-2 sm:block'>
                    <Image
                      src='/assets/icons/doc.svg'
                      alt='File'
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className='space-y-1'>
                    <p className='line-clamp-1 text-lg'>{metadata.title}</p>
                    <p className='text-sm font-light text-blue-100'>Created about {dateConverter(createdAt)}</p>
                  </div>
                </Link>
                <DeleteModal roomId={id}/>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className='document-list-empty'>
          <Image
            src='/assets/icons/doc.svg'
            alt='Document'
            height={40}
            width={40}
            className='mx-auto'
          />
          <AddDocumentBtn
            userId={user.id}
            email={user.emailAddresses[0].emailAddress}
          />
        </div>
      )}

    </main>
  );
};





// Export
export default page;