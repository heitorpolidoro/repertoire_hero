import React from 'react';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div>
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', margin: 0 }}>
            Hello, World!
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#9ca3af', marginTop: '1rem' }}>
            Your new project is ready.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;