import React, { useState } from 'react';
import { Eye, MessageCircle, Users, Ticket, Plus, Check } from 'lucide-react';

// Sample groups data
const initialGroups = [
  { id: 1, name: 'HR Interested', count: 12 },
  { id: 2, name: 'Payroll Prospects', count: 8 },
  { id: 3, name: 'Task Management Leads', count: 15 },
  { id: 4, name: 'Follow-up Required', count: 6 },
];

// Sample leads data with source tracking and response status
const initialLeadsData = [
  {
    id: 1,
    company: 'SSM Logistics',
    source: 'whatsapp_flow',
    utm_source: 'whatsapp',
    contact: 'michaelbolton85@gmail.com',
    phone: '+919856746546',
    size: '10-30 employees',
    interests: ['Task delegation + Productivity'],
    captured: '24 Dec 2025, 03:29 pm',
    status: 'New',
    optedOut: false,
    optOutDate: null,
    lastContacted: null,
    responseStatus: null // null, 'interested', 'not_interested', 'no_response'
  },
  {
    id: 2,
    company: 'Opto',
    source: 'manual',
    utm_source: 'dashboard',
    contact: 'hagerhussien956@gmail.com',
    phone: '+919876543210',
    size: '10-30 employees',
    interests: ['download'],
    captured: '23 Dec 2025, 10:37 pm',
    status: 'Not Interested', // User clicked Stop
    optedOut: true,
    optOutDate: '23 Dec 2025, 11:15 pm',
    lastContacted: '23 Dec 2025, 10:45 pm',
    responseStatus: 'not_interested'
  },
  {
    id: 3,
    company: 'TechFlow',
    source: 'whatsapp_flow',
    utm_source: 'whatsapp',
    contact: 'moataz.noaman12@gmail.com',
    phone: '+919123456789',
    size: '10-30 employees',
    interests: ['HR Attendance + Payroll', 'Task delegation + Productivity'],
    captured: '22 Dec 2025, 06:18 pm',
    status: 'In Conversation',
    optedOut: false,
    optOutDate: null,
    lastContacted: '22 Dec 2025, 07:00 pm',
    responseStatus: 'interested'
  },
  {
    id: 4,
    company: 'ABC Corp',
    source: 'manual',
    utm_source: 'google_ads',
    contact: 'soumyadeepgoswami93@gmail.com',
    phone: '+918765432109',
    size: '10-30 employees',
    interests: ['Marketing'],
    captured: '22 Dec 2025, 11:53 am',
    status: 'Not Interested',
    optedOut: true,
    optOutDate: '22 Dec 2025, 12:30 pm',
    lastContacted: '22 Dec 2025, 12:00 pm',
    responseStatus: 'not_interested'
  },
  {
    id: 5,
    company: 'DataSync',
    source: 'manual',
    utm_source: 'linkedin',
    contact: 'john.doe@gmail.com',
    phone: '+917654321098',
    size: '10-30 employees',
    interests: ['Marketing', 'Sales'],
    captured: '21 Dec 2025, 09:49 pm',
    status: 'Contacted',
    optedOut: false,
    optOutDate: null,
    lastContacted: '21 Dec 2025, 10:30 pm',
    responseStatus: 'no_response'
  },
  {
    id: 6,
    company: 'CloudBase',
    source: 'whatsapp_flow',
    utm_source: 'whatsapp',
    contact: 'sarah.smith@gmail.com',
    phone: '+916543210987',
    size: '10-30 employees',
    interests: ['Human Resources', 'Customer Support'],
    captured: '20 Dec 2025, 09:49 pm',
    status: 'New',
    optedOut: false,
    optOutDate: null,
    lastContacted: null,
    responseStatus: null
  }
];

// Templates for MANUAL/COLD leads (with action buttons)
const coldTemplates = [
  {
    id: 'intro_optin',
    name: 'Introduction (with Opt-in)',
    message: `Hi {{name}} 👋

I'm reaching out from EasyDo - we help companies like {{company}} streamline HR & employee management.

Based on your company size, I think we could help you save time on {{interest}}.

Would you like to learn more?`,
    buttons: [
      { id: 'assist', text: '💬 Assist Me', type: 'quick_reply', action: 'interested' },
      { id: 'stop', text: '🛑 Stop', type: 'quick_reply', action: 'not_interested' }
    ]
  },
  {
    id: 'value_prop',
    name: 'Value Proposition',
    message: `Hi {{name}} 👋

Companies with {{size}} employees often struggle with attendance tracking and payroll.

EasyDo automates this completely - would you like to see how?`,
    buttons: [
      { id: 'start_chat', text: '✅ Start Chat', type: 'quick_reply', action: 'interested' },
      { id: 'not_interested', text: '❌ Not Interested', type: 'quick_reply', action: 'not_interested' }
    ]
  },
  {
    id: 'quick_demo',
    name: 'Quick Demo Offer',
    message: `Hi {{name}} from {{company}} 👋

I'd love to show you a 5-minute demo of how EasyDo can help with {{interest}}.

No commitment - just a quick walkthrough. Interested?`,
    buttons: [
      { id: 'yes_demo', text: '👍 Yes, Show Me', type: 'quick_reply', action: 'interested' },
      { id: 'no_thanks', text: '👎 No Thanks', type: 'quick_reply', action: 'not_interested' }
    ]
  }
];

// Templates for WHATSAPP/WARM leads (24hr session - human agent)
const warmTemplates = [
  {
    id: 'followup_interest',
    name: 'Follow-up on Interest',
    message: `Hi {{name}} 👋

Thanks for your interest in EasyDo's {{interest}} solutions!

How can I assist you today? I'm here to answer any questions.`,
    type: 'session_message',
    agent: true
  },
  {
    id: 'continue_conversation',
    name: 'Continue Conversation',
    message: `Hi {{name}} 👋

I noticed you were exploring our {{interest}} features for {{company}}.

What specific challenges are you trying to solve? I'd love to help!`,
    type: 'session_message',
    agent: true
  },
  {
    id: 'personalized_help',
    name: 'Personalized Help',
    message: `Hi {{name}} 👋

For a {{size}} company like {{company}}, here's what I'd recommend looking at first:

→ {{interest}}

Want me to walk you through how this would work for your team?`,
    type: 'session_message',
    agent: true
  }
];

export default function LeadCRMPrototype() {
  const [leadsData, setLeadsData] = useState(initialLeadsData);
  const [groups, setGroups] = useState(initialGroups);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showChatScreen, setShowChatScreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupModalTab, setGroupModalTab] = useState('existing'); // 'existing' or 'new'
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketData, setTicketData] = useState({
    title: '',
    priority: 'low',
    nextFollowUp: '',
    description: ''
  });
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [addLeadStep, setAddLeadStep] = useState(1);
  const [addLeadFormData, setAddLeadFormData] = useState({
    companyName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    companySize: '',
    interests: []
  });

  const resetFlow = () => {
    setSelectedLead(null);
    setShowDetailModal(false);
    setShowChatScreen(false);
    setSelectedTemplate(null);
    setShowConfirm(false);
    setShowSuccess(false);
  };

  const openTicketModal = (lead, e) => {
    if (e) e.stopPropagation();
    setSelectedLead(lead);
    setShowTicketModal(true);
    setTicketData({
      title: '',
      priority: 'low',
      nextFollowUp: '',
      description: ''
    });
  };

  const closeTicketModal = () => {
    setShowTicketModal(false);
    setTicketData({
      title: '',
      priority: 'low',
      nextFollowUp: '',
      description: ''
    });
  };

  const handleCreateTicket = () => {
    // In production, this would create the ticket in your system
    console.log('Creating ticket:', { lead: selectedLead, ...ticketData });
    closeTicketModal();
  };

  const openAddLeadModal = () => {
    setShowAddLeadModal(true);
    setAddLeadStep(1);
    setAddLeadFormData({
      companyName: '',
      email: '',
      countryCode: '+91',
      phone: '',
      companySize: '',
      interests: []
    });
  };

  const closeAddLeadModal = () => {
    setShowAddLeadModal(false);
    setAddLeadStep(1);
    setAddLeadFormData({
      companyName: '',
      email: '',
      countryCode: '+91',
      phone: '',
      companySize: '',
      interests: []
    });
  };

  const handleNextStep = () => {
    if (addLeadStep < 3) {
      setAddLeadStep(addLeadStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (addLeadStep > 1) {
      setAddLeadStep(addLeadStep - 1);
    }
  };

  const handleInterestToggle = (interest) => {
    setAddLeadFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAddLead = () => {
    const newLead = {
      id: leadsData.length + 1,
      company: addLeadFormData.companyName,
      source: 'manual',
      utm_source: 'dashboard',
      contact: addLeadFormData.email,
      phone: `${addLeadFormData.countryCode} ${addLeadFormData.phone}`,
      size: addLeadFormData.companySize,
      interests: addLeadFormData.interests,
      captured: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      status: 'New',
      optedOut: false,
      optOutDate: null,
      lastContacted: null,
      responseStatus: null
    };
    setLeadsData([...leadsData, newLead]);
    closeAddLeadModal();
  };

  const openGroupModal = (lead, e) => {
    if (e) e.stopPropagation();
    setSelectedLead(lead);
    setShowGroupModal(true);
    setGroupModalTab('existing');
    setNewGroupName('');
    setSelectedGroup(null);
  };

  const closeGroupModal = () => {
    setShowGroupModal(false);
    setNewGroupName('');
    setSelectedGroup(null);
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: groups.length + 1,
        name: newGroupName.trim(),
        count: 1
      };
      setGroups([...groups, newGroup]);
      closeGroupModal();
    }
  };

  const handleAddToExistingGroup = () => {
    if (selectedGroup) {
      setGroups(groups.map(g => 
        g.id === selectedGroup.id 
          ? { ...g, count: g.count + 1 }
          : g
      ));
      closeGroupModal();
    }
  };

  const openLeadDetail = (lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const startChat = () => {
    setShowDetailModal(false);
    setShowChatScreen(true);
  };

  const getPersonalizedMessage = (template) => {
    if (!template || !selectedLead) return '';
    const name = selectedLead.contact.split('@')[0].split('.')[0];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    return template.message
      .replace(/\{\{name\}\}/g, capitalizedName)
      .replace(/\{\{company\}\}/g, selectedLead.company)
      .replace(/\{\{size\}\}/g, selectedLead.size)
      .replace(/\{\{interest\}\}/g, selectedLead.interests[0] || 'HR solutions');
  };

  const handleSend = () => {
    // Update lead status to Contacted
    setLeadsData(prev => prev.map(lead => 
      lead.id === selectedLead.id 
        ? { ...lead, status: 'Contacted', lastContacted: new Date().toLocaleString() }
        : lead
    ));
    setShowConfirm(false);
    setShowSuccess(true);
  };

  // Simulate webhook response (Stop button clicked)
  const simulateOptOut = (leadId) => {
    setLeadsData(prev => prev.map(lead => 
      lead.id === leadId 
        ? { 
            ...lead, 
            status: 'Not Interested', 
            optedOut: true, 
            optOutDate: new Date().toLocaleString(),
            responseStatus: 'not_interested'
          }
        : lead
    ));
  };

  // Simulate webhook response (Assist Me clicked)
  const simulateOptIn = (leadId) => {
    setLeadsData(prev => prev.map(lead => 
      lead.id === leadId 
        ? { 
            ...lead, 
            status: 'Interested', 
            responseStatus: 'interested'
          }
        : lead
    ));
  };

  const isWarmLead = (lead) => lead.source === 'whatsapp_flow';
  const isColdLead = (lead) => lead.source === 'manual';

  const getStatusBadge = (status, optedOut) => {
    if (optedOut || status === 'Not Interested') {
      return { label: 'Not Interested', color: 'bg-red-100 text-red-700 border-red-200' };
    }
    switch (status) {
      case 'New':
        return { label: 'New', color: 'bg-green-100 text-green-700 border-green-200' };
      case 'Contacted':
        return { label: 'Contacted', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'In Conversation':
        return { label: 'In Conversation', color: 'bg-purple-100 text-purple-700 border-purple-200' };
      case 'Interested':
        return { label: 'Interested', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const getSourceBadge = (source, utm) => {
    if (source === 'whatsapp_flow') {
      return { label: 'WhatsApp', color: 'bg-green-100 text-green-700 border-green-200' };
    }
    if (utm === 'google_ads') {
      return { label: 'Google Ads', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    }
    if (utm === 'linkedin') {
      return { label: 'LinkedIn', color: 'bg-sky-100 text-sky-700 border-sky-200' };
    }
    return { label: 'Manual', color: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter leads based on active filter and search
  const getFilteredLeads = () => {
    let filtered = leadsData;
    
    // Apply status filter
    if (activeFilter === 'New') {
      filtered = filtered.filter(l => l.status === 'New');
    } else if (activeFilter === 'Contacted') {
      filtered = filtered.filter(l => l.status === 'Contacted');
    } else if (activeFilter === 'Qualified') {
      filtered = filtered.filter(l => l.status === 'Qualified' || l.responseStatus === 'interested');
    } else if (activeFilter === 'Converted') {
      filtered = filtered.filter(l => l.status === 'Converted');
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l => 
        l.company.toLowerCase().includes(query) ||
        l.contact.toLowerCase().includes(query) ||
        l.phone.includes(query)
      );
    }
    
    return filtered;
  };

  const filteredLeads = getFilteredLeads();
  const newLeadsCount = leadsData.filter(l => l.status === 'New').length;
  const contactedCount = leadsData.filter(l => l.status === 'Contacted').length;
  const qualifiedCount = leadsData.filter(l => l.responseStatus === 'interested').length;
  const convertedCount = leadsData.filter(l => l.status === 'Converted').length;
  const pendingContactCount = leadsData.filter(l => !l.lastContacted).length;

  // ==================== PAGE HEADER ====================
  const PageHeader = () => (
    <div className="mb-4 sm:mb-6">
      {/* Mobile: Single row with buttons in top bar */}
      <div className="flex items-center justify-between mb-3 sm:hidden">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-gray-900 truncate">WhatsApp Leads</h1>
            <p className="text-xs text-gray-500 truncate">Leads captured from WhatsApp flows</p>
          </div>
        </div>
        <div className="flex gap-2 ml-2 flex-shrink-0">
          <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button 
            onClick={openAddLeadModal}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Desktop: Original layout */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">WhatsApp Leads</h1>
            <p className="text-sm text-gray-500">Leads captured from WhatsApp flows</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <button 
            onClick={openAddLeadModal}
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Lead
          </button>
        </div>
      </div>
    </div>
  );

  // ==================== STATS CARDS ====================
  const StatsCards = () => (
    <div className="mb-4 sm:mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
        {/* Total Leads */}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500">Total Leads</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{leadsData.length}</p>
              <p className="text-xs text-gray-400 mt-1">+14 this week</p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* This Week */}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500">This Week</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">14</p>
              <p className="text-xs text-green-500 mt-1">↑ 50% vs last week</p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Qualified */}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500">Qualified</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{qualifiedCount}</p>
              <p className="text-xs text-gray-400 mt-1">{leadsData.length > 0 ? Math.round((qualifiedCount / leadsData.length) * 100) : 0}% qualification rate</p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Pending Contact */}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500">Pending Contact</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{pendingContactCount}</p>
              <p className="text-xs text-gray-400 mt-1">Needs follow-up</p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Campaign Eligible */}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Campaign Eligible</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{leadsData.filter(l => !l.optedOut).length}</p>
        </div>
        
        {/* Opted Out */}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Opted Out</p>
          <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">{leadsData.filter(l => l.optedOut).length}</p>
        </div>
        
        {/* Response Rate */}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Response Rate</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
            {leadsData.length > 0 ? Math.round((leadsData.filter(l => l.responseStatus).length / leadsData.length) * 100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );

  // ==================== FILTER BAR ====================
  const FilterBar = () => (
    <div className="bg-white rounded-xl p-3 sm:p-4 mb-4 border">
      <div className="flex items-center gap-2 text-gray-600 mb-3 sm:mb-4">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="font-medium text-sm sm:text-base">Filter by Status</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
        {[
          { key: 'All', count: leadsData.length },
          { key: 'New', count: newLeadsCount },
          { key: 'Contacted', count: contactedCount },
          { key: 'Qualified', count: qualifiedCount },
          { key: 'Converted', count: convertedCount }
        ].map(({ key, count }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 sm:gap-2 ${
              activeFilter === key
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {key}
            <span className={`px-1.5 py-0.5 rounded text-xs ${
              activeFilter === key ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      <div className="relative">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by company, email or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  // ==================== TABLE VIEW ====================
  const TableView = () => {
    const renderLeadCard = (lead) => {
      const statusBadge = getStatusBadge(lead.status, lead.optedOut);
      const sourceBadge = getSourceBadge(lead.source, lead.utm_source);
      
      return (
        <div
          key={lead.id}
          className={`bg-white border rounded-lg p-4 mb-3 cursor-pointer transition-colors hover:shadow-md ${lead.optedOut ? 'bg-red-50/50' : ''}`}
          onClick={() => openLeadDetail(lead)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
                lead.optedOut ? 'bg-red-100' : isWarmLead(lead) ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                {lead.optedOut ? (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                ) : isWarmLead(lead) ? (
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-base ${lead.optedOut ? 'text-gray-500' : 'text-gray-900'}`}>{lead.company}</p>
                <p className="text-xs text-gray-500 mt-0.5">{lead.source === 'whatsapp_flow' ? 'WhatsApp Flow' : 'Manual'}</p>
              </div>
            </div>
            <div className="flex gap-1.5 ml-2" onClick={(e) => e.stopPropagation()}>
              <button 
                className="p-1.5 hover:bg-gray-100 rounded" 
                onClick={(e) => { e.stopPropagation(); openLeadDetail(lead); }}
                title="View"
              >
                <Eye className="w-4 h-4 text-gray-500" />
              </button>
              <button 
                className="p-1.5 hover:bg-gray-100 rounded"
                onClick={(e) => { e.stopPropagation(); }}
                title="Chat"
              >
                <MessageCircle className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600 text-sm">{lead.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 text-sm truncate">{lead.contact}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Source:</span>
              <span className={`px-2 py-0.5 text-xs rounded-full border whitespace-nowrap ${sourceBadge.color}`}>
                {sourceBadge.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Size:</span>
              <span className="text-gray-900">{lead.size}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-gray-500">Interests:</span>
              <div className="flex flex-wrap gap-1 justify-end ml-2">
                {lead.interests.slice(0, 2).map((interest, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                    {interest.length > 15 ? interest.slice(0, 15) + '...' : interest}
                  </span>
                ))}
                {lead.interests.length > 2 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{lead.interests.length - 2}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Captured:</span>
              <span className="text-gray-900 text-xs">{lead.captured}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t">
              <span className="text-gray-500">Status:</span>
              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            </div>
          </div>
        </div>
      );
    };

    return (
      <>
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-0">
          {filteredLeads.map(renderLeadCard)}
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interests</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Captured</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => {
                  const statusBadge = getStatusBadge(lead.status, lead.optedOut);
                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${lead.optedOut ? 'bg-red-50/50' : ''}`}
                      onClick={() => openLeadDetail(lead)}
                    >
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${
                            lead.optedOut ? 'bg-red-100' : isWarmLead(lead) ? 'bg-green-100' : 'bg-purple-100'
                          }`}>
                            {lead.optedOut ? (
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            ) : isWarmLead(lead) ? (
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${lead.optedOut ? 'text-gray-500' : 'text-gray-900'}`}>{lead.company}</p>
                            <p className="text-xs text-gray-500">{lead.source === 'whatsapp_flow' ? 'WhatsApp Flow' : 'Manual'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm text-gray-600">{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-600">{lead.contact}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full border whitespace-nowrap ${getSourceBadge(lead.source, lead.utm_source).color}`}>
                          {getSourceBadge(lead.source, lead.utm_source).label}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{lead.size}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {lead.interests.slice(0, 2).map((interest, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                              {interest.length > 18 ? interest.slice(0, 18) + '...' : interest}
                            </span>
                          ))}
                          {lead.interests.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{lead.interests.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{lead.captured}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            className="p-1.5 hover:bg-gray-100 rounded" 
                            onClick={(e) => { e.stopPropagation(); openLeadDetail(lead); }}
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          <button 
                            className="p-1.5 hover:bg-gray-100 rounded"
                            onClick={(e) => { e.stopPropagation(); }}
                            title="Chat"
                          >
                            <MessageCircle className="w-4 h-4 text-gray-500" />
                          </button>
                          <button 
                            className="p-1.5 hover:bg-gray-100 rounded"
                            onClick={(e) => openGroupModal(lead, e)}
                            title="Add to Group"
                          >
                            <Users className="w-4 h-4 text-gray-500" />
                          </button>
                          <button 
                            className="p-1.5 hover:bg-gray-100 rounded"
                            onClick={(e) => openTicketModal(lead, e)}
                            title="Create Ticket"
                          >
                            <Ticket className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  // ==================== LEAD DETAIL MODAL ====================
  const LeadDetailModal = () => {
    const sourceBadge = getSourceBadge(selectedLead.source, selectedLead.utm_source);
    const statusBadge = getStatusBadge(selectedLead.status, selectedLead.optedOut);
    const isWarm = isWarmLead(selectedLead);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 sm:p-4">
        <div className="bg-white rounded-none sm:rounded-xl w-full h-full sm:h-auto sm:max-w-lg shadow-2xl max-h-screen sm:max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white p-4 sm:p-6 border-b flex items-start justify-between z-10">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded flex items-center justify-center flex-shrink-0 ${
                selectedLead.optedOut ? 'bg-red-100' : isWarm ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                {selectedLead.optedOut ? (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                ) : isWarm ? (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{selectedLead.company}</h2>
                <div className="flex gap-1.5 sm:gap-2 mt-1 flex-wrap">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${sourceBadge.color}`}>
                    {sourceBadge.label}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Opted Out Warning */}
          {selectedLead.optedOut && (
            <div className="mx-4 sm:mx-6 mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-800">Opted Out of Communications</p>
                  <p className="text-sm text-red-600 mt-1">
                    This user clicked "Stop" on {selectedLead.optOutDate}. They will be excluded from all future campaigns.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{selectedLead.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selectedLead.contact}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-3">Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Captured</span>
                  <span className="font-medium text-gray-900">{selectedLead.captured}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Response</span>
                  <span className={`font-medium ${
                    selectedLead.responseStatus === 'interested' ? 'text-green-600' :
                    selectedLead.responseStatus === 'not_interested' ? 'text-red-600' :
                    selectedLead.responseStatus === 'no_response' ? 'text-amber-600' :
                    'text-gray-400'
                  }`}>
                    {selectedLead.responseStatus === 'interested' ? 'Interested ✓' :
                     selectedLead.responseStatus === 'not_interested' ? 'Not Interested ✗' :
                     selectedLead.responseStatus === 'no_response' ? 'No Response' :
                     'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interested Departments */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-3">Interested Departments</h3>
              <div className="flex flex-wrap gap-2">
                {selectedLead.interests.map((interest, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200 font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 sm:p-6 border-t bg-gray-50 rounded-b-none sm:rounded-b-xl">
            {selectedLead.optedOut ? (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">Cannot contact - user has opted out</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={startChat}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Chat
                </button>
                <button
                  onClick={() => { setShowDetailModal(false); setShowGroupModal(true); setGroupModalTab('existing'); }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Users className="w-5 h-5" />
                  Add to Group
                </button>
                <button
                  onClick={() => { setShowDetailModal(false); setShowTicketModal(true); }}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Ticket className="w-5 h-5" />
                  Create Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==================== CAMPAIGN MODAL ====================
  const CampaignModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">New Campaign</h2>
          <p className="text-sm text-gray-500 mt-1">Select leads to include in your campaign</p>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Warning about opted out */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-amber-800">Opted-out leads excluded</p>
                <p className="text-sm text-amber-600 mt-1">
                  {optedOutLeads.length} lead(s) marked as "Not Interested" will not receive this campaign.
                </p>
              </div>
            </div>
          </div>

          {/* Eligible leads */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Eligible Leads ({campaignEligibleLeads.length})</p>
            <div className="border rounded-lg divide-y max-h-48 overflow-auto">
              {campaignEligibleLeads.map(lead => (
                <div key={lead.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <p className="font-medium text-gray-900">{lead.company}</p>
                      <p className="text-xs text-gray-500">{lead.phone}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Eligible</span>
                </div>
              ))}
            </div>
          </div>

          {/* Excluded leads */}
          {optedOutLeads.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Excluded ({optedOutLeads.length})</p>
              <div className="border border-red-200 bg-red-50 rounded-lg divide-y divide-red-200 max-h-32 overflow-auto">
                {optedOutLeads.map(lead => (
                  <div key={lead.id} className="p-3 flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled className="w-4 h-4 text-gray-400 rounded" />
                      <div>
                        <p className="font-medium text-gray-700">{lead.company}</p>
                        <p className="text-xs text-gray-500">{lead.phone}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Opted Out</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-xl flex gap-3">
          <button
            onClick={() => setShowCampaignModal(false)}
            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowCampaignModal(false)}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );

  // ==================== WEBHOOK SIMULATOR ====================
  const WebhookSimulator = () => {
    const eligibleForSimulation = leadsData.filter(l => l.status === 'Contacted' && !l.optedOut);
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">🔧 Webhook Simulator</h2>
            <p className="text-sm text-gray-500 mt-1">Simulate user button responses for testing</p>
          </div>
          
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              In production, WhatsApp sends a webhook when user clicks a button. Use this to test the flow.
            </p>
            
            <div className="border rounded-lg divide-y">
              {leadsData.filter(l => !l.optedOut).map(lead => (
                <div key={lead.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{lead.company}</p>
                      <p className="text-xs text-gray-500">{lead.phone}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      lead.responseStatus === 'interested' ? 'bg-green-100 text-green-700' :
                      lead.responseStatus === 'no_response' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {lead.responseStatus || 'No Response'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => simulateOptIn(lead.id)}
                      className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                    >
                      ✅ Simulate "Assist Me"
                    </button>
                    <button
                      onClick={() => simulateOptOut(lead.id)}
                      className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                    >
                      🛑 Simulate "Stop"
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 rounded-b-xl">
            <button
              onClick={() => setShowWebhookSimulator(false)}
              className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==================== CHAT SCREEN ====================
  const ChatScreen = () => {
    const isWarm = isWarmLead(selectedLead);
    const templates = isWarm ? warmTemplates : coldTemplates;
    const sourceBadge = getSourceBadge(selectedLead.source, selectedLead.utm_source);

    return (
      <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => { setShowChatScreen(false); setShowDetailModal(true); setSelectedTemplate(null); }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Send WhatsApp Message</h1>
              <div className="w-16"></div>
            </div>

            {/* Lead Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isWarm ? 'bg-green-100' : 'bg-purple-100'}`}>
                <svg className={`w-6 h-6 ${isWarm ? 'text-green-600' : 'text-purple-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{selectedLead.company}</p>
                <p className="text-sm text-gray-500">{selectedLead.phone}</p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full font-medium border ${sourceBadge.color}`}>
                {sourceBadge.label}
              </span>
            </div>

            {/* User Requirements */}
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-amber-800">User Requirements</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedLead.interests.map((interest, i) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-100 text-amber-800 font-medium text-sm rounded-full border border-amber-300">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Message Type */}
            {!isWarm && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-800">Template with Opt-in Buttons</p>
                    <p className="text-sm text-red-600 mt-1">
                      If user clicks <strong>"Stop"</strong>, they'll be marked as "Not Interested" and excluded from future campaigns.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Template Selection */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex gap-6">
              <div className={`${selectedTemplate ? 'w-1/2' : 'w-full'} transition-all`}>
                <h2 className="font-semibold text-gray-800 mb-4">Select Template</h2>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                        selectedTemplate?.id === template.id
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{template.name}</span>
                        {template.buttons && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">With Buttons</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {template.message.split('\n').slice(2, 4).join(' ').slice(0, 80)}...
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {selectedTemplate && (
                <div className="w-1/2">
                  <h2 className="font-semibold text-gray-800 mb-4">Preview</h2>
                  <div className="bg-[#e5ddd5] rounded-xl p-4 mb-4">
                    <div className="bg-[#dcf8c6] rounded-lg p-3 shadow-sm max-w-[95%] ml-auto">
                      <p className="text-sm text-gray-800 whitespace-pre-line">{getPersonalizedMessage(selectedTemplate)}</p>
                      <p className="text-xs text-gray-500 text-right mt-2">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {selectedTemplate.buttons && (
                      <div className="mt-2 space-y-2 max-w-[95%] ml-auto">
                        {selectedTemplate.buttons.map((btn) => (
                          <div
                            key={btn.id}
                            className={`w-full py-2.5 rounded-lg text-center text-sm font-medium shadow-sm ${
                              btn.action === 'not_interested'
                                ? 'bg-white text-red-600 border border-red-200'
                                : 'bg-white text-green-600 border border-green-200'
                            }`}
                          >
                            {btn.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-lg shadow-lg"
                  >
                    Send Template
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirm */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Send Template?</h3>
                <p className="text-gray-600 mb-4">To: {selectedLead.phone}</p>
                {selectedTemplate?.buttons && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded mb-4">
                    ⚠️ If user clicks "Stop", they'll be excluded from future campaigns
                  </p>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                    Cancel
                  </button>
                  <button onClick={handleSend} className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-4">Waiting for user response...</p>
                <p className="text-xs text-gray-500 mb-6">
                  Status will update when user clicks a button
                </p>
                <button onClick={resetFlow} className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium">
                  Back to Leads
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== ADD TO GROUP MODAL ====================
  const AddToGroupModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Add to Group</h2>
            <button onClick={closeGroupModal} className="p-1 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {selectedLead && (
            <p className="text-sm text-gray-500 mt-1">
              Adding <span className="font-medium text-gray-700">{selectedLead.company}</span> to a group
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setGroupModalTab('existing')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              groupModalTab === 'existing'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Add to Existing Group
          </button>
          <button
            onClick={() => setGroupModalTab('new')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              groupModalTab === 'new'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create New Group
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {groupModalTab === 'existing' ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">Select a group to add this lead:</p>
              <div className="space-y-2 max-h-64 overflow-auto">
                {groups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all flex items-center justify-between ${
                      selectedGroup?.id === group.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedGroup?.id === group.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Users className={`w-5 h-5 ${
                          selectedGroup?.id === group.id ? 'text-blue-600' : 'text-gray-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{group.name}</p>
                        <p className="text-xs text-gray-500">{group.count} leads</p>
                      </div>
                    </div>
                    {selectedGroup?.id === group.id && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">
                This lead will be automatically added to the new group
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t bg-gray-50 rounded-b-xl flex gap-3">
          <button
            onClick={closeGroupModal}
            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
          >
            Cancel
          </button>
          {groupModalTab === 'existing' ? (
            <button
              onClick={handleAddToExistingGroup}
              disabled={!selectedGroup}
              className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                selectedGroup
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add to Group
            </button>
          ) : (
            <button
              onClick={handleCreateGroup}
              disabled={!newGroupName.trim()}
              className={`flex-1 py-3 rounded-lg font-medium ${
                newGroupName.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ==================== ADD LEAD MODAL ====================
  const AddLeadModal = () => {
    const companySizes = [
      '1 - 10 employees',
      '10 - 30 employees',
      '30 - 50 employees',
      '50 - 100 employees',
      '100 - 500 employees',
      '1000+ employees'
    ];

    const departments = [
      'HR Attendance + Payroll',
      'Task delegation + Productivity',
      'Business Chat + AI',
      'Sales lead funnel - Wa integrations',
      'Office on Auto Pilot'
    ];

    const canProceedStep1 = addLeadFormData.companyName.trim() && addLeadFormData.email.trim() && addLeadFormData.phone.trim();
    const canProceedStep2 = addLeadFormData.companySize !== '';
    const canProceedStep3 = addLeadFormData.interests.length > 0;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              {addLeadStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h2 className="text-xl font-semibold text-gray-900">
                {addLeadStep === 1 ? 'Company Information' : addLeadStep === 2 ? 'Company Size' : 'Enquiry Details'}
              </h2>
            </div>
            <button onClick={closeAddLeadModal} className="p-1 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Step Indicator */}
          <div className="px-6 pt-4 pb-2">
            <p className="text-sm text-gray-500">Step {addLeadStep} of 3</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Company Information */}
            {addLeadStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to EasyDo!</h3>
                  <p className="text-gray-600">Let's get started with your company details</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={addLeadFormData.companyName}
                    onChange={(e) => setAddLeadFormData({ ...addLeadFormData, companyName: e.target.value })}
                    placeholder="Enter your company name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter your company name</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={addLeadFormData.email}
                    onChange={(e) => setAddLeadFormData({ ...addLeadFormData, email: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll send information to this email</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={addLeadFormData.countryCode}
                      onChange={(e) => setAddLeadFormData({ ...addLeadFormData, countryCode: e.target.value })}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+86">+86</option>
                      <option value="+81">+81</option>
                    </select>
                    <input
                      type="tel"
                      value={addLeadFormData.phone}
                      onChange={(e) => setAddLeadFormData({ ...addLeadFormData, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Company Size */}
            {addLeadStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Number of Employees</h3>
                  <p className="text-gray-600">Select your company size</p>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {companySizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setAddLeadFormData({ ...addLeadFormData, companySize: size })}
                      className={`w-full p-4 rounded-lg border-2 text-left flex items-center justify-between transition-all ${
                        addLeadFormData.companySize === size
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium text-gray-900">{size}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        addLeadFormData.companySize === size
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {addLeadFormData.companySize === size && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Enquiry Details */}
            {addLeadStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Which departments do you wish to automate?</h3>
                  <p className="text-gray-600">Select one or more</p>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => handleInterestToggle(dept)}
                      className={`w-full p-4 rounded-lg border-2 text-left flex items-center justify-between transition-all ${
                        addLeadFormData.interests.includes(dept)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium text-gray-900">{dept}</span>
                      <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                        addLeadFormData.interests.includes(dept)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {addLeadFormData.interests.includes(dept) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t space-y-4">
            {addLeadStep < 3 ? (
              <button
                onClick={handleNextStep}
                disabled={(addLeadStep === 1 && !canProceedStep1) || (addLeadStep === 2 && !canProceedStep2)}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  (addLeadStep === 1 && canProceedStep1) || (addLeadStep === 2 && canProceedStep2)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleAddLead}
                disabled={!canProceedStep3}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  canProceedStep3
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Add Lead
              </button>
            )}

            {/* Footer Branding */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 via-yellow-500 to-green-500"></div>
              <span>Managed by EasyDo Tasks.</span>
              <a href="#" className="text-blue-600 hover:underline">Learn more</a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== CREATE TICKET MODAL ====================
  const CreateTicketModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create Ticket</h2>
            <button onClick={closeTicketModal} className="p-1 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {selectedLead && (
            <p className="text-sm text-gray-500 mt-1">
              For lead: <span className="font-medium text-gray-700">{selectedLead.company}</span>
            </p>
          )}
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <input
              type="text"
              value={ticketData.title}
              onChange={(e) => setTicketData({ ...ticketData, title: e.target.value })}
              placeholder="Title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Priority and Next Follow Up */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Priority</label>
              <select
                value={ticketData.priority}
                onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-red-500 mb-1.5">Next Follow Up</label>
              <input
                type="datetime-local"
                value={ticketData.nextFollowUp}
                onChange={(e) => setTicketData({ ...ticketData, nextFollowUp: e.target.value })}
                className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <textarea
              value={ticketData.description}
              onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
              placeholder="Description"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button
            onClick={closeTicketModal}
            className="px-6 py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTicket}
            disabled={!ticketData.title.trim()}
            className={`px-6 py-2.5 rounded-lg font-medium ${
              ticketData.title.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">
      <PageHeader />
      <StatsCards />
      <FilterBar />
      <TableView />
      {showDetailModal && selectedLead && <LeadDetailModal />}
      {showChatScreen && selectedLead && <ChatScreen />}
      {showGroupModal && <AddToGroupModal />}
      {showTicketModal && <CreateTicketModal />}
      {showAddLeadModal && <AddLeadModal />}
    </div>
  );
}
