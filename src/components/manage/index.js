import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { Image, Input, Button, Row, Col, Table, Modal, Tooltip  } from 'antd';
// import Modal from '@mui/material/Modal';
import { ExclamationCircleFilled } from '@ant-design/icons';
import './style.css'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { userService } from '../../service/user';
import { DatePicker, Space } from 'antd';
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;


const { confirm } = Modal;

const headers = [
    { label: "HỌ TÊN", key: "name" },
    { label: "MSSV", key: "mssv" },
    { label: "LỚP", key: "lop" },
    { label: "ĐIỂM CỘNG RÈN LUYỆN", key: "plus" }
];

const columnsRight1 = [
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
    },
    {
        title: '',
        dataIndex: 'view'
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
        title: 'Điểm cộng',
        dataIndex: 'plus',
    },
    {
        title: '',
        dataIndex: 'action'
    },
    {
        title: '',
        dataIndex: 'filter'
    }
];

const columnsModal = [
    {
        title: '#',
        dataIndex: 'stt'
    },
    {
        title: 'Tên sự kiện',
        dataIndex: 'name',
    },
    {
        title: 'Điểm cộng',
        dataIndex: 'plus',
    },
    {
        title: 'Địa điểm',
        dataIndex: 'address'
    },
    {
        title: 'Thời gian bắt đầu',
        dataIndex: 'timeStart'
    },
    {
        title: 'Thời gian kết thúc',
        dataIndex: 'timeEnd'
    },
];

const columnsFilter = [
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
        title: 'Đã điểm danh',
        dataIndex: 'check'
    },
    {
        title: '',
        dataIndex: 'action'
    },
    {
        title: '',
        dataIndex: 'view'
    }
]


const columnsAddStudentOfEvent = [
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
    },
]
const columnsCurrentStudentOfEvent = [
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
]

const data = [
    {
        name: 'manh',
        lop : '123',
        mssv: '1',
        plus: 1
    }
]

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

    const csvReport = {
        data: data,
        headers: headers,
        filename: 'data.csv'
      };

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
                tmp[i].plus = '+' + tmp[i].plus;
                tmp[i].action =  <Tooltip title='Xóa'><Image onClick={() => showDeleteConfirm(tmp[i].id)} className='icon-del' src = 'image/delete.png' preview = {false} /></Tooltip>
                tmp[i].filter = <Tooltip title='Lọc'><Image onClick={() => filterStudentByEvent(tmp[i])} className='icon-filter' src = 'image/filter.png' preview = {false} /></Tooltip>
            }
            setDataLeft(tmp);
        }
    }

    const [eventFilterId, setEventFilterId] = useState('');

    const filterStudentByEvent = async (event) => {
        setEventFilter(event.name);
        setEventFilterId(event.id);
        setColumnsRight(columnsFilter)
        setIsDis(false);
        let response;
        let code = 222;
        await axios.get(`http://localhost:2002/studentEvents/event/${event.id}`)
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});
        if ( code === 200 ) {
            let tmp = [];

            for ( let i = 0; i < response.data.length; i++) {
                tmp.push({...response.data[i].student, check: response.data[i].check})
            }
            console.log(tmp);
            if ( tmp.length > 0 ) {
                for ( let i = 0; i < tmp.length; i++) {
                    tmp[i].stt = i+1;
                    tmp[i].plus = '+' + tmp[i].plus;
                    tmp[i].action = <Tooltip title='Xóa'><Image className='icon-edit' onClick={() => handleDeleteStudentofEvent(tmp[i], event)} src = 'image/delete.png' preview = {false} /></Tooltip>
                    tmp[i].view = <Tooltip title='Xem chi tiết'><Image className='icon-view' onClick={() => openView(tmp[i])} src = 'image/view.png' preview = {false} /></Tooltip>
                }
            }
            setDataRight(tmp);
        }
    }

    const handleDeleteStudentofEvent = async (student, event) => {
        let response;
        let code = 222;
        console.log(student);
        console.log(event)
        await axios.delete(`http://localhost:2002/studentEvents/delete`, {
            data: {
                studentMSSV: student.mssv,
                eventName: event.name
            }
        })
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});
        if ( code === 200 ) {
        }
        await hi(event);
    }

    const hi = async (event) => {
        let response;
        let code = 222;
        await axios.get(`http://localhost:2002/studentEvents/event/${event.id}`)
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});
        if ( code === 200 ) {
            let tmp = [];

            for ( let i = 0; i < response.data.length; i++) {
                tmp.push({...response.data[i].student, check: response.data[i].check})
            }
            console.log(tmp);
            if ( tmp.length > 0 ) {
                for ( let i = 0; i < tmp.length; i++) {
                    tmp[i].stt = i+1;
                    tmp[i].plus = '+' + tmp[i].plus;
                    tmp[i].action = <Tooltip title='Xóa'><Image className='icon-edit' onClick={() => handleDeleteStudentofEvent(tmp[i])} src = 'image/delete.png' preview = {false} /></Tooltip>
                    tmp[i].view = <Tooltip title='Xem chi tiết'><Image className='icon-view' onClick={() => openView(tmp[i])} src = 'image/view.png' preview = {false} /></Tooltip>
                }
            }
            setDataRight(tmp);
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
                tmp[i].action = <Tooltip title='Sửa'><Image className='icon-edit' onClick={() => hanleOpenEdit(tmp[i])} src = 'image/edit.png' preview = {false} /></Tooltip>
                tmp[i].view = <Tooltip title='Xem chi tiết'><Image className='icon-view' onClick={() => openView(tmp[i])} src = 'image/view.png' preview = {false} /></Tooltip>
            }
            setDataRight(tmp);
        }
    }

    const [dataModal, setDataModal] = useState([]);

    const openView = async (student) => {
        setOpenModalView(true);
        let response;
        let code = 222;
        await axios.get(`http://localhost:2002/studentEvents/student/${student.id}`)
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});
        if ( code === 200 ) {
            let tmp = [];

            for ( let i = 0; i < response.data.length; i++) {
                tmp.push(response.data[i].event)
            }
            console.log(tmp);
            if ( tmp.length > 0 ) {
                for ( let i = 0; i < tmp.length; i++) {
                    tmp[i].stt = i+1;
                    let startDate = new Date(tmp[i].timeStart);
                    const tmpStart = startDate.getDate() + '-' + ( startDate.getMonth()+1) + '-' + startDate.getFullYear();
                    tmp[i].timeStart = tmpStart;
                    let endDate = new Date(tmp[i].timeEnd);
                    const tmpEnd = endDate.getDate() + '-' + ( endDate.getMonth()+1) + '-' + endDate.getFullYear();
                    tmp[i].timeEnd = tmpEnd;
                    tmp[i].plus = '+' + tmp[i].plus;
                }
            }
            setDataModal(tmp);
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

    const [columnsRight, setColumnsRight] = useState(columnsRight1);

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
        setNameStudent("");
        setMSSV("");
        setLop("")
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
    const [plus, setPlus] = useState('');
    
    const handleAddEvent = async () => {
        let response;
        let code;
        await axios.post(`http://localhost:2002/events`, {
            name: nameEvent,
            address: address,
            timeStart: startDate,
            timeEnd: endDate,
            plus: +plus,
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
            mssv: mssv,
            plus: 0
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
        setEventFilter('Chưa chọn sự kiện')
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

    const handleCloseView = () => {
        setOpenModalView(false);
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

    const csvLinkEl = useRef();

    const downloadReport = async () => {
        csvLinkEl.current.link.click();
      }

    const [eventFilter, setEventFilter] = useState('Chưa chọn sự kiện')

    const [openModalView, setOpenModalView] = useState(false);

    const navigate = useNavigate();

    const logout = () => {
        userService.logout();
        navigate('/')
    }
    
    const delFilter = () => {
        setEventFilter('Chưa chọn sự kiện');
        setIsDis(true);
        getDataStudent();
        setColumnsRight(columnsRight1)
    }

    const [isDis, setIsDis] = useState(true);

    const [isOpenModalAddStudentOfEvent, setIsOpenModalAddStudentOfEvent] = useState(false);
    
    const handleAddStudentOfEvent = async (student) => {
        console.log(student);
        
        let response;
        let code;
        await axios.post(`http://localhost:2002/studentEvents`, {
            studentMSSV: student.mssv,
            eventName: eventFilter
        })
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});
        if ( code === 200 ) {
            console.log(response)
        }

        getDataAddStudentOfEvent();
    }

    const getDataAddStudentOfEvent = async () => {
        let response;
        let code = 222;
        await axios.get(`http://localhost:2002/students`)
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});

            
        let response2;
        let code2;

        console.log(eventFilterId)
        
        await axios.get(`http://localhost:2002/studentEvents/event/${eventFilterId}`)
            .then( res => {
                response2 = res.data;
                code2 = 200;
            })
            .catch(error => {console.log(error)});
        let tmp1, tmp;
        if ( code2 === 200 ) {
            tmp1 = [];

            for ( let i = 0; i < response2.data.length; i++) {
                tmp1.push(response2.data[i].student);
            }
            if ( tmp1.length > 0)
                for ( let i = 0; i < tmp1.length; i++) {
                    tmp1[i].stt = i+1;
                    tmp1[i].plus = '+' + tmp1[i].plus;
                }
            setDataCurrentOfEvent(tmp1);
        }
        if ( code === 200 ) {
            tmp = response.data;
            let ans = [];
            let stt = 1;
            for ( let i = 0; i < tmp.length; i++) {
                let check = 0;
                for ( let j = 0; j < tmp1.length; j++) {
                    if ( tmp[i].mssv == tmp1[j].mssv ) {
                        check = 1;
                    }
                }
                if ( check!=0 ) {
                    continue;
                }
                tmp[i].stt = stt;
                stt++;
                tmp[i].plus = '+' + tmp[i].plus;
                tmp[i].action = <Tooltip title='Thêm sinh viên'><Image className='icon-add-student-event' onClick={() => handleAddStudentOfEvent(tmp[i])} src = 'image/add-person.png' preview = {false} /></Tooltip>
                ans.push(tmp[i]);
            }
            setDataAdd(ans);
        }
    }

    const handleOpenModalAddStudentOfEvent = () => {
        setIsOpenModalAddStudentOfEvent(true);
        getDataAddStudentOfEvent();

    }

    const handleCloseModalAddStudentOfEvent = () => {
        setIsOpenModalAddStudentOfEvent(false);
    }

    const handleOKAddStudentOfEvent = () => {

    }

    const [dataModalAdd, setDataAdd] = useState([]);

    const [dataCurrentOfEvent, setDataCurrentOfEvent] = useState([]);

    const handleSearch = async (e) => {
        const textSearch = e.target.value.toLowerCase();
        let response;
        let code = 222;
        if ( eventFilter=='Chưa chọn sự kiện') {
            console.log('filter all student')
            await axios.get(`http://localhost:2002/students`)
                .then( res => {
                    response = res.data;
                    code = 200;
                })
                .catch(error => {console.log(error)});
            if ( code === 200 ) {
                let tmp = response.data;
                let tmp2 = [];
                for ( let i = 0; i < tmp.length; i++) {
                    tmp[i].stt = i+1;
                    tmp[i].plus = '+' + tmp[i].plus;
                    tmp[i].action = <Tooltip title='Sửa'><Image className='icon-edit' onClick={() => hanleOpenEdit(tmp[i])} src = 'image/edit.png' preview = {false} /></Tooltip>
                    tmp[i].view = <Tooltip title='Xem chi tiết'><Image className='icon-view' onClick={() => openView(tmp[i])} src = 'image/view.png' preview = {false} /></Tooltip>
                    if ( tmp[i].name.toLowerCase().includes(textSearch) || tmp[i].lop.toLowerCase().includes(textSearch)) {
                        tmp2.push(tmp[i]);
                    }
                }
                setDataRight(tmp2);
            }
        } else {
            console.log('filter all student of event')
            await axios.get(`http://localhost:2002/studentEvents/event/${eventFilterId}`)
            .then( res => {
                response = res.data;
                code = 200;
            })
            .catch(error => {console.log(error)});
            if ( code === 200 ) {
                let tmp = [];

                for ( let i = 0; i < response.data.length; i++) {
                    tmp.push({...response.data[i].student, check: response.data[i].check})
                }
                console.log(tmp);
                let tmp2 = [];
                if ( tmp.length > 0 ) {
                    for ( let i = 0; i < tmp.length; i++) {
                        tmp[i].stt = i+1;
                        tmp[i].plus = '+' + tmp[i].plus;
                        tmp[i].action = <Tooltip title='Xóa'><Image className='icon-edit' src = 'image/delete.png' preview = {false} /></Tooltip>
                        tmp[i].view = <Tooltip title='Xem chi tiết'><Image className='icon-view' onClick={() => openView(tmp[i])} src = 'image/view.png' preview = {false} /></Tooltip>
                        if ( tmp[i].name.toLowerCase().includes(textSearch) || tmp[i].lop.toLowerCase().includes(textSearch)) {
                            tmp2.push(tmp[i]);
                        }
                    }
                }
                setDataRight(tmp2);
            }
        }
        
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
                    <Tooltip title="Đăng xuất">
                        <Image onClick={logout} className='more' src='image/logout.png' preview={false} />
                    </Tooltip>
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
                                <Row style={{marginTop: 10}}>
                                    <p>Điểm cộng</p>
                                    <Input onChange={(e) => setPlus(e.target.value)} className='input-address' placeholder="Nhập điểm cộng" />
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
                            onChange={(e) => handleSearch(e)}
                        />
                        <Button className='btn-import'>Import file</Button>

                        <Button className='btn-export' onClick={() => downloadReport()}>
                            Xuất file
                        </Button>
                        <CSVLink
                            headers={headers}
                            filename="data.csv"
                            data={dataRight}
                            ref={csvLinkEl}
                        />
                        <Button onClick={handleOpenStudent} className='btn-add-tbleft'>Thêm</Button>
                        <Button className='btn-delete'>Xóa</Button>
                    </div>
                    <div className='event-filter'>
                        <p>Sự kiện: {eventFilter}</p>
                        <Image onClick={delFilter} className = 'icon-x' src = 'image/x-circle.png' preview = {false} />
                        <Button disabled={isDis} onClick={handleOpenModalAddStudentOfEvent} className='btn-add-tbleft'>Thêm sinh viên cho sự kiện</Button>
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
                        <Input value={nameStudent} onChange={(e) => setNameStudent(e.target.value)} className='input-nameStudent' placeholder="Nhập tên sinh viên" />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <p>Mã số sinh viên</p>
                        <Input value={mssv} onChange={(e) => setMSSV(e.target.value)} className='input-address' placeholder="Nhập mã số sinh viên" />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <p>Lớp</p>
                        <Input value={lop}  onChange={(e) => setLop(e.target.value)} className='input-address' placeholder="Nhập lớp sinh viên" />
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

            <Modal title="Danh sách sự kiện tham gia" visible={openModalView}
                okButtonProps={{ style: { display: 'none' } }} onCancel={handleCloseView} width={800}>
                    <Table 
                        className='table-modal' 
                        rowSelection={rowSelectionLeft} 
                        columns={columnsModal} 
                        dataSource={dataModal} 
                    />
            </Modal>

            <Modal title="Thêm sinh viên vào sự kiện" visible={isOpenModalAddStudentOfEvent}
                okButtonProps={{ style: { display: 'none' } }} onCancel={handleCloseModalAddStudentOfEvent} width={1200}>
                    <Row>
                        <Col span={12}>
                            <h4>Sinh viên đã đăng kí</h4>
                            <Table 
                                className='table-modal' 
                                columns={columnsCurrentStudentOfEvent} 
                                dataSource={dataCurrentOfEvent} 
                            />
                        </Col>
                        <Col span={12}>
                            <h4 className='table-modal-2'>Sinh viên chưa đăng kí</h4>
                            <Table 
                                className='table-modal-2' 
                                columns={columnsAddStudentOfEvent} 
                                dataSource={dataModalAdd} 
                            />
                        </Col>
                    </Row>
                    
            </Modal>
        </div>
    );
}

export default Manage;