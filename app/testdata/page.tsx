'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'


export default function Page() {
    const supabase =  createClient()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [id, setID] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault()
        const {error} =  await supabase.from('customer').insert({id: id, Name: name, email: email})
        if (error) {
            console.log(error)
        } else {
            alert('Customer added successfully')
        }
    }
    return (
        <div>
            <h1>Supabase Client Test</h1>
            <form onSubmit={handleSubmit} className="text-black ml-10"> 
                <input type = "number" placeholder ="ID" value = {id} onChange={(currentID) => setID(Number(currentID.target.value))}></input>
                <input type = "text" placeholder ="Name" value = {name} onChange={(e) => setName(e.target.value)}></input>
                <input type = "email" placeholder ="Email" value = {email} onChange={(e) => setEmail(e.target.value)}></input>
                <button type = "submit">Add Customer</button>
            </form>


        </div>
    )



}
