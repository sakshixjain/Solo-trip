import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
	const [status, setStatus] = useState<string>('Checking...');
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		axios
			.get(`${API_URL}/`)
			.then((res) => {
				if (!mounted) return;
				setStatus(typeof res.data === 'string' ? res.data : JSON.stringify(res.data));
			})
			.catch((err) => {
				if (!mounted) return;
				setError(err.message || 'Error');
				setStatus('Unavailable');
			});
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div style={{ padding: 20, fontFamily: 'system-ui, Arial' }}>
			<h1>Dashboard</h1>
			<p>
				<strong>API base:</strong> {API_URL}
			</p>
			<p>
				<strong>Health:</strong> {status}
			</p>
			{error && (
				<p style={{ color: 'crimson' }}>
					<strong>Error:</strong> {error}
				</p>
			)}

			<div style={{ marginTop: 20 }}>
				<Link to="/login" style={{ marginRight: 12 }}>
					Go to Login
				</Link>
				<Link to="/register" style={{ marginRight: 12 }}>
					Go to Register
				</Link>
			</div>

			<section style={{ marginTop: 28 }}>
				<h3>How it works</h3>
				<ol>
					<li>Start the backend: it listens on port 3000 by default.</li>
					<li>Open this Dashboard to confirm the API root responds.</li>
					<li>Use the Register/Login pages to create and sign in users.</li>
				</ol>
			</section>
		</div>
	);
}
