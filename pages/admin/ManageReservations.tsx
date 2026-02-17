import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { MdCheck } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';

const ManageReservations: React.FC = () => {
    const [reservations, setReservations] = useState<any[]>([]);

    const fetchReservations = async () => {
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setReservations(data);
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const updateStatus = async (reservation: any, status: string) => {
        // 1. Update Supabase
        const { error } = await supabase
            .from('reservations')
            .update({ status })
            .eq('id', reservation.id);
    
        if (error) {
            console.error("Supabase update failed:", error);
            return;
        }
    
        // 2. Send to Google Script
        try {
            const form = new FormData();
    
            form.append("action", status); // confirmed OR cancelled
            form.append("name", reservation.passenger_name);
            form.append("email", reservation.email);
            form.append("pax", reservation.pax_count);
            form.append("date", reservation.departure_date);
            form.append("time", reservation.departure_time);
    
            await fetch(import.meta.env.VITE_GOOGLE_SCRIPT_URL, {
                method: "POST",
                body: form
            });
    
        } catch (err) {
            console.error("Script error:", err);
        }
    
        // 3. Refresh list
        fetchReservations();
    };

    return (
        <div>
            <h1 className="text-xl lg:text-xl lg:text-3xl font-bold font-serif mb-8">Flight Manifest (Reservations)</h1>

            <div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden  w-full max-w-full">
                <div className="overflow-x-auto w-full max-w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-wider p-1">
                                <th className="p-1 lg:p-4 font-bold">Passenger</th>
                                <th className="p-1 lg:p-4 font-bold">Contact</th>
                                <th className="p-1 lg:p-4 font-bold">Date & Time</th>
                                <th className="p-1 lg:p-4 font-bold">Pax</th>
                                <th className="p-1 lg:p-4 font-bold">Type</th>
                                <th className="p-1 lg:p-4 font-bold">Status</th>
                                <th className="p-1 lg:p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[10px] lg:text-xs">
                            {reservations.map((res) => (
                                <tr key={res.id} className="hover:bg-white/5 transition-colors p-1">
                                    <td className="p-1 lg:p-4 font-bold text-white">{res.passenger_name}</td>
                                    <td className="p-1 lg:p-4 text-gray-300">{res.contact_number}</td>
                                    <td className="p-1 lg:p-4 text-gray-300">
                                        <div>{res.departure_date}</div>
                                        <div className="text-[10px] text-gray-500">{res.departure_time}</div>
                                    </td>
                                    <td className="p-1 lg:p-4 text-gray-300">{res.pax_count}</td>
                                    <td className="p-1 lg:p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] border ${res.trip_type === 'Birthday' ? 'border-purple-500 text-purple-400' :
                                            res.trip_type === 'Date Night' ? 'border-pink-500 text-pink-400' :
                                                'border-gray-500 text-gray-400'
                                            }`}>
                                            {res.trip_type}
                                        </span>
                                    </td>
                                    <td className="p-1 lg:p-4">
                                        <span className={`font-bold text-[10px] lg:text-xs uppercase ${res.status === 'confirmed' ? 'text-green-500' :
                                            res.status === 'cancelled' ? 'text-red-500' :
                                                'text-yellow-500'
                                            }`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {res.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => updateStatus(res, 'confirmed')} className="p-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-colors" title="Confirm">
                                                    <span className="react-icons text-lg"><MdCheck/></span>
                                                </button>
                                                <button onClick={() => updateStatus(res, 'cancelled')} className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-black transition-colors" title="Cancel">
                                                    <span className="react-icons text-lg"><IoClose/></span>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {reservations.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No reservations found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageReservations;