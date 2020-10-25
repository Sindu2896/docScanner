import React,{useState} from 'react'
import {
    Form,
    Select,
    Button,
    Upload,
    Typography,
    Modal
  } from 'antd';
  import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
  
  const {Text} = Typography
  
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  
  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  
  const FileUploader = () => {

    const [file,setFile] = useState({})
    const [loading,setLoading] = useState(false)
    const [blockButton,setBlockButton] = useState(true)
    const [viewModal, setViewModal] = useState(false)
    const [resData, setResData] = useState('')


    const handleUpload = ({ fileList }) => {
        //---------------^^^^^----------------
        // this is equivalent to your "const img = event.target.files[0]"
        // here, antd is giving you an array of files, just like event.target.files
        // but the structure is a bit different that the original file
        // the original file is located at the `originFileObj` key of each of this files
        // so `event.target.files[0]` is actually fileList[0].originFileObj
        console.log('fileList', fileList);
    
        // you store them in state, so that you can make a http req with them later
        setFile({ fileList });
        setBlockButton(!blockButton)
      };

    const handleSubmit = event => {
        event.preventDefault();
        setLoading(true)
        let formData = new FormData();
        // add one or more of your files in FormData
        // again, the original file is located at the `originFileObj` key
        formData.append("file", file.fileList[0].originFileObj);
    
        axios
          .post(`${process.env.REACT_APP_SCANNER_URI}/DOC/v1/scan`, formData)
          .then(res => {
            console.log("res", res);
            setResData(res.data.original)
            setLoading(false)
            setViewModal(true)
          })
          .catch(err => {
            console.log("err", err);
          });
      };
  
    return (
    <>
      <Form
        name="validate_other"
        {...formItemLayout}
      >
        <Text>DOC-Scanner</Text>
        <Form.Item label="Dragger">
          <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
            <Upload.Dragger name="files" onChange={handleUpload} multiple={true} beforeUpload={() => false}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single upload.</p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
  
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
         
          <Button type="primary" htmlType="submit" onClick={handleSubmit} loading={loading} disabled={blockButton}>
            Submit 
          </Button>
        </Form.Item>
      </Form>
      <Modal
       title='ID Scanner Information'
       visible={viewModal}
       onCancel={() => setViewModal(false)}
       onOk={ () => setViewModal(false)}>
           <span style={{whiteSpace: "pre-line"}}>{resData}</span>
      </Modal>
    </>
    );
  };

export default FileUploader