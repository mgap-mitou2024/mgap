import { Button, Form } from "react-bootstrap";
import Header from "../components/header";
import * as formik from "formik";
import * as yup from "yup";
import axios from "axios";
import { FormikProps } from "formik";
import React, { useState } from "react";
import { MuiFileInput } from "mui-file-input";
import Typography from "@mui/material/Typography";

interface FormValues {
  chd: File | null;
  txt: File | null;
}

const PolydisVae = () => {
  const { Formik } = formik;
  const schema = yup.object().shape({
    chd: yup.mixed().required(),
    txt: yup.mixed().required(),
  });

  const handleSubmit = async (values: FormValues, actions: any) => {
    console.log(typeof values.chd);

    try {
      const formData = new FormData();
      formData.append("chd", values.chd as Blob);
      formData.append("txt", values.txt as Blob);

      console.log(formData, typeof formData);

      const response = await axios.post(
        "https://mgap-demo-api.sawapipipi.mydns.jp/generate/polydis-vae/mix",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const initialValues: FormValues = {
    chd: null,
    txt: null,
  };

  const [file, setFile] = useState<File | null>();
  const handleChangeFile = (
    newFile: React.SetStateAction<File | null | undefined>
  ) => {
    setFile(newFile);
    console.log(file);
  };

  return (
    <div>
      <Header />
      <h1>PolydisVae</h1>
      <p>
        2つのmidファイルを与えると、それらを混ぜた曲を作ります。1つ目のファイルからは音高やコードなどに関する情報を、2つ目からはリズムに関する情報を取り出して、両者を混ぜ合わせた曲を作ります。
        <br />
        論文情報: Wang et al., Learning interpretable representation for
        controllable polyphonic music generation, ISMIR 2020.
      </p>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}>
        {({
          handleSubmit,
          handleChange,
          setFieldValue,
          values,
          errors,
        }: FormikProps<FormValues>) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className='position-relative mb-3'>
              <Form.Label>音高参照ファイル（.mid）</Form.Label>
              <Form.Control
                type='file'
                required
                name='chd'
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const files = event.target.files;
                  if (files) setFieldValue("chd", files[0]);
                }}
                isInvalid={!!errors.chd}
              />
              <Form.Control.Feedback type='invalid' tooltip>
                {errors.chd}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='position-relative mb-3'>
              <Form.Label>リズム参照ファイル（.mid）</Form.Label>
              <Form.Control
                type='file'
                required
                name='txt'
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const files = event.target.files;
                  if (files) setFieldValue("txt", files[0]);
                }}
                isInvalid={!!errors.txt}
              />
              <Form.Control.Feedback type='invalid' tooltip>
                {errors.txt}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type='submit'>曲を作成</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PolydisVae;
