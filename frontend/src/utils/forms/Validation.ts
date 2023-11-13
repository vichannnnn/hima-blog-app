import * as Yup from 'yup';

export const SignInValidation = Yup.object().shape({
  username: Yup.string().required('Username is required.'),
  password: Yup.string().required('Password is required.'),
});

export const BlogPostValidation = Yup.object({
  title: Yup.string().required('Title is required.'),
  content: Yup.string().required('Content is required.'),
  preview: Yup.string().required('Preview is required.'),
  category: Yup.string().nullable(),
}).required();
