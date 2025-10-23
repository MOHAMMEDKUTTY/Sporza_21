// src/pages/AssignmentsList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Removed Link, as the card component handles its own interaction
import Assignment from '../components/Assignment'; // Import the card
import styles from './AssignmentsList.module.css'; // <-- Import the new CSS module

const AssignmentsList = () => {
  // 🛑 NOTE: This needs a real, logged-in Trainer's ID.
  // You will get this from Auth Context or URL param later.
  // For testing, go to your DB, find a Trainer's _id, and paste it here.
  const currentUserId = '68d62926c932651253114dcc'; // E.g., '60d5f1b2c3b4a5e6f7g8h9i0'

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the expanding cards
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Prevent fetching if ID is just a placeholder
    if (!currentUserId || currentUserId === 'PASTE_TRAINER_ID_HERE') {
      setError('Please update currentUserId in AssignmentsList.jsx with a real Trainer ID to test.');
      setLoading(false);
      return;
    }
    
    const fetchAssignments = async () => {
      try {
        // This API fetches assignments BY THE AUTHOR
        const apiUrl = `http://localhost:5000/assignments?authorId=${currentUserId}`;
        const response = await axios.get(apiUrl); 
        
        setAssignments(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load assignments. Is your server running?"); 
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [currentUserId]);

  // Handler to toggle which card is open
  const handleToggleExpand = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  if (loading) return <div className={styles.loadingText}>Loading...</div>;
  if (error) return <div className={styles.alertError}>{error}</div>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Your Posted Assignments</h1>
      
      {assignments.length === 0 ? (
        <p className={styles.emptyStateText}>
          You have not posted any assignments yet.
        </p>
      ) : (
        // The Assignment component manages its own margin-bottom
        <div>
          {assignments.map(assignment => (
            // Render the Assignment component correctly
            <Assignment 
              key={assignment._id}
              assignment={assignment} // Pass the full object
              onToggle={handleToggleExpand}
              isExpanded={expandedId === assignment._id}
              // Omit 'role' or set to 'trainer' so the submit form doesn't show
              // role="trainer" 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsList;
