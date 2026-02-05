import React from 'react'

const layout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <div className='w-full h-dvh bg-white flex justify-center items-center text-black'>
            {children}
        </div>
    )
}

export default layout