import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. Corrected Imports (assuming PascalCase filenames)
import AssignmentsList from "./pages/AssignmentsList"; 
import PostAssignment from "./pages/PostAssignment";
import StudentAssignmentsList from "./pages/StudentAssignmentsList"; 
// Fixed path
// import AssignmentDetail from "./pages/AssignmentDetail"; // You will create this file

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 2. ADDED: A route to see the list */}
        <Route path="/assignments" element={<AssignmentsList />} />

        {/* 3. This route is for posting (Trainer UI) */}
        <Route path="/post-assignment/:teacherId" element={<PostAssignment />} />
        
        {/* 4. This route is for viewing ONE assignment (Student UI) */}
        {/*
          <Route 
            path="/assignment/:assignmentId" 
            element={<AssignmentDetail />} // <-- This should be a new component
          />
        */}

        {/* For now, just point the detail route to the list 
          until you create the AssignmentDetail component.
          But be aware this is not the final logic.
        */}
        <Route path="/assignment/:assignmentId" element={<AssignmentsList />} />
        <Route 
          path="/assignments/student/:studentId" 
          element={<StudentAssignmentsList />} 
        />
        {/* <Route path="/assignment/:assignmentId" element={<AssignmentDetail />} /> */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;