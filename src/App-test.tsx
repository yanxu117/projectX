import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex h-screen bg-gray-900 items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl text-white font-bold mb-4">🤖 Agent Chat WebUI</h1>
        <p className="text-xl text-gray-400 mb-8">Test Page</p>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clicked {count} times
        </button>
      </div>
    </div>
  );
}

export default App;
