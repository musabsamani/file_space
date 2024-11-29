import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/_include/forms/_input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { loginUser } from "../../services/api";
import { userLoginSchema } from "../../validations/user";
import ApiError from "../../errors/ApiError";
import { useMyContext } from "../../context/ContextProvider";

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(userLoginSchema) });
    const { setUser, setToken, isAuthenticated, setIsAuthenticated } = useMyContext()
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const { usernameOrEmail, password } = data;
            const res = await loginUser({ usernameOrEmail, password });
            const { user, token } = res.data.data;
            setIsAuthenticated(true);
            setUser(user);
            setToken(token);
            setTimeout(() => { navigate("/") }, 200)
            toast.success("Login successful!");
        } catch (err) {
            if (err instanceof ApiError) toast.error(<>
                <span className="capitalize">{err.message}</span>
                <br />
                <span>{err.details}</span>
            </>)
            else toast.error("Login failed. unexpected error. Please see the console for more details.");

        }
    };


    useEffect(() => {
        if (isAuthenticated) {
            navigate("/")
        }
    }, [])

    return (
        <div className="lg:grid lg:min-h-full lg:grid-cols-12">
            <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
                <img
                    alt="Login Background"
                    src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </aside>

            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                <div className="max-w-xl lg:max-w-3xl">
                    <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                        Welcome Back to FileSpace 📂
                    </h1>
                    <p className="mt-4 leading-relaxed text-gray-500">
                        Log in to access, upload, and manage your files with ease.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-6 gap-6">
                        {/* Username or Email Field */}
                        <div className="col-span-6">
                            <Input
                                label="Username or Email"
                                name="usernameOrEmail"
                                register={register}
                                type="text"
                                errors={errors}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="col-span-6">
                            <Input
                                label="Password"
                                name="password"
                                register={register}
                                type="password"
                                errors={errors}
                            />
                        </div>

                        <div className="col-span-6 sm:flex sm:items-center sm:gap-4 text-white">
                            <button
                                type="submit"
                                className="hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 transition inline-block shrink-0 rounded-md border-2 border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium"
                            >
                                Log in
                            </button>

                            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                                <span>Don't have an account?</span>{" "}
                                <Link to="/register" className="text-gray-700 underline">
                                    Register
                                </Link>
                                .
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default LoginForm;
