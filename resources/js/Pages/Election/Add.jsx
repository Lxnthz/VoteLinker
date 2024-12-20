import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head , useForm} from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Add({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description:'',
        jumcalon:'',
        scope:''
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('election.store'));
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Add Election" />

            <h2 className="font-semibold text-3xl text-gray-800 leading-tight flex justify-center mt-10">Add New Election</h2>

            <form onSubmit={submit} className='mx-[100px] px-[45px] flex flex-col gap-5 h-[77vh] justify-center'>
                <div>
                    <InputLabel htmlFor="title" value="Title" />

                    <TextInput
                        id="title"
                        name="title"
                        value={data.title}
                        className="mt-1 block w-full"
                        autoComplete="title"
                        isFocused={true}
                        onChange={(e) => setData('title', e.target.value)}
                        required
                    />

                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="description" value="Description" />

                    <TextInput
                        id="description"
                        name="description"
                        value={data.description}
                        className="mt-1 block w-full"
                        autoComplete="description"
                        isFocused={true}
                        onChange={(e) => setData('description', e.target.value)}
                        required
                    />

                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="scope" value="Scope" />

                    <TextInput
                        id="scope"
                        name="scope"
                        value={data.scope}
                        className="mt-1 block w-full"
                        autoComplete="scope"
                        isFocused={true}
                        onChange={(e) => setData('scope', e.target.value)}
                        required
                    />

                    <InputError message={errors.scope} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="jumcalon" value="Jumlah Candidate" />

                    <TextInput
                        id="jumcalon"
                        name="jumcalon"
                        value={data.jumcalon}
                        className="mt-1 block w-full"
                        autoComplete="jumcalon"
                        isFocused={true}
                        onChange={(e) => setData('jumcalon', e.target.value)}
                        required
                    />

                    <InputError message={errors.jumcalon} className="mt-2" />
                </div>

                
            
                <div className="flex items-center justify-end mt-4">
                    

                    <PrimaryButton className="ms-4 mb-5" disabled={processing}>
                        ADD
                    </PrimaryButton>
                </div>
            </form>
            
        </AuthenticatedLayout>
    );
}
