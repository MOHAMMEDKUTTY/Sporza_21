import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Assignment from '../components/Assignment'; // This component now has its own styles
import styles from './StudentAssignmentsList.module.css'; // <-- Import this page's styles

const StudentAssignmentsList = () => {
  const { studentId } = useParams(); 
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!studentId) {
        setError("No student ID provided in URL.");
        setLoading(false);
        return;
    }

    const fetchStudentAssignments = async () => {
      try {
        const apiUrl = `http://localhost:5000/api/student-assignments/${studentId}`;
        const response = await axios.get(apiUrl);
        setAssignments(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err.response ? err.response.data : err.message);
        setError("Failed to load assignments. Is your server running?");
        setLoading(false);
      }
    };

    fetchStudentAssignments();
  }, [studentId]); 

  const handleToggleExpand = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  if (loading) return <div className={styles.loadingText}>Loading assignments...</div>;
  if (error) return <div className={styles.alertError}>{error}</div>;

  return (
    <div className={styles.pageContainer}> 
      <h1 className={styles.pageHeader}> 
        Your Assignments
      </h1>
      
      {assignments.length === 0 ? (
         <p className={styles.emptyStateText}> 
           No assignments found from your trainer.
         </p>
      ) : (
        // The Assignment component manages its own margin-bottom
        <div> 
          {assignments.map(assignment => (
            <Assignment // The Assignment component styles itself
              key={assignment._id}
              assignment={assignment}
              onToggle={handleToggleExpand}
              isExpanded={expandedId === assignment._id}
              role="student" 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentsList;

