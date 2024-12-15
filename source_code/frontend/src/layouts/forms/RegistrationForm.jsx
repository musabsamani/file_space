import React from 'react'
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import Input from '../../components/_include/forms/_input'
import CheckBox from '../../components/_include/forms/_checkbox'
import { userRegistrationSchema } from '../../validations/user';
import { registerUser } from '../../services/api';
import { useMyContext } from '../../context/ContextProvider'
import { handleServiceError } from '../../utils/handleServiceError';

const RegistrationForm = () => {
    const { setUser, setToken } = useMyContext()
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(userRegistrationSchema) })

    const onSubmit = async (data) => {
        try {
            const res = await registerUser(data);
            const user = res.data.data;
            toast.success("User registered successfully");
            setUser(user);
            navigate("/login")
        } catch (error) {
            handleServiceError({ error, operation: "Registration" });
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
                        Track views and manage your content with a simple and an intuitive user interface.
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
                        <div className="col-span-6 flex flex-col gap-4 sm:flex-row sm:items-center text-white">
                            <button type="submit"
                                className="hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 transition inline-block shrink-0 rounded-md border-2 border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium">
                                Create an account
                            </button>

                            <p className="text-sm text-gray-500 m-0">
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