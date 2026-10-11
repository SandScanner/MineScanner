import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
// import { QuarryList } from '../../assets/QuarryList'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import VehicleCheckForm from '../PermitBookings/VehicleCheckForm'

const MineDashboard = () => {

  const navigate = useNavigate();
  const [QuarryList, setQuarryList] = useState([])
  const changePage = (data) => {
    navigate('mineupload', {
      state: data
    })
  }

  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);

  const fetchQuarryList = async () => {
    let result = await axios.post(process.env.REACT_APP_API_URL+'/mines_list', {
      userId: user.userId
    })
    if (result){
      console.log("mines", result);
      if (result.status === 200) {
        console.log(result.data);
        setQuarryList(result.data)
      } else {
        alert("Error fetching quarry list")
      }
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    else {
      if (user.role == 100) {
        fetchQuarryList()
      }
    }
  }, [])

  return (
    <>
    {user.role==100 ? <div className='container mt-5'>
        <Table striped bordered hover>
  <thead>
    <tr>
      <th>#</th>
      <th>Quarry</th>
      <th>District</th>
      <th>Select</th>
    </tr>
  </thead>
  <tbody>
    {
      QuarryList.map((x, i) => (
        <tr key={i}>
        <td>{x.mine_id}</td>
        <td>{x.lessee_name}</td>
        <td>{x.village}</td>
        <td><Button key={`${i}Button`} onClick={e => changePage(x)}> Select </Button></td>
        </tr>
      ))
    }
  </tbody>
</Table>
    </div> : <div>
      {user?.mine_id ? 
      <VehicleCheckForm /> : <>not allowed</> }
      </div>}
    </>
  )
}

export default MineDashboard