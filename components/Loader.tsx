// Imports
import Image from 'next/image';
import React from 'react';





// Main function
const Loader = () => {
    return (
        <div className='loader'>
            <Image
                src='/assets/icons/loader.svg'
                alt='Loader'
                width={32}
                height={32}
                className='animate-spin'
            />
            Loading...
        </div>
    );
};





// Export
export default Loader;