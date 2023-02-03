import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Image, Input, Button, Row, Col, Table, Modal  } from 'antd';
// import Modal from '@mui/material/Modal';
import { ExclamationCircleFilled } from '@ant-design/icons';
import './style.css'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { userService } from '../../service/user';
import { DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;

const { confirm } = Modal;

const columnsRight = [
    {
        title: '#',
        dataIndex: 'stt'
    },
    {
        title: 'MSSV',
        dataIndex: 'mssv',
    },
    {
        title: 'HỌ TÊN',
        dataIndex: 'name',
    },
    {
        title: 'LỚP',
        dataIndex: 'lop',
    },
    {
        title: 'ĐIỂM RÈN LUYỆN',
        dataIndex: 'plus',
    },
    {
        title: '',
        dataIndex: 'action'
    }
];

const columnsLeft = [
    {
        title: '#',
        dataIndex: 'stt'
    },
    {
        title: 'Tên sự kiện',
        dataIndex: 'name',
    },
    {
        title: '',
        dataIndex: 'action'
    }
];


const Manage = () => {

    const user = userService.get();

    const [dataLeft, setDataLeft] = useState([]);
    const [dataRight, setDataRight] = useState([]);

    useEffect(()=>{
        getDataEvent();
        getDataStudent()
    },[])

    const handleDelEvent = async (id) => {
        console.log(id);
        let response;
        let code;
        await axios.delete(`http://localhost:2002/events/${id}`)
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});
        if ( code === 200 ) {
            getDataEvent();
        }
    }

    const handleEdit = (id) => {
        console.log('edit')
    }

    const getDataEvent = async () => {
        let response;
        let code = 222;
        await axios.get(`http://localhost:2002/events`)
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});
        if ( code === 200 ) {
            let tmp = response.data;
            for ( let i = 0; i < tmp.length; i++) {
                tmp[i].stt = i+1;
                tmp[i].action = <Image onClick={() => showDeleteConfirm(tmp[i].id)} className='icon-del' src = 'image/delete.png' preview = {false} />
            }
            setDataLeft(tmp);
        }
    }

    const getDataStudent = async () => {
        let response;
        let code = 222;
        await axios.get(`http://localhost:2002/students`)
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});
        if ( code === 200 ) {
            let tmp = response.data;
            for ( let i = 0; i < tmp.length; i++) {
                tmp[i].stt = i+1;
                tmp[i].plus = '+' + tmp[i].plus;
                tmp[i].action = <Image className='icon-edit' onClick={() => hanleOpenEdit(tmp[i])} src = 'image/edit.png' preview = {false} />
            }
            setDataRight(tmp);
        }
    }
    const [selectedRowKeysLeft, setSelectedRowKeysLeft] = useState([]);
    const onSelectChangeLeft = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeysLeft(newSelectedRowKeys);
    };

    const [selectedRowKeysRight, setSelectedRowKeysRight] = useState([]);
    const onSelectChangeRight = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeysRight(newSelectedRowKeys);
    };
    const rowSelectionLeft = {
        selectedRowKeysLeft,
        onChange: onSelectChangeLeft,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return false;
                        }
                        return true;
                    });
                    setSelectedRowKeysLeft(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                        return true;
                        }
                        return false;
                    });
                    setSelectedRowKeysLeft(newSelectedRowKeys);
                },
            },
        ],
    };

    const rowSelectionRight = {
        selectedRowKeysRight,
        onChange: onSelectChangeRight,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return false;
                        }
                        return true;
                    });
                    setSelectedRowKeysRight(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                        return true;
                        }
                        return false;
                    });
                    setSelectedRowKeysRight(newSelectedRowKeys);
                },
            },
        ],
    };


    const showDeleteConfirm = (id) => {
        confirm({
          title: 'Bạn chắc chắn muốn xóa sự kiện này?',
          icon: <ExclamationCircleFilled />,
          content: '',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            handleDelEvent(id)
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [openModalAddStudent, setOpenModalAddStudent] = React.useState(false);
    const handleOpenStudent = () => {
        setOpenModalAddStudent(true);
    };
    const handleCloseStudent = () => {
        setOpenModalAddStudent(false);
    };

    const [startDate, setStartDate] = React.useState(false);

    function selectStartDate(date, dateString) {
        setStartDate(dateString);
    }

    const [endDate, setEndDate] = React.useState(false);

    function selectEndDate(date, dateString) {
        setEndDate(dateString);
    }

    const [nameEvent, setNameEvent] = useState('');
    const [address, setAddress] = useState('')
    
    const handleAddEvent = async () => {
        let response;
        let code;
        await axios.post(`http://localhost:2002/events`, {
            name: nameEvent,
            address: address,
            timeStart: startDate,
            timeEnd: endDate,
            teacherId: user.id
        })
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});
        if ( code === 200 ) {
            console.log(response)
        }
        getDataEvent();
        handleClose();
    }

    const [nameStudent, setNameStudent] = useState('');
    const [mssv, setMSSV] = useState('');
    const [lop, setLop] = useState('');

    const handleAddStudent = async () => {
        let response;
        let code;
        await axios.post(`http://localhost:2002/students`, {
            name: nameStudent,
            dob: '2023-01-01',
            lop: lop,
            mssv: mssv
        })
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});
        if ( code === 200 ) {
            console.log(response)
        }
        getDataStudent();
        handleCloseStudent();
    }

    const [nameEdit, setNameEditStudent] = useState('');
    const [mssvEdit, setEditMSSV] = useState('')
    const [lopEdit, setEditLop] = useState('');
    const [idEdit, setIdEdit] = useState('');

    const [openModalEditStudent, setOpenModalEditStudent] = useState(false);

    const handleCloseEditStudent = () => {
        setOpenModalEditStudent(false);
    }

    const hanleOpenEdit = (student) => {
        setNameEditStudent(student.name);
        setEditMSSV(student.mssv);
        setEditLop(student.lop);
        setIdEdit(student.id);
        setOpenModalEditStudent(true);
    }

    const handleEditStudent = async () => {
        let response;
        let code;
        await axios.put(`http://localhost:2002/students/${idEdit}`, {
            name: nameEdit,
            lop: lopEdit,
            mssv: mssvEdit
        })
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});
        if ( code === 200 ) {
            console.log(response)
        }
        getDataStudent();
        handleCloseEditStudent();
    }

    return ( 
        <div className='manage'>
            <Row className='header-manage'>
                <Col  className='a-manage' span={18}>
                    <Image className = 'logo-manage' src = 'image/logo-manage.png' preview = {false} />
                </Col>
                <Col span={5} className='info'>
                    <Image className='avatar' src='image/avatar.png' preview={false} />
                    <p className='name'>{user.name}</p>
                    <Image className='more' src='image/Vector.png' preview={false} />
                </Col>
            </Row>
            <Row className='manage-content'>
                <Col className='left' span={8}>
                    <div className='info-teacher'>
                        <p>Thông tin giảng viên</p>
                        <div className='info-teacher-content'>
                            <Image className = 'logo-content' src = 'image/avatar.png' preview = {false} />
                            <div className='info-text'>
                                <p>Họ và tên: {user.name}</p>
                                <p>Chức vụ: Giảng viên</p>
                                <p>Khoa: {user.department}</p>
                                <p>Vị trí: {user.position}</p>
                            </div>
                        </div>
                    </div>
                    <div className='header-table-left'>
                        <Image className = 'logo-filter' src = 'image/filter.png' preview = {false} />
                        <Input.Search
                            allowClear
                            style={{
                                width: '50%',
                            }}
                            defaultValue=""
                            placeholder='Tìm kiếm'

                        />
                        <Button onClick={handleOpen} className='btn-add-tbleft'>Thêm</Button>
                        <Modal title="Thêm sự kiện" visible={open}
                            onOk={handleAddEvent} onCancel={handleClose}>
                                <Row>
                                    <p>Tên sự kiện</p>
                                    <Input onChange={(e) => setNameEvent(e.target.value)} className='input-nameEvent' placeholder="Nhập tên sự kiện" />
                                </Row>
                                <Row style={{marginTop: 10}}>
                                    <p>Địa chỉ</p>
                                    <Input onChange={(e) => setAddress(e.target.value)} className='input-address' placeholder="Nhập địa điểm" />
                                </Row>
                                <div style={{marginTop:10}}>
                                    <p>Thời gian diễn ra sự kiện</p>
                                    <Row>
                                        <Col style={{marginLeft:30}} span={6}>
                                            <p>Ngày bắt đầu</p>
                                        </Col>
                                        <Col>
                                            <Space direction="vertical" size={12}>
                                                <DatePicker onChange={selectStartDate} />
                                            </Space>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col style={{marginLeft:30}} span={6}>
                                            <p>Ngày kết thúc</p>
                                        </Col>
                                        <Col>
                                            <Space direction="vertical" size={12}>
                                                <DatePicker onChange={selectEndDate} />
                                            </Space>
                                        </Col>
                                    </Row>
                                    
                                </div>
                        </Modal>
                    </div>
                    <Table 
                        className='table-left' 
                        rowSelection={rowSelectionLeft} 
                        columns={columnsLeft} 
                        dataSource={dataLeft} 
                    />
                </Col>
                <Col span={15}>
                    <div className='header-table-right'>
                        <Image className = 'logo-filter' src = 'image/filter.png' preview = {false} />
                        <Input.Search
                            allowClear
                            style={{
                                width: '50%',
                            }}
                            defaultValue=""
                            placeholder='Tìm kiếm'

                        />
                        <Button className='btn-import'>Import file</Button>
                        <Button className='btn-export'>Xuất file</Button>
                        <Button onClick={handleOpenStudent} className='btn-add-tbleft'>Thêm</Button>
                        <Button className='btn-delete'>Xóa</Button>
                    </div>
                    <Table 
                        className='table-right' 
                        rowSelection={rowSelectionRight} 
                        columns={columnsRight} 
                        dataSource={dataRight} 
                        pagination= {{defaultPageSize:15}}
                    />
                </Col>
            </Row>
            <Modal title="Thêm sinh viên" visible={openModalAddStudent}
                onOk={handleAddStudent} onCancel={handleCloseStudent}>
                    <Row>
                        <p>Tên sinh viên</p>
                        <Input onChange={(e) => setNameStudent(e.target.value)} className='input-nameStudent' placeholder="Nhập tên sinh viên" />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <p>Mã số sinh viên</p>
                        <Input onChange={(e) => setMSSV(e.target.value)} className='input-address' placeholder="Nhập mã số sinh viên" />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <p>Lớp</p>
                        <Input onChange={(e) => setLop(e.target.value)} className='input-address' placeholder="Nhập lớp sinh viên" />
                    </Row>
            </Modal>

            <Modal title="Sửa thông tin sinh viên" visible={openModalEditStudent}
                onOk={handleEditStudent} onCancel={handleCloseEditStudent}>
                    <Row>
                        <p>Tên sinh viên</p>
                        <Input onChange={(e) => setNameEditStudent(e.target.value)} value={nameEdit} className='input-nameStudent' placeholder="Nhập tên sinh viên" />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <p>Mã số sinh viên</p>
                        <Input onChange={(e) => setEditMSSV(e.target.value)} value={mssvEdit} className='input-address' placeholder="Nhập mã số sinh viên" />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <p>Lớp</p>
                        <Input onChange={(e) => setEditLop(e.target.value)} value={lopEdit} className='input-address' placeholder="Nhập lớp sinh viên" />
                    </Row>
            </Modal>
        </div>
    );
}

export default Manage;