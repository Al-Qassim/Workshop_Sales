// import axiosinstance from './axiosinstance';

export async function FetchDataToState([state, setState]) {
        
    // return axiosinstance
    //     .get('/GetAllData')
    //     .then((response) => {
    //         console.log('data fetched successfully: ', response.data);
    //         setState({...state, data: response.data});
    //     })
    //     .catch((error) => {
    //         console.error('Error fetching data: ', error);
    //     });
    
}

export async function PostDataToBackEnd([state, setState]) {
        
    // return axiosinstance
    //     .post(
    //         '/PostAllData',
    //         {data: state.data}
    //     )
    //     .then((response) => {
    //         console.log('data posted successfully: ', response.data);
    //     })
    //     .catch((error) => {
    //         console.error('Error posting data: ', error);
    //     });
    
}

export async function PostRowToTable(Row, TableName, IdentifierColumn) {
        
    // return axiosinstance
    //     .post(
    //         '/PostRowToTable',
    //         {
    //             Row: Row,
    //             TableName: TableName,
    //             IdentifierColumn: IdentifierColumn
    //         }
    //     )
    //     .then((response) => {
    //         console.log('Row posted successfully: ', response.data);
    //     })
    //     .catch((error) => {
    //         console.error('Error posting row: ', error);
    //     });
    
}

export async function PostDeleteRow(TableName, IdentifierColumn, IdentifierValue) {
        
    // return axiosinstance
    //     .post(
    //         '/PostDeleteRow',
    //         {
    //             TableName: TableName,
    //             IdentifierColumn: IdentifierColumn,
    //             IdentifierValue: IdentifierValue
    //         }
    //     )
    //     .then((response) => {
    //         console.log('Row posted successfully: ', response.data);
    //     })
    //     .catch((error) => {
    //         console.error('Error posting row: ', error);
    //     });
    
}

