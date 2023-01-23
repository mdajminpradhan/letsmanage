import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import WithAuthentication from '@/utils/WithAuthentication';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import Head from 'next/head';

const schema = yup
  .object()
  .shape({
    email: yup.string().required(),
    password: yup.string().required()
  })
  .required();

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrors, setIsErrors] = useState('');

  // router
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema)
  });

  // create a new account
  const loginAccount = async (formdata) => {
    setIsLoading(true);
    setIsErrors('');

    // creating new account
    try {
      await signInWithEmailAndPassword(getAuth(), formdata.email, formdata.password);
    } catch (error) {
      console.log(error.message);

      error.message === 'Firebase: Error (auth/wrong-password).' && toast.error('Login details are incorrect...');
      setIsLoading(false);
    }

    // redirecting user
    try {
      await push('/');
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const watchAll = watch();

  useEffect(() => {
    // console.log(errors, watchAll);
  }, [errors, watchAll]);

  return (
    <WithAuthentication>
      <Head>
        <title>Let&apos;s Manage</title>
      </Head>
      <div className="h-screen bg-silent bg-no-repeat bg-cover grid place-content-center">
        <form
          onSubmit={handleSubmit(loginAccount)}
          className="bg-[#D9D9D9] bg-opacity-5 border border-white border-opacity-10 rounded-xl w-72 sm:w-[550px] px-5 sm:px-10 py-10"
        >
          <h2 className="text-xl sm:text-2xl text-white">Let&apos;s Manage</h2>
          <p className="text-white text-sm sm:text-base mb-8">Let&apos;s manage the amazing team</p>
          <div className="mb-4">
            <label htmlFor="email" className="text-white  text-sm sm:text-base mb-1.5 block">
              Email address
            </label>
            <input
              type="email"
              className="text-sm px-4 py-1.5 rounded-lg border border-white border-opacity-30 text-white focus:ring-0 outline-none ring-blue-400 w-full bg-transparent"
              min={5}
              max={50}
              required
              {...register('email')}
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="text-white text-sm sm:text-base mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              className="text-sm px-4 py-1.5 rounded-lg border border-white border-opacity-30 text-white focus:ring-0 outline-none ring-blue-400 w-full bg-transparent"
              min={5}
              max={50}
              required
              {...register('password')}
              placeholder="Enter your password"
            />
          </div>

          <Link href="/reset" legacyBehavior>
            <a className="mb-6 text-gray-200 hover:text-white text-sm sm:text-base cursor-pointer">Forgot password?</a>
          </Link>

          <div className="flex justify-center w-full mt-6">
            <button
              type={isLoading === true ? 'button' : 'submit'}
              className="bg-primary hover:bg-hoverPrimary px-4 py-2 w-full font-medium rounded-xl text-white text-sm sm:text-base"
            >
              {isLoading === true ? 'Loging in...' : 'Login'}
            </button>
          </div>

          <Link href="/createaccount" legacyBehavior>
            <a className="text-white text-center text-sm sm:text-base w-full hover:bg-white hover:bg-opacity-20 block mt-4 py-1.5 rounded-xl">
              Create a new account
            </a>
          </Link>

          {isErrors !== '' && (
            <div className="flex items-center mt-2">
              <XMarkIcon className="h-5 w-5 stroke-red-400" />
              <p className="text-white">Looks like email already exist</p>
            </div>
          )}
        </form>
      </div>
    </WithAuthentication>
  );
};

export default Login;
