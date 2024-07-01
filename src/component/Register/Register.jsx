import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import auth from "../firebase/firebase.config";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";
import { FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";

const Register = () => {
    const [registerError, setregisterError] = useState('');
    const [success, setsuccess] = useState('');
    const [showpassword, setShowpassword] = useState(false);

    const handleRegister = e => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const accepted = e.target.terms.checked;
        console.log(name, email, password,accepted)
        setregisterError('');
        setsuccess('');
        if (password.length < 6) {
            setregisterError('Password should be at least 6 characters or longer');
            return;
        } else if (!/[A-Z]/.test(password)) {
            setregisterError('Your password should have at least one upper case characters.')
            return;
        }else if(!accepted){
            setregisterError('Please accept our terms and conditions!')
            return;
        }

        // create user 
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {

                const user = result.user;
                console.log(user);
                setsuccess('user create successfully');

                // update profile
                updateProfile(result.user, {
                    displayName: name, 
                    photoURL: "https://example.com/jane-q-user/profile.jpg"
                })
                .then( () => console.log('profile updated'))
                .catch()

                // send varification email 
                sendEmailVerification(result.user)
                .then( () =>{
                    alert('Please check your email and verify your account')
                })
            })
            .catch((error) => {
                console.log(error);
                const errorMessage = error.message;
                setregisterError(errorMessage);
            });
    }

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="card w-full max-w-sm p-6 bg-white shadow-md rounded-md">
                <h2 className="text-3xl mb-8 text-center">Please Register</h2>
                <form action="" onSubmit={handleRegister} >
                    <input className="mb-4 w-full  py-2 px-4" type="text" name="name" placeholder="Your Name" id="" required />
                    <br />

                    <input className=" w-full  py-2 px-4 mb-3" type="email" name="email"
                        placeholder="Email Address" id="" required />
                    <br />

                    <div className=" mb-4 relative border">
                        <input className=" w-full py-2 px-4 "
                            type={showpassword ? "text" : "password"} name="password" placeholder="password "
                            required />
                        <span className="cursor-pointer absolute top-3 right-2" onClick={() => setShowpassword(!showpassword)}>{showpassword ? <FaEyeSlash /> : <FiEye />}</span>
                    </div>

                    {/* checkbox  */}
                    <div className="mb-2">
                        <input type="checkbox" name="terms" id="terms" />
                        <label className="ml-2" htmlFor="terms">Accept our <a href="">Terms and Conditions</a></label>
                    </div>

                    {/* submit button  */}
                    <input className="btn btn-secondary mb-4 w-full" type="submit" value="Register" />
                </form>

                {/* condition and show  */}
                {
                    registerError && <p className="text-red-500">{registerError}</p>
                }
                {
                    success && <p className="text-green-600">{success}</p>
                }
                <p>Already have an account? Please <Link to="/login">Login</Link></p>
            </div>

        </div>
    );
};

export default Register;