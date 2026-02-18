import { useState, useEffect } from 'react';
import { Agent, Message } from './types';
import { AgentList } from './components/AgentList';
import { ChatWindow } from './components/ChatWindow';
import { useWebSocket } from './hooks/useWebSocket';

const AGENTS: Agent[] = [
  {
    id: 'main',
    sessionKey: 'agent:main:main',
    name: 'Claw',
    emoji: '🤖',
    role: 'CEO',
    online: true
  },
  {
    id: 'programmery',
    sessionKey: 'agent:programmery:main',
    name: 'ProgrammerY',
    emoji: '👨💻',
    role: 'CTO',
    online: true
  }
];

function App() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const { connected, error, sendAgentMessage } = useWebSocket();

  useEffect(() => {
    // Initialize message arrays for each agent
    const initialMessages: Record<string, Message[]> = {};
    AGENTS.forEach(agent => {
      initialMessages[agent.id] = [];
    });
    setMessages(initialMessages);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!selectedAgent) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [selectedAgent.id]: [...(prev[selectedAgent.id] || []), userMessage]
    }));

    try {
      // Send to agent
      const result = await sendAgentMessage(selectedAgent.sessionKey, text);
      console.log('Agent response:', result);

      // Add agent response
      if (result && result.text) {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: result.text,
          timestamp: new Date()
        };

        setMessages(prev => ({
          ...prev,
          [selectedAgent.id]: [...(prev[selectedAgent.id] || []), agentMessage]
        }));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      // Show error in chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: `❌ Error: ${err instanceof Error ? err.message : 'Failed to send message'}`,
        timestamp: new Date()
      };

      setMessages(prev => ({
        ...prev,
        [selectedAgent.id]: [...(prev[selectedAgent.id] || []), errorMessage]
      }));
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <AgentList
        agents={AGENTS}
        selectedAgent={selectedAgent}
        onSelect={setSelectedAgent}
      />
      <ChatWindow
        agent={selectedAgent}
        messages={selectedAgent ? (messages[selectedAgent.id] || []) : []}
        onSendMessage={handleSendMessage}
        connected={connected}
      />
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Connection Error: {error}
        </div>
      )}
    </div>
  );
}

export default App;
