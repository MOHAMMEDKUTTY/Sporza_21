import React, { useState } from 'react';
// Assuming you have react-icons installed: npm install react-icons
import { FaClipboardList, FaChevronDown } from 'react-icons/fa'; 
import styles from './Assignment.module.css'; // <-- Import the component's CSS Module

const Assignment = ({ assignment, onToggle, isExpanded, role }) => { 
  const { _id, title, author, createdAt, description, dueDate } = assignment;
  const createdTime = new Date(createdAt).toLocaleDateString(); // Simpler date format
  const dueTime = dueDate ? new Date(dueDate).toLocaleDateString() : 'No due date';
  const authorName = (author && author.name) ? author.name : 'Unknown Trainer';
  const [remarks, setRemarks] = useState(''); 
  
  const handleSubmit = async (e) => { 
    e.preventDefault();
    e.stopPropagation(); // Prevent card from closing on submit

    // TODO: Implement actual API call to submit
    console.log(`Submitting assignment ${_id} for student ID: [Get Student ID Here]`);
    console.log(`Remarks: ${remarks}`);

    try {
        // Assuming you pass studentId down or get it from context
        // const studentId = 'YOUR_STUDENT_ID'; // Replace with actual student ID
        // const response = await axios.post('/api/assignment/submit', {
        //    assignmentId: _id,
        //    studentId: studentId, 
        //    remarks: remarks
        // });
        // console.log('Submission successful:', response.data);
        alert('Assignment marked as done (API call not implemented yet).'); 
        // Optionally disable button or show success state
    } catch (error) {
        console.error('Submission failed:', error);
        alert('Failed to submit assignment.');
    }
  };

  return (
    // 👇 Use CSS module styles 👇
    <div 
      className={styles.assignmentCard} 
      onClick={() => onToggle(_id)}
    >
      {/* Header part */}
      <div className={styles.assignmentCardHeader}> 
        {/* Icon */}
        <div className={styles.assignmentIconContainer}> 
          <FaClipboardList className={styles.assignmentIcon} /> 
        </div>
        
        {/* Title and Author */}
        <div className={styles.assignmentDetails}> 
          <p className={styles.assignmentTitle}>{title}</p>
          <p className={styles.assignmentAuthor}>Posted by: {authorName}</p>
        </div>

        {/* Date and Chevron */}
        <div className={styles.assignmentMeta}> 
           <span className={styles.assignmentDate}>{createdTime}</span>
           <FaChevronDown 
             className={`${styles.assignmentChevron} ${isExpanded ? styles.expanded : ''}`} 
           />
        </div>
      </div>
      
      {/* Expandable Body */}
      <div 
        className={`${styles.assignmentCardBody} ${isExpanded ? styles.expanded : ''}`}
      >
        <div className={styles.assignmentBodyContent}> 
          <p className={styles.assignmentDueDate}>Due: {dueTime}</p>
          <p className={styles.assignmentDescription}>
            {description}
          </p>

          {/* Submission Form (only shows for students) */}
          {role === 'student' && (
            <form onSubmit={handleSubmit} className={styles.submissionForm}>
              <label htmlFor={`remarks-${_id}`} className={styles.remarksLabel}>
                Add Remarks (Optional)
              </label>
              <textarea
                id={`remarks-${_id}`}
                rows={3}
                className={styles.remarksTextarea} // Use CSS module style
                value={remarks}
                onChange={(e) => { e.stopPropagation(); setRemarks(e.target.value); }}
                onClick={(e) => e.stopPropagation()} // Prevent card close on text area click
              />
              <button type="submit" className={styles.submitButton}> {/* Use CSS module style */}
                Mark as Done
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignment;
