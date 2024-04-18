import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, Select, Modal, Form, Input } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';

const { Title } = Typography;
const { Option } = Select;

const InstanceList = () => {
    const [instances, setInstances] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [filteredInstances, setFilteredInstances] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [instanceToEdit, setInstanceToEdit] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        // Fetch instances from the API
        const fetchInstances = async () => {
            try {
                const response = await axios.get('http://localhost:5000/instances');
                setInstances(response.data.data);
            } catch (error) {
                console.error('Error fetching instances:', error);
            }
        };

        fetchInstances();
    }, []);

    useEffect(() => {
        // Filter instances based on selected city
        if (selectedCity) {
            const filtered = instances.filter(instance => instance.ville.toLowerCase() === selectedCity.toLowerCase());
            setFilteredInstances(filtered);
        } else {
            setFilteredInstances(instances);
        }
    }, [selectedCity, instances]);

    const handleEdit = (instance) => {
        setInstanceToEdit(instance);
        form.setFieldsValue({
            president_email: instance.president_email,
            council_name: instance.council_name,
            ville: instance.ville,
            active: instance.active
        });
        setModalVisible(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios.delete(`http://localhost:5000/instances/${id}`);
                    setInstances(instances.filter(instance => instance.id !== id));
                } catch (error) {
                    console.error('Error deleting instance:', error);
                }
            }
        });
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setInstanceToEdit(null);
        form.resetFields();
    };

    const handleCityChange = (value) => {
        setSelectedCity(value);
    };

    const handleFormSubmit = async (values) => {
        try {
            await axios.put(`http://localhost:5000/instances/${instanceToEdit.id}`, values);
            const updatedInstances = instances.map(instance =>
                instance.id === instanceToEdit.id ? { ...instance, ...values } : instance
            );
            setInstances(updatedInstances);
            handleModalClose();
        } catch (error) {
            console.error('Error updating instance:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ color: '#1890ff' }}>All Instances</Title>
            <Select
                defaultValue=""
                style={{ width: 200, marginBottom: 16 }}
                onChange={handleCityChange}
                placeholder="Select a city"
            >
                <Option value="">All Cities</Option>
                <Option value="Nabeul">Nabeul</Option>
                <Option value="Tunis">Tunis</Option>
                <Option value="Sousse">Sousse</Option>
            </Select>
            <Row gutter={[16, 16]}>
                {filteredInstances.map((instance, index) => (
                    <Col span={8} key={index}>
                        <div style={{ backgroundColor: '#f0f2f5', padding: '16px', borderRadius: '8px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
                            <Title level={4} style={{ marginBottom: '12px', color: '#1890ff' }}>Instance ID: {instance.id}</Title>
                            <p>President Email: {instance.president_email}</p>
                            <p>Council Name: {instance.council_name}</p>
                            <p>Ville: {instance.ville}</p>
                            <p>Active: {instance.active ? <span style={{ color: 'green' }}>Yes</span> : <span style={{ color: 'red' }}>No</span>}</p>
                            <p>Created At: {instance.created_at}</p>
                            <Button type="primary" onClick={() => handleEdit(instance)}>Edit</Button>
                            <Button type="danger" onClick={() => handleDelete(instance.id)} style={{ marginLeft: '8px', backgroundColor:'red', color:'white' }}>Delete</Button>
                        </div>
                    </Col>
                ))}
            </Row>
            <Modal
                title="Edit Instance"
                visible={modalVisible}
                onCancel={handleModalClose}
                footer={null}
            >
                <Form form={form} onFinish={handleFormSubmit}>
                    <Form.Item name="president_email" label="President Email">
                        <Input />
                    </Form.Item>
                    <Form.Item name="council_name" label="Council Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="ville" label="Ville">
                        <Input />
                    </Form.Item>
                    <Form.Item name="active" label="Active">
                        <Select>
                            <Select.Option value={true}>Yes</Select.Option>
                            <Select.Option value={false}>No</Select.Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" >Save</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default InstanceList;
