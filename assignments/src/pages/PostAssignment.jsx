import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './PostAssignment.module.css'; // <-- Import the CSS Module

const PostAssignment = () => {
    const { teacherId } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [message, setMessage] = useState('');
    const [isValidMongoId, setIsValidMongoId] = useState(false);

    useEffect(() => {
        const checkId = teacherId && teacherId.length === 24 && /^[0-9a-fA-F]{24}$/.test(teacherId);
        setIsValidMongoId(checkId);
        if (!checkId) {
            setMessage('Error: Trainer ID is missing or invalid in the URL. Cannot post.');
        } else {
            setMessage('');
        }
    }, [teacherId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!title || !description) {
            setMessage('Title and description are required!');
            return;
        }
        if (!isValidMongoId) {
            setMessage('Error: Cannot post assignment due to invalid Trainer ID in URL.');
            return;
        }
        if (dueDate && new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
            setMessage('Error: Due date cannot be in the past.');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/post-assignment/${teacherId}`, {
                title, description, dueDate: dueDate || null
            });
            setMessage('Assignment posted successfully! 🎉');
            setTitle(''); setDescription(''); setDueDate('');
        } catch (err) {
            const serverMessage = err.response?.data?.msg || 'Check server logs for details.';
            setMessage(`Error posting assignment: ${serverMessage}`);
        }
    };

    // --- Get today's date for the min attribute ---
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0'); 
    const todayFormatted = `${year}-${month}-${day}`;
    // --- End date formatting ---

    return (
        // Use styles object from the imported module
        <div className={styles.pageContainer}> 
            <h2 className={styles.pageHeader}>
                Post New Assignment
            </h2>

            {message && (
                // Combine multiple classes
                <p className={`${styles.alertMessage} ${message.startsWith('Error') ? styles.alertError : styles.alertSuccess}`}>
                    {message}
                </p>
            )}

            <div className={styles.formCard}>
                <form onSubmit={handleSubmit}>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.formLabel}>Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Assignment Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.formInput}
                            required
                            disabled={!isValidMongoId}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description" className={styles.formLabel}>Description</label>
                        <textarea
                            id="description"
                            placeholder="Instructions, details, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.formInput} // This will also apply textarea.formInput
                            rows={4}
                            required
                            disabled={!isValidMongoId}
                        />
                    </div>

                    <div className={styles.formGroup}>
                         <label htmlFor="dueDate" className={styles.formLabel}>Due Date (Optional)</label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className={styles.formInput} // This will also apply input[type="date"].formInput
                            min={todayFormatted} 
                            disabled={!isValidMongoId}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`${styles.btn} ${styles.btnRed}`} // Combine btn and btnRed
                        disabled={!isValidMongoId || !title || !description}
                    >
                        Post Assignment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostAssignment;
