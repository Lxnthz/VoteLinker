import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import React from 'react';
import axios from 'axios';

export default function ElectionDetails({ auth, election, candidates, acctovote }) {
    const { data, setData, post, processing, errors } = useForm({
        idElection: election.id,
        idCandidate: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ vision: '', mission: '' });

    const submitVote = () => {
        const isConfirmed = window.confirm("Are you sure you want to submit your vote?");
        
        if (isConfirmed) {
            post(route('election.vote')); 
        }
    };

    const handleVote = (candidateId) => {
        setData('idElection', data.id); 
        setData('idCandidate', candidateId);
    };

    const handleOpenModal = (vision, mission) => {
        setModalContent({ vision, mission });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (confirm('Apakah kamu yakin menghapus candidate ini? hasil election akan tereset')) {
            try {
                await axios.delete(`/candidate/delete/${id}`, {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Authorization': `Bearer ${auth.user.token}`,
                    },
                });
                alert('Candidate berhasil dihapus');
                window.location.reload();
            } catch (error) {
                console.error('error woy!', error);
                alert('Gagal menghapus candidate.');
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Election" />
            <div className="py-10 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden sm:rounded-lg flex flex-col justify-center items-center border border-gray-300 shadow-xl bg-white">
                        <div className="bg-[#282D56] p-4 w-full flex justify-between items-center rounded-t-lg">
                            <div>
                                {election.IsPublicResult || auth.user.role === "admin" ? (
                                    <div className='font-bold text-white'>
                                        <div>{election.Scope}</div>
                                        <div>Pemilih Terdaftar: {election.TotalVoter}</div>
                                        <a href={route('election.result', {id: election.id})} className="text-blue-300 underline">Lihat Hasil</a>
                                    </div>
                                ) : (
                                    <div className='hidden'></div>
                                )}
                            </div>
                            <div className='text-center'>
                                <div className="text-white text-4xl font-extrabold">{election.Title}</div>
                                <div className="text-white text-xl font-bold">{election.Description}</div>
                            </div>
                            <div>
                                {auth.user.role === "admin" ? (
                                    <div className='font-bold text-white flex flex-col items-end'>
                                        <a href={route('election.edit', {id: election.id})} className="text-blue-300 underline">Edit Election</a>
                                        <a href={route('candidate.add', {id: election.id})} className="text-blue-300 underline mt-2">Tambah Candidate</a>
                                    </div>
                                ) : (
                                    <div className='hidden'></div>
                                )}
                            </div>
                        </div>
                        <div className='min-h-[70vh] w-full p-4'>
                        <ul className='flex flex-wrap justify-center gap-4'>
                            {candidates.map((candidate) => (
                                <li 
                                    className='font-bold rounded-lg p-4 bg-white border border-gray-300 shadow-lg flex flex-col gap-4 w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-16px)] transition-transform transform hover:scale-105 hover:shadow-2xl' 
                                    key={candidate.id}
                                >
                                    <div className='flex flex-col gap-2'>
                                        {candidate.Photo && (
                                            <div className='flex justify-center'>
                                                <img
                                                    src={`/storage/${candidate.Photo}`} 
                                                    alt={`${candidate.Chairman}`} 
                                                    className="w-[200px] h-[200px] object-cover rounded-md" 
                                                />
                                            </div>
                                        )}
                                        <div className='bg-blue-100 p-4 rounded-md'>
                                            <div>Ketua: {candidate.Chairman}</div>
                                            <div>Wakil Ketua: {candidate.DeputyChairman}</div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex justify-center'>
                                            <button
                                                className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
                                                onClick={() => handleOpenModal(candidate.Vision, candidate.Mision)}
                                            >
                                                Lihat Visi & Misi
                                            </button>
                                            {auth.user.role === "admin" && (
                                                <a className='ml-2 bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50' href={route('candidate.edit', {id: candidate.id})}>
                                                    Edit Candidate
                                                </a>
                                            )}
                                        </div>
                                        {auth.user.role === "admin" && (
                                            <button 
                                                onClick={() => handleDelete(candidate.id)} 
                                                className='mt-2 p-1 px-2 w-fit bg-[#E10000] rounded-md text-white'>
                                                DELETE
                                            </button>
                                        )}
                                    </div>
                                    {(acctovote && auth.user.role === "voter") ? (
                                        <div className='flex justify-center mt-2'>
                                            <PrimaryButton
                                                onClick={() => handleVote(candidate.SerialNumber)}
                                            >
                                                Vote
                                            </PrimaryButton>
                                        </div>
                                    ) : (<div className='hidden'></div>)}
                                </li>
                            ))}
                        </ul>
                        </div>
                        <div className='flex mb-4'>
                            {(acctovote && auth.user.role === "voter") ? (
                                <PrimaryButton onClick={submitVote} disabled={processing}>
                                    Submit Vote
                                </PrimaryButton>
                            ) : (<div className='hidden'></div>)} 
                        </div>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`bg-white rounded-lg p-6 w-full max-w-lg transform transition-transform duration-300 ${isModalOpen ? 'scale-100' : 'scale-95'}`}>
                        <h2 className="text-2xl font-bold mb-4">Visi & Misi</h2>
                        <div className="mb-4">
                            <h3 className="font-bold">Visi:</h3>
                            <p>{modalContent.vision}</p>
                        </div>
                        <div>
                            <h3 className="font-bold">Misi:</h3>
                            <p>{modalContent.mission}</p>
                        </div>
                        <button
                            className="mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            onClick={handleCloseModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            </div>
        </AuthenticatedLayout>
    );
}
