import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import WithAuthentication from '@/utils/WithAuthentication';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';

const schema = yup
  .object()
  .shape({
    email: yup.string().required()
  })
  .required();

const Reset = () => {
  const [isLoading, setIsLoading] = useState(false);

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
  const resetPasword = async (formdata) => {
    setIsLoading(true);

    // creating new account
    try {
      await sendPasswordResetEmail(getAuth(), formdata.email);

      toast.success('Reset email sent successfully...');
      setIsLoading(false);
      reset();
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  const watchAll = watch();

  useEffect(() => {
    // console.log(errors, watchAll);
  }, [errors, watchAll]);

  return (
    <WithAuthentication>
      <div className="h-screen bg-silent bg-no-repeat bg-cover grid place-content-center">
        <form onSubmit={handleSubmit(resetPasword)} className="bg-[#D9D9D9] bg-opacity-5 border border-white border-opacity-10 rounded-xl w-[550px] px-10 py-10">
          <h2 className="text-2xl text-white">Let&apos;s Manage</h2>
          <p className="text-white mb-8">Let&apos;s manage the amazing team</p>
          <div className="mb-4">
            <label htmlFor="email" className="text-white mb-1.5 block">
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

          <Link href="/login" legacyBehavior>
            <a className="mb-6 text-gray-200 hover:text-white cursor-pointer">Already have an account?</a>
          </Link>

          <div className="flex justify-center w-full mt-6">
            <button type={isLoading === true ? 'button' : 'submit'} className="bg-primary hover:bg-hoverPrimary px-4 py-2 w-full font-medium rounded-xl text-white">
              {isLoading === true ? 'Reseting...' : 'Reset'}
            </button>
          </div>
        </form>
      </div>
    </WithAuthentication>
  );
};

export default Reset;
