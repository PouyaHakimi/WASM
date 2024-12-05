import {Table,Button} from 'react-bootstrap';
import DockDB from '../DockDB';

function  DockDBTable(props) {


 
  return (

    <>
    <div className='center-container'>
    <Button  variant="success" size="lg" onClick={

      async () => {
        const res =  await DockDB();

        console.log(res.toArray()+"reeeeesssss");
        
        props.setStdDuckDB(res.toArray());
      }
    }>
      Run DockDB
     </Button>
     </div>
     <br/>
     <br/>
     
    <Table striped bordered hover>
      <thead>        
        <tr>

          <th>student ID</th>
          <th>Full Name</th>
          <th>Mark</th>
        </tr>
      </thead>
      <tbody>
       
            {props.stdDuckDB.map((std) => (  
        
          
            <tr key={std.id}>
            <td>{std.id}</td>
            <td>{std.sname}</td>
            <td>{std.marks}</td>
          </tr>
        ))}
        
 


      </tbody>
      
    </Table>
    </>
    
  );
}

export default DockDBTable;