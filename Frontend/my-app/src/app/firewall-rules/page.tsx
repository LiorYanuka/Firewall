'use client';

import { useState } from 'react';
import AddRuleComponent from '@/components/firewall/AddRuleComponent';
import ExistingRulesComponent from '@/components/firewall/ExistingRulesComponent';

export default function FirewallRules() {
  const [activeTab, setActiveTab] = useState<'add' | 'existing'>('add');

  return (
    <section className="p-6">
      <h2 className="text-xl font-semibold mb-6">Firewall Rules</h2>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('add')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'add'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Add New Rule
          </button>
          <button
            onClick={() => setActiveTab('existing')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'existing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Existing Rules
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'add' ? (
          <AddRuleComponent />
        ) : (
          <ExistingRulesComponent />
        )}
      </div>
    </section>
  );
}


