import { Button, Form } from "react-bootstrap";
import Header from "../components/header";
import * as formik from "formik";
import * as yup from "yup";
import axios from "axios";
import { FormikProps } from "formik";
import { useEffect, useState } from "react";

interface FormValues {
  pitchFile: File | null;
  rhythmFile: File | null;
}

const PolydisVae = () => {
  const { Formik } = formik;
  const schema = yup.object().shape({
    pitchFile: yup.mixed().required(),
    rhythmFile: yup.mixed().required(),
  });

  const handleSubmit = async (values: FormValues, actions: any) => {
    console.log(typeof values.pitchFile);

    try {
      const formData = new FormData();
      formData.append("pitchFile", values.pitchFile as Blob);
      formData.append("rhythmFile", values.rhythmFile as Blob);

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
    pitchFile: null,
    rhythmFile: null,
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
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={initialValues}>
        {({
          handleSubmit,
          handleChange,
          values,
          errors,
        }: FormikProps<FormValues>) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className='position-relative mb-3'>
              <Form.Label>音高参照ファイル（.mid）</Form.Label>
              <Form.Control
                type='file'
                required
                name='pitchFile'
                onChange={handleChange}
                value={values.pitchFile ? values.pitchFile.name : ""}
                isInvalid={!!errors.pitchFile}
              />
              <Form.Control.Feedback type='invalid' tooltip>
                {errors.pitchFile}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='position-relative mb-3'>
              <Form.Label>リズム参照ファイル（.mid）</Form.Label>
              <Form.Control
                type='file'
                required
                name='rhythmFile'
                onChange={handleChange}
                value={values.rhythmFile ? values.rhythmFile.name : ""}
                isInvalid={!!errors.rhythmFile}
              />
              <Form.Control.Feedback type='invalid' tooltip>
                {errors.rhythmFile}
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
