import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import axios from 'axios';
import useAuthStore from '../store/authStore';
import { client } from '../utils/client';
import { SanityAssetDocument } from '@sanity/client';

import { topics } from '../utils/constants';

const Upload = () => {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [videoAsset, setVideoAsset] = useState<
		SanityAssetDocument | undefined
	>();
	const [wrongFileType, setWrongFileType] = useState(false);
	const [caption, setCaption] = useState('');
	const [category, setCategory] = useState(topics[0].name);
	const [savingPost, setSavingPost] = useState(false);

	const { userProfile }: { userProfile: any } = useAuthStore();

	const uploadVideo = async (e: any) => {
		const selectedFile = e.target.files[0];
		const fileTypes = ['video/mp4', 'video/webm', 'video/ogg'];

		if (fileTypes.includes(selectedFile.type)) {
			client.assets
				.upload('file', selectedFile, {
					contentType: selectedFile.type,
					filename: selectedFile.name,
				})
				.then((data) => {
					setVideoAsset(data);
					setIsLoading(false);
				});
		} else {
			setIsLoading(false);
			setWrongFileType(true);
		}
	};

	const handlePost = async () => {
		if (caption && videoAsset?._id && category) {
			setSavingPost(true);

			const document = {
				_type: 'post',
				caption,
				video: {
					_type: 'file',
					asset: {
						_type: 'reference',
						_ref: videoAsset?._id,
					},
				},
				userId: userProfile?._id,
				postedBy: {
					_type: 'postedBy',
					_ref: userProfile?._id,
				},
				topic: category,
			};

			await axios.post('http://localhost:3000/api/post', document);

			router.push('/');
		}
	};

	return (
		<div className='flex w-full h-full absolute left-0 top-[60px] mb-10 pt-10 lg:pt-20 bg-[#f8f8f8] justify-center'>
			<div className='bg-white rounded-lg lg:h-[80vh] lg:w-[960px] flex gap-6 flex-wrap lg:justify-between justify-center items-center p-14 pt-6'>
				<div>
					<div>
						<p className='text-2xl font-bold'>Upload Video</p>
						<p className='text-md text-gray-400 mt-1'>
							Poster une vidéo sur votre compte
						</p>
					</div>
					<div className='border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[460px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100'>
						{isLoading ? (
							<p className='text-lg text-green-700 animate-pulse'>
								Envois en cours...
							</p>
						) : (
							<div>
								{videoAsset ? (
									<div>
										<video
											src={videoAsset.url}
											loop
											controls
											className='rounded-xl h-[400px] bg-black'
										></video>
									</div>
								) : (
									<label className='cursor-pointer'>
										<div className='flex flex-col items-center justify-center h-full'>
											<div className='flex flex-col items-center justify-center'>
												<p className='font-bold text-xl'>
													<FaCloudUploadAlt className='text-gray-300 text-6xl' />
												</p>
												<p className='text-xl font-semibold'>
													Evoyer une vidéo
												</p>
											</div>
											<p className='text-gray-400 text-center mt-10 text-sm leading-7'>
												MP4 or WebM or OGG <br />
												720x1280 or higher <br />
												Up to 10 mintutes <br />
												Less than 2GB
											</p>
											<p className='bg-[#F51997] text-center mt-10 rounded text-white p-2 w-52'>
												Choisir un fichier
											</p>
										</div>
										<input
											type='file'
											name='upload-video'
											onChange={uploadVideo}
											className='w-0 h-0'
										/>
									</label>
								)}
							</div>
						)}
						{wrongFileType && (
							<p className='text-center text-xl text-red-400 font-semibold mt-4 w-[250px]'>
								Veuillez selectionner une vidéo
							</p>
						)}
					</div>
				</div>

				<div className='flex flex-col gap-3 pb-10'>
					<label className='font-medium'>Caption</label>
					<input
						type='text'
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
						className='rounded outline-none text-md border-2 border-gray-200 p-2'
					/>
					<label className='font-medium'>Choisissez categorie</label>
					<select
						onChange={(e) => setCategory(e.target.value)}
						className='outline-none capitalize border-2 border-gray-200 p-2 rounded cursor-pointer'
					>
						{topics.map((topic: any) => (
							<option
								value={topic.name}
								key={topic.name}
								className='outline-none capitalize bg-white text-gray-700'
							>
								{topic.name}
							</option>
						))}
					</select>
					<div className='flex gap-6 mt-10'>
						<button
							onClick={() => {}}
							type='button'
							className='border-[#f51997] text-[#f51997] border font-medium p-2 rounded w-28 lg:w-44 outline-none'
						>
							Annuler
						</button>
						<button
							onClick={handlePost}
							type='button'
							className='bg-[#f51997] text-white font-medium p-2 rounded w-28 lg:w-44 outline-none'
						>
							Envoyer
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Upload;
