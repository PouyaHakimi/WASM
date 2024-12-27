import Table from 'react-bootstrap/Table';
import '../';
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);


function StudentTable(props) {
  




  //const students = Array.isArray(props.student) ? props.student : [1,2,3];
  return (
    <div class="container">
  <div class="row">
    <div class="col-4">
    <div class="card text-center">
  <div class="card-header">
    Featured
  </div>
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

    </div>
    <div class="col-8">
    <Table striped bordered hover>
      <thead>
        <tr>

          <th>student ID</th>
          <th>Full Name</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
    

      {Array.isArray(props.students) && props.students.map((std) => ( 
        
          
          <tr key={std.id}>
            <td>{std.id}</td>
            <td>{std.sname}</td>
            <td>{std.age}</td>
          </tr>
        ))}

      </tbody>
      
      
    </Table>
    </div>
  </div>
  

</div>
   
    
    
  );
}

export default StudentTable;