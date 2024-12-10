import {Table,Button} from 'react-bootstrap';
import DuckDB from '../DuckDB';
import memoryData from '../wasm/memoryData';

function  DuckDBTable(props) {


 
  return (

    <>
    <div className='center-container'>
    <Button  variant="success" size="lg" onClick={

      async () => {
        const res =  await memoryData();

        // console.log(res.toArray()+"reeeeesssss");
        
        props.setStdDuckDB(res);
      }
    }>
      Run DuckDB
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

export default DuckDBTable;