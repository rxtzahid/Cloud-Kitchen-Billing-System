import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addBill, deleteBill, updateBill, resetBills } from '../app/store';

const Dashboard = () => {
  const bills = useSelector((state) => state.bills.items);
  const dispatch = useDispatch();


  useEffect(() => {
    localStorage.setItem('cloudKitchenBills', JSON.stringify(bills));
  }, [bills]);


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
        <h1><i className="fas fa-cloud"></i> Cloud Kitchen Billing System</h1>
        <p>Admin Dashboard</p>
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