import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { Plus, FileText, Calendar, ChevronRight, Search } from 'lucide-react';
import './dashboard.css';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDocuments([
          { _id: '1', title: 'Project Proposal', createdAt: '2023-05-15T10:30:00Z', category: 'Business', lastEdited: '2 days ago' },
          { _id: '2', title: 'Meeting Notes', createdAt: '2023-05-10T14:20:00Z', category: 'Notes', lastEdited: '1 week ago' },
          { _id: '3', title: 'Research Paper', createdAt: '2023-04-28T09:15:00Z', category: 'Academic', lastEdited: '3 days ago' },
          { _id: '4', title: 'Marketing Strategy', createdAt: '2023-05-05T16:45:00Z', category: 'Marketing', lastEdited: '5 days ago' },
          { _id: '5', title: 'Budget Plan 2023', createdAt: '2023-03-20T11:00:00Z', category: 'Finance', lastEdited: '1 month ago' },
        ]);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => navigate('/document/new');
  const handleOpenDocument = (id) => navigate(`/document/${id}`);

  const getCategoryColor = (category) => {
    const colors = {
      'Business': '#4f46e5',
      'Notes': '#10b981',
      'Academic': '#f59e0b',
      'Marketing': '#ec4899',
      'Finance': '#06b6d4'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Documents</h1>
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          {[...Array(3)].map((_, i) => <div key={i} className="document-skeleton"></div>)}
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="documents-grid">
          {filteredDocuments.map((doc) => (
            <div key={doc._id} className="document-card" onClick={() => handleOpenDocument(doc._id)}>
              <div className="document-icon"><FileText size={24} /></div>
              <div className="document-info">
                <h3>{doc.title}</h3>
                <div className="document-meta">
                  <span className="document-date">
                    <Calendar size={14} />
                    {new Date(doc.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  {doc.category && (
                    <span className="document-category" style={{ backgroundColor: getCategoryColor(doc.category) }}>
                      {doc.category}
                    </span>
                  )}
                </div>
                {doc.lastEdited && <p className="last-edited">Last edited: {doc.lastEdited}</p>}
              </div>
              <div className="document-action"><ChevronRight size={20} /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-illustration"><FileText size={64} /></div>
          <h3>No documents found</h3>
          <p>Create your first document to get started</p>
        </div>
      )}

      <button className="create-document-button" onClick={handleCreateNew}>
        <span className="button-icon"><Plus size={20} /></span>
        <span>Create New Document</span>
      </button>
    </div>
  );
}
