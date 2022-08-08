import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { GoogleLogin, googleLogout } from '@react-oauth/google';

import { AiOutlineLogout } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';

import { createOrGetUser } from '../utils';
import Logo from '../utils/tiktik-logo.png';

import useAuthStore from '../store/authStore';

const Navbar = () => {
	const { userProfile }: {userProfile: any} = useAuthStore();
	const { addUser, removeUser } = useAuthStore();

	return (
		<div className='w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4'>
			<Link href='/'>
				<div className='w-[100px] md:w-[130px]'>
					<Image
						className='cursor-pointer'
						src={Logo}
						alt='Tiktik logo'
						layout='responsive'
						/>
				</div>
			</Link>

			<div>SEARCH</div>

			<div>
				{userProfile ? (
					<div className='flex gap-5 md:gap-10'>
						<Link href='/upload'>
							<button className='border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2'>
								<IoMdAdd className='text-xl' />{' '}
								<span className='uppercase hidden md:block'>upload</span>
							</button>
						</Link>
						{userProfile.image && (
							<Link href='/'>
								<>
									<Image
										src={userProfile.image}
										alt={'profile photo'}
										width={40}
										height={40}
										className='rounded-full cursor-pointer'
										/>
								</>
							</Link>
						)}
						<button
							type='button'
							className='px-2 hover:bg-gray-200 rounded-full'
							onClick={() => {
								googleLogout();
								removeUser();
							}}
							>
							<AiOutlineLogout color='crimson' fontSize={21} />
						</button>
					</div>
				) : (
					<GoogleLogin
					onSuccess={(response) => createOrGetUser(response, addUser)}
					onError={() => console.log('Error: ')}
					/>
					)}
			</div>
		</div>
	);
};

export default Navbar;
