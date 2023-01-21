import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { XMarkIcon } from '@heroicons/react/24/solid';
import WithAuthentication from '@/utils/WithAuthentication';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

const schema = yup
  .object()
  .shape({
    username: yup.string().required(),
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required()
  })
  .required();

const Invite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrors, setIsErrors] = useState('');
  const [step, setStep] = useState(1);
  const [isInvitationLinkValid, setIsInvitationLinkValid] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema)
  });

  // router
  const { query: routerQuery, push } = useRouter();

  // getting all tasks
  useEffect(() => {
    if (Object.keys(routerQuery).length > 0) {
      if (Object.keys(routerQuery).length < 2 && Object.keys(routerQuery)[0] === 'secret') {
        (async () => {
          const q = query(collection(getFirestore(), 'invitations'), where('key', '==', routerQuery.secret));

          const snap = await getDocs(q);

          if (snap.size > 0) {
            setIsInvitationLinkValid(true);
          } else {
            setIsInvitationLinkValid(false);
          }
        })();
      } else {
        setIsInvitationLinkValid(false);
      }
    }
  }, [routerQuery]);

  // create a new account
  const createAccount = async (formdata) => {
    setIsLoading(true);
    setIsErrors('');
    let user;

    // creating new account
    try {
      user = await createUserWithEmailAndPassword(getAuth(), formdata.email, formdata.password);
      await sendEmailVerification(getAuth().currentUser);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

    // creating record
    delete formdata.password;

    formdata.role = 'User';
    formdata.status = 'joined';

    try {
      await setDoc(doc(getFirestore(), 'users', user?.user?.uid), formdata);

      toast.success('Please click the verification link sent to you to verify your email...');
      push('/request');
      setIsLoading(false);
      reset();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsErrors(error);
    }
  };

  const watchAll = watch();

  useEffect(() => {
    console.log(errors, watchAll);
  }, [errors, watchAll]);

  if (isInvitationLinkValid === true) {
    return (
      <div className="bg-silent bg-cover bg-no-repeat grid place-content-center h-screen">
        {isInvitationLinkValid === true &&
          (step == 1 ? (
            <div className="text-center">
              <p>Hey, Welcome to the house</p>
              <p>You need to create an account first to continue</p>
              <div className="flex justify-center w-full mt-6">
                <button type="button" className="bg-primary hover:bg-hoverPrimary px-4 py-2 w-full font-medium rounded-xl text-white" onClick={() => setStep(2)}>
                  Create account
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            <form onSubmit={handleSubmit(createAccount)} className="bg-[#D9D9D9] bg-opacity-5 border border-white border-opacity-10 rounded-xl w-[550px] px-10 py-10">
              <h2 className="text-2xl text-white">Let&apos;s Manage</h2>
              <p className="text-white mb-8">Let&apos;s manage the amazing team</p>
              <div className="mb-4">
                <label htmlFor="email" className="text-white mb-1.5 block">
                  Username
                </label>
                <input
                  type="text"
                  className="text-sm px-4 py-1.5 rounded-lg border border-white border-opacity-30 text-white focus:ring-0 outline-none ring-blue-400 w-full bg-transparent"
                  min={5}
                  max={50}
                  required
                  {...register('username')}
                  placeholder="Enter username"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="text-white mb-1.5 block">
                  Name
                </label>
                <input
                  type="text"
                  className="text-sm px-4 py-1.5 rounded-lg border border-white border-opacity-30 text-white focus:ring-0 outline-none ring-blue-400 w-full bg-transparent"
                  min={5}
                  max={50}
                  required
                  {...register('name')}
                  placeholder="Enter your name"
                />
              </div>
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
              <div className="mb-2">
                <label htmlFor="email" className="text-white mb-1.5 block">
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

              <Link href="/login" legacyBehavior>
                <a className="text-gray-200 hover:text-white mb-8 block">Already have an account?</a>
              </Link>

              <div className="flex justify-center w-full">
                <button type={isLoading === true ? 'button' : 'submit'} className="bg-primary hover:bg-hoverPrimary px-4 py-2 w-full font-medium rounded-xl text-white">
                  {isLoading === true ? 'Creating...' : 'Create Account'}
                </button>
              </div>

              {isErrors !== '' && (
                <div className="flex items-center mt-2">
                  <XMarkIcon className="h-5 w-5 stroke-red-400" />
                  <p className="text-white">Looks like email already exist</p>
                </div>
              )}
            </form>
          ) : null)}
      </div>
    );
  }

  if (isInvitationLinkValid === false) {
    return (
      <div className="bg-silent bg-cover bg-no-repeat grid place-content-center h-screen">
        <p className="">Looks like your link isn&apos;t valid....</p>
      </div>
    );
  }

  return (
    <WithAuthentication>
      <div className="bg-silent bg-cover bg-no-repeat grid place-content-center h-screen">
        <p className="">Checking your link....</p>
      </div>
    </WithAuthentication>
  );
};

export default Invite;
