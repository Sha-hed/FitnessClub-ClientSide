import { useForm } from 'react-hook-form';
import login from '../../assets/images/Login.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import auth from '../../firebase/firebase.config'
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth.jsx'
import useAxiosCommon from '../../Hooks/useAxiosCommon.jsx';
const Register = () => {
    const axiosCommon = useAxiosCommon()

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({});
    const { createUser } = useAuth()
    const onSubmit = data => {
        const name = data.Name;
        const photo = data.Photo;
        const email = data.Email;
        const password = data.Password;
        const user = {name, email }
        createUser(email, password)
            .then(() => {
                updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL: photo
                }).then(async () => {
                    const { data } = await axiosCommon.post('/users', user)
                    console.log(data);
                    console.log('Profile Update Successfully At Register Page! Yahu')
                    Toast.fire({
                        icon: "success",
                        title: "Registered successfully"
                    });
                    setTimeout(() => {
                        navigate('/')
                    }, 2500)
                }).catch((error) => {
                    console.log('We got a error man', error)
                    // An error occurred
                    // ...
                });

            })
            .catch(error => console.log(error.message))
    }
    return (
        <div className="max-w-6xl mx-auto my-10 p-2">
            <h1 className='text-center font-bold text-2xl underline mb-5'>Register Now</h1>
            <div className='flex flex-col md:flex-row justify-between items-center'>
                <div className='w-1/2'>
                    <img src={login} alt="" />
                </div>
                <div className='w-full md:w-1/2'>
                    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                        <label className='font-bold text-xl mb-3' htmlFor="">Your Name</label><br />
                        <input type="text" placeholder="Name"
                            className='p-3 w-full border'
                            {...register("Name", {
                                required: { value: true, message: 'Provide a Name' }
                            })} />
                        {
                            errors.Name && <p className='text-red-600 font-bold'>{errors.Name.message}</p>
                        }
                        <label className='font-bold text-xl mb-3' htmlFor="">PhotoURL</label><br />
                        <input type="text" placeholder="PhotoURL"
                            className='p-3 w-full border'
                            {...register("Photo", {
                                required: {
                                    value: true,
                                    message: 'Provide a PhotoURL'
                                }
                            })} />
                        {
                            errors.Photo && <p className='text-red-600 font-bold'>{errors.Photo.message}</p>
                        }
                        <label className='font-bold text-xl mb-3' htmlFor="">Email</label><br />
                        <input type="email" placeholder="Email"
                            className='p-3 w-full border'
                            {...register("Email", { required: { value: true, message: 'Provide a Email' } })} />
                        {
                            errors.Email && <p className='text-red-600 font-bold '>{errors.Email.message}</p>
                        }
                        <label className='font-bold text-xl mb-3' htmlFor="">Password</label><br />
                        <input type="password"
                            className='p-3 w-full border'
                            placeholder="Password"
                            {...register("Password",
                                {
                                    required: {
                                        value: true,
                                        message: 'Please Provide a valid password'
                                    },
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*[\W_]).+$/,
                                        message: 'Passwords should include at least one uppercase letter and one special character.'
                                    },
                                    minLength: {
                                        value: 6,
                                        message: 'The password must be a minimum of 6 characters in length.'
                                    }
                                })} />
                        {
                            errors.Password && <p className='text-red-600 font-bold'>{errors.Password.message}</p>
                        }

                        <input className='btn btn-accent w-full' type="submit" value='Register' />
                    </form>
                    <p className='text-xl font-semibold gap-0 text-center'>Already Have an Account? Please <Link className=' text-xl btn btn-link' to='/login'>Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;