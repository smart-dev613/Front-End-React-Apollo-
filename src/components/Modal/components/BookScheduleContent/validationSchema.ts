import * as Yup from 'yup';

export const validationSchema = (isMeeting: any) => {
  if (isMeeting) {
    return Yup.object().shape({
      venue: Yup.object()
        .nullable()
        // .required('Room is Required'),
    })
  }
  return Yup.object().shape({
    content_package: Yup.object()
      .nullable()
      // .required('Package is Required')
  })
};
