import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addBill, deleteBill, updateBill, resetBills } from '../app/store';

const Dashboard = () => {
  const bills = useSelector((state) => state.bills.items);
  const dispatch = useDispatch();
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || false;
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    localStorage.setItem('cloudKitchenBills', JSON.stringify(bills));
  }, [darkMode, bills]);

  
  const corporateTotal = bills
    .filter(bill => bill.type === 'corporate')
    .reduce((sum, bill) => sum + bill.total, 0);

  const eventTotal = bills
    .filter(bill => bill.type === 'event')
    .reduce((sum, bill) => sum + bill.total, 0);

  const totalRevenue = corporateTotal + eventTotal;
  const eventBills = bills.filter(bill => bill.type === 'event');
  const eventBillsTotal = eventBills.reduce((sum, bill) => sum + bill.total, 0);

  const handleCreateNewBill = () => {
    const billType = window.confirm('Is this an Event bill? (OK for Event, Cancel for Corporate)') 
      ? 'event' 
      : 'corporate';
    
    const eventCount = bills.filter(b => b.type === 'event').length;
    const corpCount = bills.filter(b => b.type === 'corporate').length;
    
    const newId = billType === 'event' 
      ? `EVT-${(eventCount + 1).toString().padStart(4, '0')}`
      : `CORP-${(corpCount + 1).toString().padStart(4, '0')}`;
    
    const name = window.prompt('Enter name:', 'New Event');
    if (!name) return;
    
    const amount = window.prompt('Enter amount (BDT):', '5000');
    const total = parseInt(amount) || 5000;
    
    const contact = window.prompt('Enter contact:', '0123456789') || '0123456789';
    
    const newBill = {
      id: newId,
      name,
      date: new Date().toISOString().split('T')[0],
      contact,
      total,
      type: billType
    };
    
    dispatch(addBill(newBill));
    alert(`Bill created!\nID: ${newId}\nType: ${billType}\nAmount: BDT ${total}`);
  };


  const handleEditBill = (id) => {
    const bill = bills.find(b => b.id === id);
    if (!bill) return;
    
    const newName = window.prompt('Edit name:', bill.name);
    if (newName !== null && newName.trim() !== '') {
      dispatch(updateBill({ id, name: newName }));
      alert('Bill updated!');
    }
  };


  const handleDeleteBill = (id) => {
    if (window.confirm('Delete this bill?')) {
      dispatch(deleteBill(id));
      alert('Bill deleted!');
    }
  };

  
  const handleResetAll = () => {
    if (window.confirm('Delete ALL bills?')) {
      dispatch(resetBills());
      localStorage.removeItem('cloudKitchenBills');
    }
  };

  return (
    <>
      <header>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap' 
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <i className="fas fa-cloud" style={{ color: '#4FC3F7' }}></i> 
              Cloud Kitchen Billing System
            </h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Admin Dashboard</p>
          </div>
          
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            style={{
              background: darkMode ? '#333' : '#f0f0f0',
              color: darkMode ? '#fff' : '#333',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              marginLeft: '20px'
            }}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <i className="fas fa-sun" style={{ color: '#FFD700' }}></i>
            ) : (
              <i className="fas fa-moon"></i>
            )}
          </button>
        </div>
      </header>

      <div className="stats-cards">
        <div className="card">
          <h3><i className="fas fa-file-invoice"></i> Total Bills</h3>
          <p className="count">{bills.length}</p>
        </div>
        <div className="card">
          <h3><i className="fas fa-building"></i> Corporate Bills</h3>
          <p className="amount">BDT {corporateTotal.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3><i className="fas fa-calendar-check"></i> Event Bills</h3>
          <p className="amount">BDT {eventTotal.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3><i className="fas fa-wallet"></i> Total Revenue</h3>
          <p className="amount">BDT {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-print" onClick={() => window.print()}>
          <i className="fas fa-print"></i> Print Report
        </button>
        <button className="btn btn-invoice" onClick={handleCreateNewBill}>
          <i className="fas fa-plus"></i> Create New Bill
        </button>
        <button className="btn btn-delete" onClick={handleResetAll}>
          <i className="fas fa-trash"></i> Reset All
        </button>
      </div>

      <h2><i className="fas fa-list"></i> Event Bills</h2>
      <p>Showing {eventBills.length} event bills</p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Event Name</th>
            <th>Date</th>
            <th>Contact</th>
            <th>Total (BDT)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {eventBills.map(bill => (
            <tr key={bill.id}>
              <td>{bill.id}</td>
              <td>{bill.name}</td>
              <td>{bill.date}</td>
              <td dangerouslySetInnerHTML={{ __html: bill.contact }}></td>
              <td>BDT {bill.total.toLocaleString()}</td>
              <td>
                <button className="btn btn-invoice" onClick={() => 
                  alert(`Invoice for: ${bill.name}\nAmount: BDT ${bill.total}`)
                }>
                  Invoice
                </button>
                <button className="btn btn-details" onClick={() => 
                  alert(`ID: ${bill.id}\nName: ${bill.name}\nDate: ${bill.date}\nContact: ${bill.contact}\nAmount: BDT ${bill.total}`)
                }>
                  Details
                </button>
                <button className="btn btn-edit" onClick={() => handleEditBill(bill.id)}>
                  Edit
                </button>
                <button className="btn btn-delete" onClick={() => handleDeleteBill(bill.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <p className="table-footer">
        Showing {eventBills.length} bills | Total: <strong>BDT {eventBillsTotal.toLocaleString()}</strong>
      </p>

      <footer>
        <p>Cloud Kitchen Billing System v1.0 • 2025</p>
        <p><i className="fas fa-lock"></i> All bills are stored securely in your browser's localStorage</p>
      </footer>
    </>
  );
};

export default Dashboard;