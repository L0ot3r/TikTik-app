import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Discover, SuggestedAccounts, Footer } from '../components';

import useAuthStore from '../store/authStore';

import { AiFillHome, AiOutlineMenu } from 'react-icons/ai';
import { ImCancelCircle } from 'react-icons/im';

const Sidebar = () => {
	const [showSidebar, setShowSidebar] = useState(true);

	const { userProfile } = useAuthStore();

	return (
		<div>
			<div
				className='block xl:hidden m-2 ml-4 mt-3 text-xl'
				onClick={() => setShowSidebar((prev) => !prev)}
			>
				{showSidebar ? <ImCancelCircle /> : <AiOutlineMenu />}
			</div>
			{showSidebar && (
				<div className='xl:w-400 w-20 flex flex-col justify-start mb-10 border-r-2 border-gray-100 xl:border-0 p-3'>
					<div className='xl:border-b-2 border-gray-200 xl:pb-4'>
						<Link href='/'>
							<div className={'normalLink'}>
								<p className='text-2xl'>
									<AiFillHome />
								</p>
								<span className='text-xl hidden xl:block'>Pour Vous</span>
							</div>
						</Link>
					</div>
					{!userProfile && (
						<div className='px-2 py-4 hidden xl:block'>
							<p className='text-[#f51997] text-xl'>
								Connectez-vous <br />
								pour Liker et Commenter
							</p>
						</div>
					)}

					<Discover />
					<SuggestedAccounts />
					<Footer />
				</div>
			)}
		</div>
	);
};

export default Sidebar;
