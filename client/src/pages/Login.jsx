import React from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/axios'
import socket, { connect } from '../api/socket'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();
  const onSubmit = async (data) => {
    const payload = { email: (data.email || '').trim(), password: (data.password || '').trim() };
    if (!payload.email || !payload.password) { alert('Email and password are required'); return; }
    try {
      const res = await api.post('/auth/login', payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // connect socket and authenticate
      try { connect(); socket.emit('authenticate', res.data.token); } catch (e) { console.warn('socket auth failed', e); }
      nav('/dashboard');
    } catch (err) { alert(err.response?.data?.error || 'Login failed'); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Sign in</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('email')} className="w-full p-2 border mb-2" placeholder="Email" />
          <input {...register('password')} className="w-full p-2 border mb-2" placeholder="Password" type="password" />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
        </form>
      </div>
    </div>
  )
}
