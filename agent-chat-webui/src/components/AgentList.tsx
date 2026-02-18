import React from 'react';
import { Agent } from '../types';

interface AgentListProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelect: (agent: Agent) => void;
}

export const AgentList: React.FC<AgentListProps> = ({ agents, selectedAgent, onSelect }) => {
  return (
    <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Agents</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelect(agent)}
            className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-800 transition-colors ${
              selectedAgent?.id === agent.id ? 'bg-gray-800' : ''
            }`}
          >
            <div className="text-3xl">{agent.emoji}</div>
            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{agent.name}</span>
                <span className="text-xs text-gray-400">({agent.role})</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${agent.online ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className="text-sm text-gray-400">
                  {agent.online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
