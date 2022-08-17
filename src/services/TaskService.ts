import axios  from './axios'

const createTask = async (task: any) => await axios.post('/task', task)
