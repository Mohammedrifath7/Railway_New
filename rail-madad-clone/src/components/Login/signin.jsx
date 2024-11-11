import React, { useState } from 'react';
import { BsFillShieldLockFill, BsTelephoneFill } from 'react-icons/bs';
import OtpInput from "otp-input-react";
import PhoneInput from 'react-phone-input-2';
import { CgSpinner } from 'react-icons/cg';
import "react-phone-input-2/lib/style.css";
import { auth } from './firebase.config';
import toast, { Toaster } from 'react-hot-toast';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';


function Signin() {
  const [otp, setOtp] = useState('');
  const [ph, setPh] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  function onCaptchverify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          onSignup();
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
        }
      }, auth);
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchverify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = '+' + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success('OTP sent successfully');
      }).catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error('SMS not sent');
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult.confirm(otp).then(async (res) => {
      console.log(res);
      setUser(res.user);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
      setLoading(false);
      toast.error('Invalid OTP');
    });
  }

  return (
    <section className="signin-section">
      <div className="signin-container">
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {
          !user ? (
            <div className="signin-box">
              <h1>Welcome</h1>
              {
                showOTP ? (
                  <>
                    <div className="icon-container">
                      <BsFillShieldLockFill size={30} />
                    </div>
                    <label htmlFor="otp">Enter Your OTP</label>
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      separator={<span>-</span>}
                      isInputNum
                      shouldAutoFocus
                      className="otp-container"
                    />
                    <button onClick={onOTPVerify} className="signin-btn">
                      {loading && <CgSpinner size={20} className="spinner" />}
                      <span>Verify OTP</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="icon-container">
                      <BsTelephoneFill size={30} />
                    </div>
                    <label htmlFor="ph">Verify your phone number</label>
                    <PhoneInput country={"in"} value={ph} onChange={setPh} />
                    <button onClick={onSignup} className="signin-btn">
                      {loading && <CgSpinner size={20} className="spinner" />}
                      <span>Send code via SMS</span>
                    </button>
                  </>
                )
              }
            </div>
          ) : (
            <h2>Login Success</h2>
          )
        }
      </div>
    </section>
  );
}

export default Signin;