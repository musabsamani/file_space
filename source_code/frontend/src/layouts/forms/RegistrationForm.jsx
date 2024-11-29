import React from 'react'
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import ApiError from '../../errors/ApiError';
import Input from '../../components/_include/forms/_input'
import CheckBox from '../../components/_include/forms/_checkbox'
import { userRegistrationSchema } from '../../validations/user';
import { registerUser } from '../../services/api';
import { useMyContext } from '../../context/ContextProvider'

const RegistrationForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(userRegistrationSchema) })
    const { setUser, setToken } = useMyContext()
    const onSubmit = async (data) => {
        try {
            const { fullname, username, password, email } = data
            const res = await registerUser({ fullname, username, password, email });
            const user = res.data.data;
            setUser(user);
            toast.success("User registered successfully");
        } catch (err) {
            if (err instanceof ApiError) toast.error(<>
                <span className="capitalize">{err.message}</span>
                <br />
                <span>{err.details}</span>
            </>)
            else toast.error("Registration failed");

        }
    }


    return (
        <div className="lg:grid lg:min-h-full lg:grid-cols-12">
            <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
                <img
                    alt=""
                    src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </aside>

            <main
                className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                <div className="max-w-xl lg:max-w-3xl">

                    <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                        Welcome to FileSpace 📂
                    </h1>

                    <p className="mt-4 leading-relaxed text-gray-500">
                        Securely upload, organize, and share your image and video files with ease.
                        Track views and manage your content with a simple drag-and-drop interface.
                    </p>


                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-6 gap-6">
                        <div className="col-span-6">
                            <Input
                                label="Full Name"
                                name="fullname"
                                register={register}
                                type="text"
                                errors={errors}
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <Input
                                label="Username"
                                name="username"
                                register={register}
                                type="text"
                                errors={errors}
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <Input
                                label="Email"
                                name="email"
                                register={register}
                                type="email"
                                errors={errors}
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <Input
                                label="Password"
                                name="password"
                                register={register}
                                type="password"
                                errors={errors}
                            />

                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <Input
                                label="Password Confirmation"
                                name="confirmPassword"
                                register={register}
                                type="password"
                                errors={errors}
                            />
                        </div>

                        <div className="col-span-6">
                            <CheckBox
                                name="marketing_accept"
                                register={register}
                                errors={errors}                                >
                                <p className="text-sm text-gray-500">
                                    By creating an account, you agree to our
                                    <a href="#" className="text-gray-700 underline"> terms and conditions </a>
                                    and
                                    <a href="#" className="text-gray-700 underline"> privacy policy</a>.
                                </p>
                            </CheckBox>
                        </div>
                        <div className="col-span-6 sm:flex sm:items-center sm:gap-4 text-white">
                            <button

                                className="hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 transition inline-block shrink-0 rounded-md border-2 border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium">
                                Create an account
                            </button>

                            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                                <span>Already have an account?</span>
                                {" "}
                                <Link to="/login" className="text-gray-700 underline">Log in</Link>.
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default RegistrationForm