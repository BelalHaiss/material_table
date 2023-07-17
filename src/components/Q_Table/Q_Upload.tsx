import { Alert, Box, Button, Modal } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import React, { useRef, useState } from 'react';
import XLSX from 'xlsx';
import { FlexCenter } from '../customStyle/FlexCenter';
import { Q_Sheet } from '@/types/question';
import { questSheetTransformer } from './util/Q_table.util';
import { addQuestions } from './util/Q_fetcher';

export const UploadModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        size='small'
        sx={{ borderRadius: '20px' }}
        endIcon={<UploadFileIcon />}
        variant='contained'
        onClick={handleOpen}
      >
        Upload File
      </Button>
      <Modal open={open} onClose={handleClose}>
        <FlexCenter
          sx={{
            flexDirection: 'column',
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '300px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: 1,
            gap: 2
          }}
        >
          <h2 style={{ textTransform: 'uppercase', color: '#2D3748' }}>
            upload csv - xlsx file
          </h2>
          <hr />
          <FileUploader handleClose={handleClose} />
        </FlexCenter>
      </Modal>
    </>
  );
};

type FileProps = {
  handleClose: () => void;
};
const FileUploader = ({ handleClose }: FileProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<null | Q_Sheet[]>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    console.log('drop');
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      // @ts-ignore
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const jsonData = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );
      setJsonData(jsonData as Q_Sheet[]);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      // @ts-ignore
      const data = new Uint8Array(event.target.result);

      const workbook = XLSX.read(data, { type: 'array' });
      const jsonData = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );
      setJsonData(jsonData as Q_Sheet[]);
    };
    reader.readAsArrayBuffer(file);
  };
  const reset = () => {
    setFile(null);
    setJsonData(null);
  };

  const submitData = async () => {
    try {
      const formatedData = jsonData!.map((data) => questSheetTransformer(data));
      await addQuestions(formatedData);
      handleClose();
    } catch (error) {
      alert('error catched');
    }
  };
  return (
    <FlexCenter sx={{ border: `2px dashed ${file ? '#6F6AF8' : '#A0AEC0'}` }}>
      <div
        onDragOver={(e) => e.preventDefault()}
        className='file-droper'
        onDrop={handleFileDrop}
      >
        <div
          style={{
            minHeight: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
          }}
        >
          {file ? (
            <FlexCenter sx={{ flexDirection: 'column', gap: 3 }}>
              <Alert severity='success' color='info'>
                {jsonData?.length}
              </Alert>

              <FlexCenter sx={{ gap: 2 }}>
                <Button
                  variant='contained'
                  sx={{
                    boxShadow: 2,
                    color: 'black',
                    border: '1px solid #A0AEC0',
                    background: 'white',
                    ':hover': {
                      background: 'white'
                    }
                  }}
                  onClick={reset}
                >
                  remove file
                </Button>
                {jsonData && jsonData.length > 0 && (
                  <Button variant='contained' onClick={submitData}>
                    save
                  </Button>
                )}
              </FlexCenter>
            </FlexCenter>
          ) : (
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => inputRef.current!.click()}
            >
              <FlexCenter
                sx={{
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <input
                  hidden
                  ref={inputRef}
                  type='file'
                  onChange={handleFileChange}
                />
                <Button
                  endIcon={<UploadFileIcon />}
                  variant='contained'
                  color='primary'
                >
                  Select a CSV-XLSX File
                </Button>
                <p style={{ fontWeight: 'lighter' }}>
                  or drag and drop it here
                </p>
              </FlexCenter>
            </div>
          )}
        </div>
      </div>
    </FlexCenter>
  );
};
