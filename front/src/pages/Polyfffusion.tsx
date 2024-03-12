import { Button, Form } from "react-bootstrap";
import Header from "../components/header";
import * as formik from "formik";
import * as yup from "yup";
import axios from "axios";
import { FormikProps } from "formik";
import React, { useState, createContext, useContext } from "react";
import { MuiFileInput } from "mui-file-input";
import Typography from "@mui/material/Typography";
import ErrorMsg from "../components/error_msg";

interface FormValues {
  acc: File | null;
}
const validationSchema = yup.object().shape({
  acc: yup.mixed().required('伴奏 is required'),
});
const AudioContext1 = createContext<React.Dispatch<React.SetStateAction<string | null>> | undefined>(undefined);

const Polyffusion = () => {
  const [audioSrc1, setAudioSrc1] = useState<string | null>(null);

  return (
    <div>
      <Header />
      <h1>Polyffusion</h1>
      <p>
        画像生成で話題になったDiffusionモデルを音楽に適用したAIで、多様な曲を作ります。
          <br />
        論文情報: Min et al., Polyffusion: A Diffusion Model for Polyphonic Score Generation with Internal and External Controls, ISMIR 2023.
      </p>
      <AudioContext1.Provider value={setAudioSrc1}>
        <div>
          <h2>伴奏に対するメロディー生成</h2>
          <PolyffusionForm1 />
          {audioSrc1 && <audio src={audioSrc1} controls/>}
        </div>
      </AudioContext1.Provider>
    </div>
  );
};

const PolyffusionForm1 = () => {
  const { Formik } = formik;
  const schema = yup.object().shape({
    chd: yup.mixed().required(),
    txt: yup.mixed().required(),
  });
  const setAudioSrc = useContext(AudioContext1);

  const [isPosting, setIsPosting] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (values: FormValues, actions: any) => {
    console.log(typeof values.acc);
    setIsPosting(true);
    try {
      const formData = new FormData();
      formData.append("acc", values.acc as Blob);

      console.log(formData, typeof formData);

      const response = await axios.post(
        "https://mgap-demo-api.sawapipipi.mydns.jp/generate/polyffusion/melody-from-accompaniment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        },
      );

      console.log("Success:", response.data);

      // BlobからURLを生成
      const audioUrl = URL.createObjectURL(response.data);
      // 状態更新関数を用いて親コンポーネントまたは適切な状態管理場所にURLをセット
      setAudioSrc && setAudioSrc(audioUrl);
    } catch (error) {
      console.error("Error:", error);
      setIsError(true);
    } finally {
      setIsPosting(false);
      actions.setSubmitting(false);
    }
  };

  const initialValues: FormValues = {
    acc: null,
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
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}>
        {({
          handleSubmit,
          handleChange,
          setFieldValue,
          values,
          errors,
        }: FormikProps<FormValues>) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className='position-relative mb-3'>
              <Form.Label>伴奏ファイル（.mid）</Form.Label>
              <Form.Control
                type='file'
                required
                name='acc'
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const files = event.target.files;
                  if (files) setFieldValue("acc", files[0]);
                }}
                isInvalid={!!errors.acc}
              />
              <Form.Control.Feedback type='invalid' tooltip>
                {errors.acc}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type='submit' disabled={isPosting}>{!isPosting ? "曲を作成" : "生成中"}</Button>
            {isError && <ErrorMsg />}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Polyffusion;
