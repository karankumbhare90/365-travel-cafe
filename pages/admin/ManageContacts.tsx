import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { IoMdTrash } from 'react-icons/io';

interface ContactInquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    created_at: string;
}

const ManageContact: React.FC = () => {

    const [contacts, setContacts] = useState<ContactInquiry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {

        setLoading(true);

        const { data, error } = await supabase
            .from('contact_inquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setContacts(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const deleteContact = async (id: string) => {

        if (!confirm("Delete this inquiry?")) return;

        const { error } = await supabase
            .from('contact_inquiries')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(error);
        } else {
            fetchContacts();
        }

    };

    return (
        <div>

            <h1 className="text-xl lg:text-xl lg:text-3xl font-bold font-serif mb-8">
                Contact Inquiries
            </h1>

            <div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-left border-collapse">

                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase">

                                <th className="p-4 font-bold">Name</th>
                                <th className="p-4 font-bold">Email</th>
                                <th className="p-4 font-bold">Phone</th>
                                <th className="p-4 font-bold">Message</th>
                                <th className="p-4 font-bold">Date</th>
                                <th className="p-4 font-bold text-right">Actions</th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5 text-sm">

                            {loading && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {!loading && contacts.map((contact) => (

                                <tr key={contact.id} className="hover:bg-white/5">

                                    <td className="p-4 text-white font-semibold">
                                        {contact.name}
                                    </td>

                                    <td className="p-4 text-gray-300">
                                        {contact.email}
                                    </td>

                                    <td className="p-4 text-gray-300">
                                        {contact.phone}
                                    </td>

                                    <td className="p-4 text-gray-400 max-w-xs truncate">
                                        {contact.message}
                                    </td>

                                    <td className="p-4 text-gray-400">
                                        {new Date(contact.created_at).toLocaleString()}
                                    </td>

                                    <td className="p-4 text-right">

                                        <button
                                            onClick={() => deleteContact(contact.id)}
                                            className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-black rounded transition"
                                        >
                                            <span className="react-icons text-sm capitalize">
                                                <IoMdTrash/>
                                            </span>
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    {!loading && contacts.length === 0 && (

                        <div className="p-8 text-center text-gray-500">
                            No contact inquiries found.
                        </div>

                    )}

                </div>

            </div>

        </div>
    );

};

export default ManageContact;