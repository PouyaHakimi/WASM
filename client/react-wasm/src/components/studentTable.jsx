import Table from 'react-bootstrap/Table';
import '../';



function StudentTable(props) {
  
props.student.map((std)=>(
  console.log("test maaap"+std)
  
))
  //const students = Array.isArray(props.student) ? props.student : [1,2,3];
  return (
    <Table striped bordered hover>
      <thead>
        <tr>

          <th>student ID</th>
          <th>Full Name</th>
          <th>Mark</th>
        </tr>
      </thead>
      <tbody>
        

        {/* {Array.isArray(props.student) &&*/}{props.student.map((std) => ( 
        
          
          <tr key={std.id}>
            <td>{std.id}</td>
            <td>{std.sname}</td>
            <td>{std.marks}</td>
          </tr>
        ))}
        



      </tbody>
    </Table>
  );
}

export default StudentTable;